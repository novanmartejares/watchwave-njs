import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';

export const fetchDMCA = async () => {
	const docRef = doc(db, 'dmca', 'dmca');
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data().notices;
	} else {
		console.log('No such document!');
		throw new Error('No such document!');
	}
};
