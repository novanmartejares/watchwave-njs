// write a hook that takes in an id and a type and adds the id to the user's continue watching list

import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserAuth } from '../../context/AuthContext';

const useAddToContinueWatching = (type: string | null | undefined, id: number | null | undefined) => {
	const { user } = UserAuth();
	const add = async () => {
		if (!user || id === undefined || type === undefined) return;
		if (!id || !type) return;
		const userRef = doc(db, 'users', user.uid);
		// inside the user document, there is a field called "continueWatching" that is an array, and we are adding the id according to the type of media
		await setDoc(userRef, { continueWatching: arrayUnion({ id, type }) }, { merge: true });
	};
	const remove = async () => {
		if (!user) return;
		if (!id || !type) return;
		const userRef = doc(db, 'users', user.uid);
		await setDoc(userRef, { continueWatching: arrayRemove({ id, type }) }, { merge: true });
	};
	return { add, remove };
};

export default useAddToContinueWatching;
