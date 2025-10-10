// src/components/EmergencyContacts.jsx

import React from 'react';

const EmergencyContacts = () => {
    // Curated contacts relevant to the Kenyan context of the project
    const contacts = [
        { name: "Emergency Services (Police/Ambulance)", number: "999 / 112", description: "General distress calls (Kenya)" },
        { name: "Befrienders Kenya", number: "+254 722 178 177", description: "Emotional support, suicide prevention" },
        { name: "Kenya Red Cross Society", number: "1199", description: "Crisis and ambulance services" },
        { name: "MindTrack Counseling Hotline", number: "0790 151 458", description: "Placeholder for project-specific support line" },
    ];

    const colors = { danger: '#e55353', primary: '#4c9aff', text: '#333', background: '#fff9f9' };

    return (
        <div style={{ 
            padding: '30px', 
            backgroundColor: colors.background, // Distinct color to highlight importance
            borderRadius: '15px', 
            border: `2px solid ${colors.danger}`, 
            boxShadow: '0 4px 15px rgba(229, 83, 83, 0.2)' 
        }}>
            <h2 style={{ color: colors.danger, marginBottom: '20px', borderBottom: `2px solid ${colors.danger}`, paddingBottom: '10px' }}>
                🚨 Immediate Help & Emergency Contacts
            </h2>
            
            <p style={{ color: colors.text, marginBottom: '20px', fontWeight: 'bold' }}>
                If you are in crisis, please use these contacts immediately.
            </p>

            <div style={{ display: 'grid', gap: '15px' }}>
                {contacts.map((contact, index) => (
                    <div key={index} style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0', color: colors.text, display: 'flex', justifyContent: 'space-between' }}>
                            {contact.name}
                            <a 
                                href={`tel:${contact.number.replace(/\s/g, '')}`} 
                                style={{ color: colors.primary, textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                {contact.number}
                            </a>
                        </h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
                            {contact.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmergencyContacts;