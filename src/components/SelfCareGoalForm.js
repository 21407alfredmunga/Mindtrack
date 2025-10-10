// src/components/SelfCareGoalForm.jsx

import React, { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { collection, addDoc } from 'firebase/firestore';

const SelfCareGoalForm = () => {
    const { currentUser } = useAuth();
    const [goalType, setGoalType] = useState('');
    const [frequency, setFrequency] = useState('Daily');
    const [targetDate, setTargetDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // List of common goals suggested by the MindTrack literature review [cite: 305, 209]
    const goalOptions = ["Meditate 10 mins", "Read 20 pages", "Exercise 30 mins", "Go to bed by 11 PM", "Journal"];

    const handleSaveGoal = async (e) => {
        e.preventDefault();
        if (!goalType || !targetDate) {
            alert("Please select a goal and a target date.");
            return;
        }
        if (!currentUser) return;

        setIsSaving(true);
        try {
            // Save the new goal to the SelfCareGoal collection
            await addDoc(collection(db, 'SelfCareGoal'), {
                user_id: currentUser.uid,
                goal_type: goalType,
                frequency: frequency,
                target_date: new Date(targetDate), // Convert string to Date object for Firestore
                created_at: new Date(),
                status: 'Active',
            });
            
            alert(`Goal "${goalType}" successfully set!`);
            setGoalType('');
            setFrequency('Daily');
            setTargetDate('');
        } catch (error) {
            console.error("Error setting goal:", error);
            alert("Failed to set goal.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSaveGoal}>
            <h3 style={{ color: '#4c9aff', marginBottom: '20px' }}>Set a Self-Care Goal</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Goal Type:</label>
                <select 
                    value={goalType} 
                    onChange={(e) => setGoalType(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    required
                >
                    <option value="">-- Select Goal --</option>
                    {goalOptions.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Frequency:</label>
                <select 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="Daily">Daily</option>
                    <option value="3 times a week">3 times a week</option>
                    <option value="Weekly">Weekly</option>
                </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Target Completion Date:</label>
                <input 
                    type="date" 
                    value={targetDate} 
                    onChange={(e) => setTargetDate(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={isSaving}
                style={{ width: '100%', padding: '12px', backgroundColor: '#4c9aff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                {isSaving ? 'Saving...' : 'Set Goal'}
            </button>
        </form>
    );
};

export default SelfCareGoalForm;