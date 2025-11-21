// src/components/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import DailyVerse from './DailyVerse';
import MoodLogger from './MoodLogger';
import MoodTrends from './MoodTrends';
import SelfCareGoalForm from './SelfCareGoalForm';
import GoalTracker from './GoalTracker';
import ResourceList from './ResourceList';
import EmergencyContacts from './EmergencyContacts';
import WelcomeBanner from './WelcomeBanner';
import DailyCheckIn from './DailyCheckIn';
import ResourcesPage from './ResourcesPage';
import ProfilePage from './ProfilePage';
import CommunitySpace from './CommunitySpace';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('home');
    const [isWide, setIsWide] = useState(window.innerWidth > 1000); 

    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth > 1000);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🎨 Reusable Card Style
    const cardBoxStyle = {
        padding: '25px',
        backgroundColor: theme.cardBg,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: `1px solid ${theme.border}`,
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to log out. Please try again.");
        }
    };
    
    // LOGIC: Determine the display name
    const userDisplayName = currentUser?.displayName 
        ? currentUser.displayName.split(' ')[0]
        : (currentUser?.email.split('@')[0] || 'User'); 

    // Capitalize the first letter for a clean display
    const formattedDisplayName = userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1);

    // Navigation items
    const navItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'track', icon: '📊', label: 'Track' },
        { id: 'resources', icon: '📚', label: 'Resources' },
        { id: 'community', icon: '👥', label: 'Community' }
    ];


    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: theme.background,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        }}>
            {/* Sidebar Navigation */}
            <aside style={{
                width: '240px',
                backgroundColor: theme.sidebarBg,
                borderRight: `1px solid ${theme.border}`,
                padding: '30px 0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '0 25px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '24px' }}>🧠</span>
                    <h1 style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        color: theme.text,
                        margin: 0
                    }}>Serene</h1>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '0 15px' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                marginBottom: '8px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: activeView === item.id ? theme.hoverBg : 'transparent',
                                color: activeView === item.id ? theme.primary : theme.textLight,
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textAlign: 'left',
                                fontWeight: activeView === item.id ? '500' : '400',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (activeView !== item.id) {
                                    e.currentTarget.style.backgroundColor = theme.hoverBg;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeView !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Profile Section */}
                <div 
                    onClick={() => setActiveView('profile')}
                    style={{
                        padding: '15px 25px',
                        borderTop: `1px solid ${theme.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeView === 'profile' ? theme.hoverBg : 'transparent',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'profile') {
                            e.currentTarget.style.backgroundColor = theme.hoverBg;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'profile') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '20px' }}>👤</span>
                    <span style={{
                        fontSize: '15px',
                        color: activeView === 'profile' ? theme.primary : theme.textLight,
                        fontWeight: activeView === 'profile' ? '500' : '400'
                    }}>Profile</span>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: '240px',
                flex: 1,
                padding: '40px',
                maxWidth: '1400px'
            }}>
                {/* Conditional Rendering Based on Active View */}
                {activeView === 'track' ? (
                    <DailyCheckIn />
                ) : activeView === 'resources' ? (
                    <ResourcesPage onNavigateToTrack={() => setActiveView('track')} />
                ) : activeView === 'profile' ? (
                    <ProfilePage />
                ) : activeView === 'community' ? (
                    <CommunitySpace />
                ) : (
                    <>
                        {/* Top Bar with Greeting and Avatar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{
                                fontSize: '32px',
                                fontWeight: '600',
                                color: theme.text,
                                margin: 0
                            }}>
                                Good morning, {formattedDisplayName}
                            </h2>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: theme.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                fontSize: '20px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                {formattedDisplayName.charAt(0)}
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isWide ? '2fr 1fr' : '1fr',
                            gap: '25px'
                        }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* Verse of the Day */}
                        <div style={cardBoxStyle}>
                            <DailyVerse />
                        </div>

                        {/* Mood Logger and Trends in 2 columns */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isWide ? '1fr 1fr' : '1fr',
                            gap: '25px'
                        }}>
                            <div style={cardBoxStyle}>
                                <MoodLogger />
                            </div>
                            <div style={cardBoxStyle}>
                                <MoodTrends />
                            </div>
                        </div>

                        {/* Quick Resources */}
                        <div style={cardBoxStyle}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: theme.text,
                                marginBottom: '20px',
                                marginTop: 0
                            }}>Quick Resources</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    backgroundColor: '#EBF5FF',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>🧘</div>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: theme.text
                                    }}>Breathing Exercises</span>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    backgroundColor: '#EBF5FF',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>🆘</div>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: theme.text
                                    }}>Crisis Helpline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Self-Care Goals */}
                    <div style={cardBoxStyle}>
                        <GoalTracker />
                    </div>
                </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;