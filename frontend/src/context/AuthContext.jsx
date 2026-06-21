import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // Automatically create or update the user document in Firestore
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            provider: user.providerData[0]?.providerId || 'password',
            lastLogin: serverTimestamp(),
            // createdAt is handled via merge: true so it won't overwrite existing
          }, { merge: true });
        } catch (error) {
          console.error("Error creating user document:", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    authLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}
