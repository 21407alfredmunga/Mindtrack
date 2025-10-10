// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore'; // Removed 'query'

// Charting imports
import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

// Must register the necessary components from Chart.js library
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const AdminDashboard = () => {
    const { isAdmin, isAdminLoading } = useAdminAuth();
    const navigate = useNavigate();
    const colors = { 
        primary: '#4c9aff', 
        secondary: '#f0f4f8', 
        text: '#333333', 
        cardBackground: '#fff',
        moods: { happy: '#4CAF50', neutral: '#FFC107', sad: '#FF7043', anxious: '#2196F3' }
    };

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMoodEntries: 0,
        moodDistribution: {}
    });
    const [dataLoading, setDataLoading] = useState(true);

    // --- Data Fetching Logic ---
    useEffect(() => {
        if (!isAdmin || isAdminLoading) return;

        const fetchAdminData = async () => {
            try {
                // 1. Fetch Total Users (from 'Users' collection)
                const usersSnapshot = await getDocs(collection(db, 'Users'));
                const totalUsers = usersSnapshot.size;

                // 2. Fetch Total Mood Entries & Distribution (from 'MoodEntry' collection)
                const moodSnapshot = await getDocs(collection(db, 'MoodEntry'));
                const totalMoodEntries = moodSnapshot.size;

                const distribution = {};
                moodSnapshot.docs.forEach(doc => {
                    const mood = doc.data().mood || 'unknown'; 
                    distribution[mood] = (distribution[mood] || 0) + 1;
                });

                setStats({
                    totalUsers,
                    totalMoodEntries,
                    moodDistribution: distribution
                });

            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchAdminData();
    }, [isAdmin, isAdminLoading]);

    // --- Authorization & Loading Display ---
    if (isAdminLoading) {
        return <div style={{ textAlign: 'center', padding: '100px', color: colors.primary }}>Loading Admin Status...</div>;
    }

    if (!isAdmin) {
        // If not admin, redirect immediately
        navigate('/dashboard'); 
        return <div style={{ textAlign: 'center', padding: '100px', color: colors.text }}>Access Denied. Redirecting...</div>;
    }

    // --- Chart Data Structure ---
    const moodLabels = Object.keys(stats.moodDistribution);
    const moodCounts = Object.values(stats.moodDistribution);
    const moodColors = moodLabels.map(label => colors.moods[label.toLowerCase()] || '#6c757d');

    const chartData = {
        labels: moodLabels,
        datasets: [
            {
                label: 'Total Entries',
                data: moodCounts,
                backgroundColor: moodColors,
                borderColor: moodColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'System-wide Mood Distribution (Anonymous)',
                font: { size: 18, weight: 'bold' }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Logs'
                }
            },
        },
    };

    // --- Component JSX Render ---
    return (
        <div style={{ backgroundColor: colors.secondary, minHeight: '100vh', padding: '30px 0', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px 40px', borderBottom: '2px solid #ddd' }}>
                <h1 style={{ color: colors.primary, fontSize: '32px', fontWeight: 'bold' }}>
                    Admin Reporting Dashboard 📊
                </h1>
                <p style={{ color: colors.text }}>
                    Aggregate anonymous data for MindTrack system health and academic reporting.
                </p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '8px 15px', marginTop: '15px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    ← Back to User Dashboard
                </button>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 30px' }}>
                <h2 style={{ color: colors.text, marginBottom: '20px' }}>System Overview</h2>
                
                {dataLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: colors.primary }}>Fetching system metrics...</div>
                ) : (
                    <>
                        {/* Data Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {/* Total User Count */}
                            <div style={{ padding: '20px', backgroundColor: colors.cardBackground, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <h4>Total Registered Users:</h4>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', color: colors.primary }}>
                                    {stats.totalUsers}
                                </p>
                            </div>
                            
                            {/* Total Mood Entries */}
                            <div style={{ padding: '20px', backgroundColor: colors.cardBackground, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <h4>Total Mood Entries Logged:</h4>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', color: colors.primary }}>
                                    {stats.totalMoodEntries}
                                </p>
                            </div>

                             {/* Average Entries Per User (Simple Calculation) */}
                            <div style={{ padding: '20px', backgroundColor: colors.cardBackground, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <h4>Avg. Logs Per User:</h4>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', color: colors.primary }}>
                                    {stats.totalUsers > 0 ? (stats.totalMoodEntries / stats.totalUsers).toFixed(1) : 0}
                                </p>
                            </div>

                        </div>

                        {/* Anonymous Mood Distribution Chart */}
                        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: colors.cardBackground, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginBottom: '20px', color: colors.text }}>Overall Mood Distribution</h3>
                            <div style={{ height: '400px' }}> 
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
                                This report uses anonymized, aggregated data only. No individual user information is accessible[cite: 147, 344].
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;