'use client';
import { motion, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { MovieDetails, fetchResults } from '../types';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { IoAdd, IoCheckmark, IoPlay } from 'react-icons/io5';

import Slider from '@/components/Slider';
import Footer from '@/components/Footer';
import { Animation } from './Animation';
import { useRouter } from 'next/navigation';
import { UserAuth } from './context/AuthContext';
import useAddToWatchlist from './firebase/addToWatchlist';
import getDocData from './firebase/getDocData';
import fetchDetails from '@/lib/fetchDetails';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';

interface Props {
	movie: MovieDetails;
	collection: fetchResults;
}

const Showcase = ({ movie, collection }: Props) => {
	const imageURL = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
	const getProperTime = (time: number) => {
		const hours = Math.floor(time / 60);
		const minutes = time % 60;
		return `${hours}h ${minutes}m`;
	};
	const router = useRouter();
	const { user, googleSignIn } = UserAuth();
	const [isInWatchlist, setIsInWatchlist] = useState(false);
	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const { add, remove } = useAddToWatchlist('movie', movie.id);
	const [cW, setCW] = useState(null);
	useEffect(() => {
		console.log(cW);
	}, [cW]);

	// record user info in firestore

	const logUser = () => {
		if (!user) return;
		const docRef = doc(db, 'users', user.uid);
		getDoc(docRef)
			.then(async (docSnap) => {
				if (!docSnap.exists()) {
					console.log('doc does not exist');
					return;
				}
				await setDoc(
					docRef,
					{
						userInfo: {
							name: user.displayName,
							email: user.email,
							photoURL: user.photoURL,
							phoneNumber: user.phoneNumber,
							uid: user.uid,
							emailVerified: user.emailVerified,
						},
					},
					{ merge: true }
				);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		console.log(user);
		if (!user) return;
		logUser();
	}, [user]);

	//get continue watching data
	useEffect(() => {
		const getCW = async () => {
			//////////////////////////
			// Continue watching //

			let continueWatching = [];
			if (user) {
				const docRef = doc(db, 'users', user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					// access continueWatching array
					const continueWatchingData = docSnap.data().continueWatching;
					if (!continueWatchingData) return;
					console.log('continueWatchingData', continueWatchingData);
					// map through the array and fetch the details of each item
					const promises = continueWatchingData.map(async (item) => {
						const res = await fetchDetails(item.id, item.type);
						return res;
					});
					// await all promises
					const results = await Promise.all(promises);
					console.log('results', results);

					continueWatching = results.map((item, i) => {
						return {
							...item,
							...results[i],
						};
					});
				}
			}

			if (continueWatching.length > 0) {
				const continueWatchingCollection = {
					heading: 'Continue Watching',
					collection: continueWatching,
				};
				setCW(continueWatchingCollection);
			}
		};
		getCW();
	}, [user]);

	// run getDocData only once
	useEffect(() => {
		if (!user) return;
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	}, [user]);

	useEffect(() => {
		if (!user) setData(null);
	}, [user]);

	useEffect(() => {
		if (!data) return;
		if (data.movie) {
			if (data.movie.includes(movie.id)) {
				setIsInWatchlist(true);
			} else {
				setIsInWatchlist(false);
			}
		}
	}, [data, user]);

	// useEffect(() => {
	//   if (document.querySelector(".animation-container") === null) return;
	//   const timer = setTimeout(() => {
	//     animate(".animation-container", { opacity: 0 }, { duration: 0.5 }).then(
	//       () => {
	//       },
	//     );
	//   }, 2500);
	//   return () => clearTimeout(timer);
	// }, []);

	const textRef = useRef<HTMLHeadingElement>(null);
	useEffect(() => {
		const textElement = textRef.current;
		const maxHeight = 100; // Adjust as needed

		if (textElement === null) return;
		while (textElement.offsetHeight > maxHeight) {
			const style = window.getComputedStyle(textElement);
			const fontSize = parseFloat(style.fontSize);

			textElement.style.fontSize = `${fontSize - 1}px`;
		}
	}, []);

	return (
		<>
			{isLoading && <Animation />}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Add to Watchlist</ModalHeader>
							<ModalBody>
								<p>You need to be logged in to add to watchlist.</p>
							</ModalBody>
							<ModalFooter>
								<Button
									onClick={() => {
										onClose();
									}}
									variant="ghost"
								>
									Cancel
								</Button>
								<Button
									onClick={() => {
										try {
											googleSignIn();
											onClose();
										} catch (e) {
											console.log(e);
										}
									}}
								>
									Login
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<main className="min-h-screen w-full overflow-hidden bg-black light">
				<div className="fc w-screen justify-start">
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="h-full w-full">
						<Image
							src={imageURL}
							priority
							alt="movie poster"
							width={1920}
							height={1080}
							className="absolute h-full w-full object-cover object-center"
						/>
						<motion.div
							initial={{
								background: 'radial-gradient(ellipse 100% 80% at 80% -50%, rgba(0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
							}}
							animate={{
								background: 'radial-gradient(ellipse 100% 80% at 80% 20%, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
							}}
							transition={{ duration: 1 }}
							className="mask absolute h-full w-full"
						/>
					</motion.div>
					<div className="fc mb-10 h-full w-full items-start justify-start">
						<div className="fc z-10 w-full items-start justify-start pt-80 sm:px-0 sm:pl-36">
							<div className="fc items-start justify-start px-5 pr-10">
								<h1 ref={textRef} className="mb-3 pr-10 text-5xl font-bold text-white md:mb-5 md:text-8xl">
									{movie.title}
								</h1>

								{/* details */}
								<ul className="showcase_detail fr gap-3 text-lg font-medium text-white/80 md:mt-1">
									{movie.vote_average !== 0 && (
										<>
											<li>{movie.vote_average.toFixed(1)}</li>
											{(movie.release_date || movie.content_rating || movie.runtime) && <li>•</li>}
										</>
									)}
									{movie.release_date && (
										<>
											<li>{new Date(movie.release_date).getFullYear()}</li>
											{(movie.content_rating || movie.runtime) && <li>•</li>}
										</>
									)}
									{movie.content_rating && (
										<>
											<li className="rounded-lg border-1 border-[#a1a1a1] px-1.5">{movie.content_rating}</li>
											{movie.runtime && <li>•</li>}
										</>
									)}
									{movie.runtime && <li>{getProperTime(movie.runtime)}</li>}
								</ul>

								<p className="mt-4 max-w-[50ch] text-base font-medium leading-normal text-white/80">{movie.overview}</p>
								<div className="fr mt-4 gap-3">
									<Button
										size="lg"
										radius="sm"
										className="group h-11 font-semibold"
										onClick={() => router.push(`/watch/movie/${movie.id}`)}
									>
										<IoPlay size={20} className="text-sm transition-transform duration-500 group-hover:scale-110 sm:text-base" />
										Play
									</Button>
									<Button
										size="lg"
										radius="sm"
										className="group h-11 text-sm font-semibold text-white hover:text-black sm:text-base"
										variant="ghost"
										onClick={() => {
											if (user) {
												if (isInWatchlist) {
													remove();
												} else {
													add();
												}
												getDocData(user)
													.then((res) => {
														setData(res);
													})
													.catch((err) => console.log(err));
											} else {
												onOpen();
											}
										}}
									>
										{!isInWatchlist ? (
											<>
												<IoAdd
													className="transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110"
													size={20}
												/>
												Add to Watchlist
											</>
										) : (
											<>
												<IoCheckmark size={20} />
												Added to Watchlist
											</>
										)}
									</Button>
								</div>
							</div>

							<div className="fc mt-10 w-full gap-10">
								{cW && cW.collection.length > 0 && (
									<Slider setIsLoading={setIsLoading} headline={cW.heading} section={cW} more={false} removeFromCW={true} />
								)}
								{Object.keys(collection).map((key) => {
									const collectionItem = collection[key as keyof fetchResults];
									return (
										<Slider setIsLoading={setIsLoading} key={key} headline={collectionItem.heading} section={collectionItem} />
									);
								})}
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</>
	);
};

export default Showcase;
