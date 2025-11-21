import React, { useState } from 'react';

const GratitudeJournal = ({ onSave }) => {
    const [gratitude1, setGratitude1] = useState('');
    const [gratitude2, setGratitude2] = useState('');
    const [gratitude3, setGratitude3] = useState('');

    const gratitudeItems = [
        { value: gratitude1, setter: setGratitude1, placeholder: '1. ...' },
        { value: gratitude2, setter: setGratitude2, placeholder: '2. ...' },
        { value: gratitude3, setter: setGratitude3, placeholder: '3. ...' }
    ];

    // Pass gratitude data to parent when changed
    React.useEffect(() => {
        if (onSave) {
            const items = [gratitude1, gratitude2, gratitude3].filter(item => item.trim() !== '');
            onSave(items);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gratitude1, gratitude2, gratitude3]);

    return (
        <div style={{ padding: '0' }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '8px',
                marginTop: 0
            }}>
                What are you grateful for?
            </h3>
            <p style={{
                fontSize: '14px',
                color: '#6C757D',
                marginBottom: '20px',
                marginTop: 0
            }}>
                Write down three things that went well.
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {gratitudeItems.map((item, index) => (
                    <textarea
                        key={index}
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        placeholder={item.placeholder}
                        rows="2"
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '15px',
                            color: '#2C3E50',
                            border: '1px solid #E1E8ED',
                            borderRadius: '8px',
                            resize: 'none',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#4A90E2';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#E1E8ED';
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default GratitudeJournal;
