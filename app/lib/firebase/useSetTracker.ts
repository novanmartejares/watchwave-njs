// write a hook that takes in an id and a type and adds the id to the user's continue watching list

import { doc, setDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserAuth } from '../../context/AuthContext';

const useSetTracker = () => {
	const { user } = UserAuth();
	const set = async (seasonNumber: number | null | undefined, episodeNumber: number | null | undefined, id: number | null | undefined) => {
		if (!user) return;
		if (!id || seasonNumber === null || episodeNumber === null) return;
		const userRef = doc(db, 'users', user.uid);
		// set tracker to season and episode
		await setDoc(
			userRef,
			{
				tracker: {
					[id]: {
						seasonNumber,
						episodeNumber,
					},
				},
			},
			{ merge: true }
		);
	};

	return { set };
};

export default useSetTracker;
