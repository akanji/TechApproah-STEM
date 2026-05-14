import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface UserData {
  fullName: string;
  email: string;
  trialStartedAt: string;
  trialExpiresAt: string;
  isSubscribed: boolean;
  uid: string;
}

/**
 * Creates or updates a user in the database with trial information.
 */
export const handleSignUp = async (uid: string, fullName: string, email: string) => {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7);

  const userDocRef = doc(db, 'users', uid);
  
  const userData = {
    displayName: fullName,
    email,
    trialStartedAt: new Date().toISOString(),
    trialExpiresAt: trialEndDate.toISOString(),
    isSubscribed: false,
    updatedAt: serverTimestamp()
  };

  try {
    // 1. Create/Update user in your database (Firebase)
    await setDoc(userDocRef, userData, { merge: true });
    
    // 2. Grant immediate access for 7 days (logic handled by checkSubscriptionStatus)
    return { status: 'success', redirect: '/dashboard' };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    return { status: 'error', error };
  }
};

/**
 * Checks if a user's subscription or trial is active.
 * Redirects to billing if the trial has expired and no subscription exists.
 */
export const checkSubscriptionStatus = (profile: any, setPage: (page: string) => void) => {
  if (!profile) return true; // Let the login process handle unauthenticated users
  
  const now = new Date();
  const expiry = new Date(profile.trialExpiresAt);

  if (!profile.isSubscribed && now > expiry) {
    // 3. Instead of window.location, we'll use internal navigation to 'pricing'
    setPage('pricing');
    return false;
  }
  
  return true;
};
