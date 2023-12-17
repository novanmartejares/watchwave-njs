import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
	FieldPath,
	FieldValue,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	deleteField,
	doc,
	getDoc,
	increment,
	serverTimestamp,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const useComment = () => {
	const { user } = UserAuth();

	const send = async (comment: string, id: number, category: string) => {
		if (!id || !user) return null;
		const uid = uuidv4();
		try {
			const docRef = doc(db, 'commentsCollection', category);

			await setDoc(
				docRef,
				{
					[id]: {
						[uid]: {
							uuid: uid,
							contentId: id,
							category: category,
							userId: user.uid,
							name: user.displayName,
							photoURL: user.photoURL,
							comment: comment,
							likes: {},
							createdAt: new Date().toISOString(),
						},
					},
				},
				{ merge: true, mergeFields: ['likes'] }
			);

			console.log('Comment sent to Firebase successfully!');
			return true;
		} catch (error) {
			console.error('Error sending comment to Firebase:', error);
			return false;
		}
	};

	const deleteC = async (commentId: string, id: number, category: string) => {
		if (!user) console.log('no user');
		if (!user) return null;

		try {
			const docRef = doc(db, 'commentsCollection', category);

			// comment is a key in an object thats the movie id
			await setDoc(
				docRef,
				{
					[id]: { [commentId]: deleteField() },
				},
				{ merge: true }
			);

			console.log('Comment deleted successfully!');
			return true;
		} catch (error) {
			console.error('Error deleting comment:', error);
			return false;
		}
	};

	const likeComment = async (commentId: string, id: number, category: string, like: boolean) => {
		if (!user) return null;

		if (like) {
			try {
				const docRef = doc(db, 'commentsCollection', category);

				await setDoc(
					docRef,
					{
						[id]: {
							[commentId]: {
								likes: {
									[user.uid]: {
										userId: user.uid,
										name: user.displayName,
										photoURL: user.photoURL,
									},
								},
							},
						},
					},
					{ merge: true, mergeFields: ['likes'] }
				);

				console.log('Comment liked successfully!');
				return true;
			} catch (error) {
				console.error('Error liking comment:', error);
				return false;
			}
		} else {
			try {
				const docRef = doc(db, 'commentsCollection', category);

				await setDoc(
					docRef,
					{
						[id]: {
							[commentId]: {
								likes: {
									[user.uid]: deleteField(),
								},
							},
						},
					},
					{ merge: true, mergeFields: ['likes'] }
				);

				console.log('Comment unliked successfully!');
				return true;
			} catch (error) {
				console.error('Error unliking comment:', error);
				return false;
			}
		}
	};

	return { send, deleteC, likeComment };
};

export default useComment;
