import { collection, doc, getFirestore, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserAuth } from '../../context/AuthContext';

const useAddToWatchlist = (type: string | null | undefined, id: number | null | undefined) => {
	const { user } = UserAuth();
	const add = async () => {
		if (!user || typeof user === 'string') return;
		if (!id || !type) return;
		const userRef = doc(db, 'users', user.uid);
		await setDoc(userRef, { [type]: arrayUnion(id) }, { merge: true });
	};
	const remove = async () => {
		if (!user || typeof user === 'string') return;
		if (!id || !type) return;
		const userRef = doc(db, 'users', user.uid);
		await setDoc(userRef, { [type]: arrayRemove(id) }, { merge: true });
	};
	return { add, remove };
};

export default useAddToWatchlist;
