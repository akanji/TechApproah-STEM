import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  onSnapshot,
  collection
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { checkSubscriptionStatus } from '../lib/auth-service';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  xp: number;
  specialization?: string;
  avatarId?: string;
  trialStartedAt?: string;
  trialExpiresAt?: string;
  isSubscribed: boolean;
}

interface LabProgressRecord {
  labId: string;
  completed: boolean;
  score: number;
  lastAttemptAt: any;
  watched?: boolean;
  notes?: string;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  progress: Record<string, LabProgressRecord>;
  loading: boolean;
  page: string;
  setPage: (page: string) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateXP: (amount: number) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  theme: "dark" | "blue" | "emerald";
  setTheme: (theme: "dark" | "blue" | "emerald") => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<Record<string, LabProgressRecord>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => localStorage.getItem("eng_page") || "home");
  const [theme, setThemeState] = useState<"dark" | "blue" | "emerald">(() => (localStorage.getItem("eng_theme") as any) || "dark");

  const setTheme = (t: "dark" | "blue" | "emerald") => {
    setThemeState(t);
    localStorage.setItem("eng_theme", t);
  };

  useEffect(() => {
    localStorage.setItem("eng_page", page);
  }, [page]);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubProgress: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Sync profile
        const userDocRef = doc(db, 'users', user.uid);
        
        unsubProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            // Ensure defaults for trial fields
            if (data.isSubscribed === undefined) data.isSubscribed = false;
            
            setProfile(data);
            
            // Check subscription/trial status
            checkSubscriptionStatus(data, setPage);
          } else {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 7);

            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Scientist',
              photoURL: user.photoURL || '',
              xp: 0,
              isSubscribed: false,
              trialStartedAt: new Date().toISOString(),
              trialExpiresAt: trialEndDate.toISOString()
            };
            setDoc(userDocRef, {
              ...newProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });

        // Sync progress
        const progressColRef = collection(db, 'users', user.uid, 'progress');
        unsubProgress = onSnapshot(progressColRef, (snapshot) => {
          const progMap: Record<string, LabProgressRecord> = {};
          snapshot.forEach(doc => {
            progMap[doc.id] = doc.data() as LabProgressRecord;
          });
          setProgress(progMap);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}/progress`);
        });

      } else {
        setProfile(null);
        setProgress({});
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      if (unsubProgress) unsubProgress();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateXP = async (amount: number) => {
    if (!user || !profile) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, {
        xp: profile.xp + amount,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <UserContext.Provider value={{ user, profile, progress, loading, page, setPage, login, logout, updateXP, updateProfile, theme, setTheme }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
