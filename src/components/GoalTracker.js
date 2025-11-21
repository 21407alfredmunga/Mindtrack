import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    addDoc,
    doc 
} from 'firebase/firestore';

const GoalTracker = () => {
    const { currentUser } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Predefined goals with progress tracking
    const defaultGoals = [
        { id: 'hydrate', name: 'Hydrate', target: 2, current: 1.5, unit: 'L' },
        { id: 'journaling', name: 'Journaling', target: 1, current: 1, unit: 'session' },
        { id: 'mindful', name: 'Mindful Minutes', target: 10, current: 5, unit: 'min' },
        { id: 'walk', name: 'Walk', target: 30, current: 0, unit: 'min' }
    ];

    useEffect(() => {
        // For now, use default goals. In production, fetch from Firestore
        setGoals(defaultGoals);
        setLoading(false);
    }, [currentUser]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#6C757D' }}>Loading...</div>;
    }
    
    return (
        <div style={{ padding: '0' }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '15px',
                marginTop: 0
            }}>
                Self-Care Goals
            </h3>
            
            {goals.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6C757D', fontSize: '14px' }}>
                    No active goals yet.
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {goals.map(goal => {
                        const progress = Math.min((goal.current / goal.target) * 100, 100);
                        const isCompleted = progress >= 100;

                        return (
                            <div key={goal.id}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: '#2C3E50'
                                    }}>
                                        {goal.name}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        color: isCompleted ? '#10B981' : '#6C757D'
                                    }}>
                                        {isCompleted ? 'Completed' : `${goal.current}${goal.unit} / ${goal.target}${goal.unit}`}
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: '#E1E8ED',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        backgroundColor: isCompleted ? '#10B981' : '#4A90E2',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GoalTracker;
