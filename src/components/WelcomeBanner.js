// src/components/WelcomeBanner.jsx

import React, { useState, useEffect } from 'react';

// Sample animated quotes to cycle through
const WELLNESS_QUOTES = [
    "Your mind is a garden. Your thoughts are the seeds. You can grow flowers or you can grow weeds.",
    "Breathe. It's just a bad day, not a bad life.",
    "Self-care is not selfish. It is essential.",
    "The journey of a thousand miles begins with a single step.",
    "You are stronger than you think. You got this.",
];

const WelcomeBanner = ({ currentUser, colors }) => {
    const [greeting, setGreeting] = useState('');
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    // 1. Determine time-based greeting & cycle quotes
    useEffect(() => {
        const hours = new Date().getHours();
        let timeGreeting;
        if (hours < 12) {
            timeGreeting = "Good morning! ☀️";
        } else if (hours < 18) {
            timeGreeting = "Good afternoon! ☕";
        } else {
            timeGreeting = "Good evening! 🌙";
        }
        setGreeting(timeGreeting);

        // 2. Cycle quotes every 8 seconds
        const quoteTimer = setInterval(() => {
            setCurrentQuoteIndex(prevIndex => 
                (prevIndex + 1) % WELLNESS_QUOTES.length
            );
        }, 8000); // Cycles quote every 8 seconds

        return () => clearInterval(quoteTimer);
    }, []);

    // Logic: Prioritize displayName, fallback to email prefix
    const fullName = currentUser?.displayName;
    
    // Extract the first name, or use email prefix/default "User" as fallback
    const firstName = fullName 
        ? fullName.split(' ')[0] 
        : (currentUser?.email.split('@')[0] || 'User');
    
    // Ensure the name is capitalized for a clean look
    const userNameDisplay = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    
    return (
        <div>
            <h2 style={{ 
                color: colors.primary, 
                fontSize: '28px', 
                marginBottom: '5px',
            }}>
                {greeting}
            </h2>
            <h1 style={{ 
                color: colors.text, 
                fontSize: '32px', 
                fontWeight: 'bold',
                marginBottom: '20px',
            }}>
                Welcome Back, {userNameDisplay}! 
                {/* ☝️ The extraneous ** characters have been removed here. */}
            </h1>
            
            {/* Animated Wellness Quote */}
            <div style={{ 
                borderLeft: `3px solid ${colors.primary}`, 
                paddingLeft: '15px',
                fontStyle: 'italic',
                minHeight: '40px', // Prevents layout shift
            }}>
                <p style={{ 
                    color: colors.text, 
                    fontSize: '16px',
                    transition: 'opacity 1s ease-in-out',
                    opacity: 1, 
                }}>
                    "{WELLNESS_QUOTES[currentQuoteIndex]}"
                </p>
            </div>
        </div>
    );
};

export default WelcomeBanner;