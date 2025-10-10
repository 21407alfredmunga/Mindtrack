// src/components/MoodLogger.jsx

import React, { useState } from 'react';
import { db } from '../firebase'; // Firestore DB instance
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // Current user details

// Define colors for the MoodLogger interface
const colors = { primary: '#4c9aff', secondary: '#f0f4f8', text: '#333333' };

// Map mood types to a unique identifier or emoji (optional)
const moodOptions = ['Happy 😀', 'Neutral 😐', 'Sad 😥', 'Anxious 😟', 'Stressed 🥵'];

const MoodLogger = () => {
    const { currentUser } = useAuth();
    const [selectedMood, setSelectedMood] = useState(null);
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const logMood = async () => {
        if (!selectedMood) {
            alert("Please select your mood before saving.");
            return;
        }
        if (!currentUser) return; // Should be handled by ProtectedRoute, but good for safety

        setIsSaving(true);

        try {
            await addDoc(collection(db, 'MoodEntry'), {
                user_id: currentUser.uid, // Get the unique user ID from the Auth Context
                mood_type: selectedMood,
                note: reflection,
                timestamp: new Date(),
            });
            
            alert(`Mood (${selectedMood}) logged successfully!`);
            // Reset state
            setSelectedMood(null);
            setReflection('');

        } catch (error) {
            console.error("Error logging mood:", error);
            alert("Failed to save mood. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '50px auto', backgroundColor: colors.secondary, borderRadius: '15px' }}>
            <h2 style={{ color: colors.primary, textAlign: 'center', marginBottom: '30px' }}>
                Mood & Activity Logging
            </h2>
            
            <p style={{ textAlign: 'center', marginBottom: '20px', color: colors.text }}>
                How are you feeling today, {currentUser?.email}?
            </p>

            {/* Mood Selection */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                {moodOptions.map(mood => (
                    <button 
                        key={mood} 
                        onClick={() => setSelectedMood(mood)} 
                        disabled={isSaving}
                        style={{
                            padding: '10px 15px', 
                            borderRadius: '20px', 
                            border: `2px solid ${selectedMood === mood ? colors.primary : colors.text}`,
                            backgroundColor: selectedMood === mood ? colors.primary : 'white',
                            color: selectedMood === mood ? 'white' : colors.text,
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                        }}>
                        {mood}
                    </button>
                ))}
            </div>

            {/* Reflection Text Area */}
            <textarea
                placeholder="Write a personal reflection or detail what influenced your mood..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows="5"
                disabled={isSaving}
                style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '10px', 
                    border: `1px solid ${colors.text}`, 
                    marginBottom: '20px', 
                    fontSize: '16px',
                    boxSizing: 'border-box'
                }}
            />
            
            {/* Save Button */}
            <button 
                onClick={logMood}
                disabled={!selectedMood || isSaving}
                style={{ 
                    width: '100%', 
                    padding: '15px', 
                    backgroundColor: isSaving ? '#aaa' : colors.primary, 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                }}>
                {isSaving ? 'Saving...' : 'Save Mood Entry'}
            </button>
        </div>
    );
};

export default MoodLogger;