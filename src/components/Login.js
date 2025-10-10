// src/components/Login.jsx

import React, { useState } from 'react';
// 1. Import necessary components
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import your configured auth instance

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For error messages
  
  // 2. Initialize useNavigate for redirection
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // 3. CORE LOGIC: Integrate Firebase sign-in and redirection
    try {
        await signInWithEmailAndPassword(auth, email, password);

        // Success: Redirect the user to the protected dashboard (root path)
        navigate('/', { replace: true }); 

    } catch (firebaseError) {
        console.error('Login error:', firebaseError);
        // Handle common errors for display
        let errorMessage = "Login failed. Please check your credentials.";
        if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/user-not-found') {
            errorMessage = "Invalid email or password.";
        }
        setError(errorMessage);
    }
  };
  
  // --- Define a Calming Color Palette ---
  const colors = {
    primary: '#4c9aff', 
    secondary: '#f0f4f8', 
    text: '#333333', 
    subtleBorder: '#cccccc',
    background: '#ffffff',
  };
  
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        backgroundColor: colors.secondary, 
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div 
        style={{ 
          maxWidth: '400px', 
          width: '100%',
          padding: '30px', 
          backgroundColor: colors.background,
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <h2 
          style={{ 
            color: colors.primary, 
            marginBottom: '30px',
            fontWeight: '600'
          }}
        >
          MindTrack Login 🧘
        </h2>
        
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          
          {/* Display error message */}
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px',
                border: `1px solid ${colors.subtleBorder}`,
                borderRadius: '6px', 
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px',
                border: `1px solid ${colors.subtleBorder}`,
                borderRadius: '6px', 
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          
          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: colors.primary, 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a87f7'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary} 
          >
            Log In
          </button>
          
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: colors.text }}>
            Don't have an account? <a href="/register" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;