// src/hooks/useAdminAuth.js

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { doc, getDoc } from 'firebase/firestore';

export const useAdminAuth = () => {
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            setIsAdminLoading(true);
            setIsAdmin(false);

            if (currentUser) {
                try {
                    // Fetch the user's document from Firestore
                    const userRef = doc(db, 'Users', currentUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        // Check the 'isAdmin' field
                        const data = docSnap.data();
                        if (data.isAdmin === true) {
                            setIsAdmin(true);
                        }
                    }
                } catch (error) {
                    console.error("Error checking admin status:", error);
                }
            }
            setIsAdminLoading(false);
        };

        checkAdminStatus();
    }, [currentUser]); // Re-run check whenever the current user changes

    return { isAdmin, isAdminLoading };
};