import React, { useState } from 'react';
// Import Firebase functions: createUserWithEmailAndPassword and **updateProfile**
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; 
// Assuming you have a way to navigate after registration, e.g., react-router-dom
// import { useNavigate } from 'react-router-dom'; 

const colors = {
    primary: '#4c9aff',
    secondary: '#f0f4f8',
    text: '#333333',
    subtleBorder: '#cccccc',
    background: '#ffffff',
};

function Register() {
  // const navigate = useNavigate(); // Uncomment if you are using react-router-dom
  
  // ⭐️ NEW STATE: For first and last name
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); 

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // ⭐️ NEW VALIDATION: Ensure names are entered
    if (!firstName || !lastName) {
        setError("Please enter your first and last name.");
        return;
    }

    try {
      // 1. Create the user account using email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );

      const user = userCredential.user;

      // 2. ⭐️ UPDATE PROFILE: Set the display name using Firebase's built-in profile update
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await updateProfile(user, {
          displayName: fullName,
      });
      
      console.log('User registered successfully:', user.email, 'with display name:', fullName);
      
      alert(`Registration Successful! Welcome, ${firstName}! You can now log in.`);
      // TODO: Redirect user to the Login page or Dashboard
      // navigate('/login'); 

    } catch (firebaseError) {
      console.error('Registration error:', firebaseError.message);
      
      let errorMessage = "Registration failed. Please check your credentials.";
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use by another account.";
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      }

      setError(errorMessage);
    }
  };
  
  // --- Input Field Style Helper ---
  const inputStyle = { 
    width: '100%', padding: '12px', fontSize: '16px',
    border: `1px solid ${colors.subtleBorder}`, borderRadius: '6px', boxSizing: 'border-box',
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
          MindTrack Sign Up 📝
        </h2>
        
        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

          {/* ⭐️ NEW: First and Last Name Fields */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ ...inputStyle, width: '50%' }}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ ...inputStyle, width: '50%' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          
          <button 
            type="submit"
            style={{ 
              width: '100%', padding: '14px', backgroundColor: colors.primary, color: 'white', 
              border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a87f7'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary} 
          >
            Create Account
          </button>
          
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: colors.text }}>
            Already have an account? <a href="/login" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 'bold' }}>Login Here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;