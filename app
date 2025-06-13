import { useState, useEffect, useRef } from "react";
import "../styles/globals.css";
import outputs from "../../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import { getCurrentUser } from 'aws-amplify/auth';
import Layout from '../../components/shared/layout';

Amplify.configure(outputs);

function ProfileDropdown({ signOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const dropdownRef = useRef(null);

  // Get current authenticated user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username || user.signInDetails?.loginId || '');
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrentUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#667eea',
          border: 'none',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#5a67d8';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#667eea';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {getInitials(currentUser)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          backgroundColor: '#1a1d29',
          border: '1px solid #2d3748',
          borderRadius: '8px',
          minWidth: '200px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* User Info Section */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #2d3748',
            backgroundColor: '#252936'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: 'white'
              }}>
                {getInitials(currentUser)}
              </div>
              <div>
                <div style={{
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  {currentUser || 'Loading...'}
                </div>
                <div style={{
                  color: '#718096',
                  fontSize: '12px'
                }}>
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                // Add profile page navigation here if you have one
                // router.push('/profile');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d3748';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              👤 View Profile
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Add settings page navigation here if you have one
                // router.push('/settings');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d3748';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ⚙️ Settings
            </button>

            <div style={{
              height: '1px',
              backgroundColor: '#2d3748',
              margin: '8px 0'
            }} />

            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#f56565',
                fontSize: '14px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d3748';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            {/* Top Navigation Bar */}
            <nav style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              height: '60px',
              backgroundColor: 'rgba(26, 29, 41, 0.95)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid #2d3748',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              zIndex: 50
            }}>
              {/* Logo/Brand (optional) */}
              <div style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Velocity
              </div>

              {/* Profile Dropdown */}
              <ProfileDropdown signOut={signOut} />
            </nav>

            {/* Main Content with top padding to account for fixed nav */}
            <div style={{ paddingTop: '60px' }}>
              <Component {...pageProps} />
            </div>
          </>
        )}
      </Authenticator>
    </Layout>
  );
}
