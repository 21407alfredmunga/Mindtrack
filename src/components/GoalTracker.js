import React, { useState, useEffect, useCallback } from 'react'; // <<< ADD useCallback
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc 
} from 'firebase/firestore';

const GoalTracker = () => {
    const { currentUser } = useAuth();
    const [activeGoals, setActiveGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const colors = { primary: '#4c9aff', success: '#4CAF50', text: '#333' };

    // Function to fetch active goals from Firestore
    // <<< 1. WRAP THE FUNCTION IN useCallback AND LIST ITS DEPENDENCIES
    const fetchActiveGoals = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'SelfCareGoal'),
                where("user_id", "==", currentUser.uid),
                where("status", "==", "Active")
            );
            
            const snapshot = await getDocs(q);
            const goalsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setActiveGoals(goalsList);
        } catch (error) {
            console.error("Error fetching goals:", error);
        } finally {
            setLoading(false);
        }
    // Because this function uses currentUser, we list it as a dependency for useCallback
    }, [currentUser]); 


    // Fetch goals when the component first loads or when the user changes
    useEffect(() => {
        // <<< 2. NOW CALL THE FUNCTION
        fetchActiveGoals(); 
    // <<< 3. ADD fetchActiveGoals TO THE DEPENDENCY ARRAY (Fixes the warning)
    }, [fetchActiveGoals]); 


    // Function to mark a goal as completed (This part is unchanged)
    const handleCompleteGoal = async (goalId) => {
        if (!window.confirm("Mark this goal as completed?")) return;

        try {
            const goalRef = doc(db, 'SelfCareGoal', goalId);
            
            await updateDoc(goalRef, {
                status: 'Completed',
                completed_at: new Date()
            });
            
            // Re-fetch the goals list to ensure the UI is fresh
            fetchActiveGoals(); 

            alert("Goal successfully marked as Completed! Great job!");

        } catch (error) {
            console.error("Error completing goal:", error);
            alert("Failed to update goal status.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px', color: colors.primary }}>Loading Active Goals...</div>;
    }
    
    // ... rest of the render JSX remains the same
    return (
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '10px', backgroundColor: '#fff' }}>
            <h3 style={{ color: colors.primary, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Your Active Goals ({activeGoals.length})
            </h3>
            
            {activeGoals.length === 0 ? (
                <p style={{ textAlign: 'center', color: colors.text }}>
                    You have no active self-care goals right now. Set one using the form below!
                </p>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {activeGoals.map(goal => (
                        <div 
                            key={goal.id} 
                            style={{ 
                                padding: '15px', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#fafffa'
                            }}
                        >
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: colors.text }}>{goal.goal_type} ({goal.frequency})</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                    Target: {goal.target_date.toDate().toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCompleteGoal(goal.id)}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: colors.success,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}
                            >
                                Complete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GoalTracker;