import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase';

interface AuthContextType {
	user: User | null;
	googleSignIn: () => Promise<void>;
	logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
	children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
	const [user, setUser] = useState<User | null>(null);

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	};

	const logOut = async () => {
		await signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={{ user, googleSignIn, logOut }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('UserAuth must be used within an AuthContextProvider');
	}
	return context;
};
