// src/components/ResourceList.jsx

import React from 'react';

// --- Updated Resource Data Array with Real, Targeted Links ---
const RESOURCES_DATA = [
    {
        id: 1,
        title: "Kenya Red Cross Society",
        description: "Free and confidential support for individuals experThe health department embraces the integration approach to ensure affordable, accessible and equitable community-based health care.iencing mental distress or suicidal thoughts in Kenya.",
        link: "https://www.redcross.or.ke/", // Use 'tel:' for click-to-call on mobile
        source: "Kenya Red Cross Society"
    },
    {
        id: 2,
        title: "Find a Therapist in Kenya",
        description: "Directory to find licensed counselors and psychologists across Kenya.",
        link: "https://www.kenyacounselors.co.ke/directory",
        source: "Kenya Counselors and Psychologists Association"
    },
    {
        id: 3,
        title: "Mastering Sleep Hygiene Guide",
        description: "The official guide to essential tips and best practices for improving your sleep quality.",
        link: "https://www.sleepfoundation.org/sleep-hygiene",
        source: "Sleep Foundation"
    },
    {
        id: 4,
        title: "Youth-Led Mental Health Support",
        description: "Access to technology-driven and peer-based mental health resources for young people in Kenya.",
        link: "https://mental360.or.ke/",
        source: "Mental 360"
    },
    {
        id: 5,
        title: "Practical Anxiety Management",
        description: "12 Anxiety Self-Help Tips To Try At Homeques and practical steps for coping with everyday anxiety and worry.",
        link: "https://www.simplypsychology.org/self-help-for-anxiety.html",
        source: "HelpGuide"
    },
];

const ResourceList = () => {
    // Defined a clean color palette for component styling
    const colors = { 
        primary: '#6a82fb',       // Lavender/Periwinkle
        text: '#4a4a4a',          // Soft text color
        cardBorder: '#d4e1f5',    // Light pastel blue border
    };

    const cardStyle = {
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none', // Important: removes underline from the anchor tag logic
        display: 'block'
    };

    return (
        <div>
            <h2 style={{ 
                color: colors.primary, 
                fontSize: '24px', 
                marginBottom: '20px', 
                borderBottom: `2px solid ${colors.cardBorder}`, 
                paddingBottom: '10px' 
            }}>
                Wellness & Support Resources
            </h2>
            
            {RESOURCES_DATA.map(resource => (
                // Using an anchor tag for better accessibility and correct URL redirection
                <a
                    key={resource.id}
                    href={resource.link}
                    target={resource.link.startsWith('tel:') ? '_self' : '_blank'} // Hotlines should dial, others open in new tab
                    rel="noopener noreferrer"
                    style={cardStyle}
                    // Added hover effect for better user interaction feedback
                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <h3 style={{ color: colors.text, fontSize: '18px', marginBottom: '5px' }}>
                        {resource.title}
                    </h3>
                    <p style={{ color: colors.text, fontSize: '14px', marginBottom: '8px' }}>
                        {resource.description}
                    </p>
                    <p style={{ color: colors.primary, fontSize: '12px', fontWeight: 'bold' }}>
                        Source: {resource.source}
                    </p>
                </a>
            ))}
        </div>
    );
};

export default ResourceList;