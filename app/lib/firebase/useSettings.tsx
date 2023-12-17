import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserAuth } from '@/app/context/AuthContext';

const useSettings = () => {
	const defaultSettings = {
		faviconChange: false,
		sliderScroll: false,
	};

	const { user } = UserAuth();

	const setSetting = async (key: string, value: any) => {
		if (!user) {
			localStorage.setItem(key, value);
			return;
		}
		const ref = doc(db, 'users', user.uid, 'settings', key);
		await setDoc(ref, { value }, { merge: true });
	};

	const getSetting = async (key: string) => {
		if (!user) {
			return localStorage.getItem(key);
		}
		const ref = doc(db, 'users', user.uid, 'settings', key);
		const docSnap = await getDoc(ref);
		if (docSnap.exists()) {
			return docSnap.data().value;
		}
		return null;
	};

	return { getSetting, setSetting };
};

export default useSettings;
