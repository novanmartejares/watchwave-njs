'use client';
import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import ContentCard from '@/app/components/ContentCard';
import fetchDetails from '@/app/lib/fetchDetails';
import { MovieDetails, ShowDetails } from '@/types';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import Loading from '../loading';
import { AnimatePresence, motion } from 'framer-motion';

const Watchlist = () => {
	const { user } = UserAuth();
	const [value, loading, error] = useDocumentData(doc(db, 'users/' + user?.uid));
	console.log(value, loading, error);
	const [movies, setMovies] = useState<MovieDetails[]>([]);
	const [tv, setTv] = useState<ShowDetails[]>([]);

	const getStuff = async () => {
		if (!value) return;
		const tempMovies = await Promise.all(value.movie.map((id) => fetchDetails(id, 'movie')));
		const tempTv = await Promise.all(value.tv.map((id) => fetchDetails(id, 'tv')));

		tempMovies.forEach((movie) => (movie.media_type = 'movie'));
		tempTv.forEach((tv) => (tv.media_type = 'tv'));

		setMovies(tempMovies);
		setTv(tempTv);
	};

	useEffect(() => {
		console.log(movies.length, tv.length);
	}, [movies, tv]);

	useEffect(() => {
		console.log(movies);
	}, [movies]);

	useEffect(() => {
		console.log(tv);
	}, [tv]);

	useEffect(() => {
		getStuff();
	}, [value]);

	return (
		<div className="min-h-screen w-full bg-background text-foreground dark">
			<div className="fc min-h-screen w-full items-start gap-20 pt-16 sm:pl-36 md:pt-0">
				{!user ? (
					<div className="fc h-full w-full text-white">Login to view your watchlist</div>
				) : loading || !movies || !tv ? (
					<Loading />
				) : (
					<>
						<div className="fc my-5 w-full items-start gap-3 px-5">
							<h2 className="text-4xl font-bold text-white">Here's your watchlist, {user.displayName.split(' ')[0]}</h2>
							<h3 className="text-xl font-bold text-white">Movies ({movies.length})</h3>
							<div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
								{movies.length === 0 ? (
									<div className="text-white">No movies added</div>
								) : (
									<AnimatePresence mode="popLayout">
										{movies.map((movie: MovieDetails) => (
											<motion.div
												initial={{ width: 0, opacity: 0, margin: 0 }}
												animate={{
													width: 'auto',
													opacity: 1,
													transition: {
														type: 'spring',
														bounce: 0.3,
														opacity: {
															delay: 0.1,
														},
													},
												}}
												exit={{
													width: 0,
													opacity: 0,
													padding: 0,
												}}
												transition={{
													duration: 0.6,
													type: 'spring',
													bounce: 0,
													position: {
														delay: 1,
													},
													opacity: {
														duration: 0.12,
													},
												}}
												key={movie.id}
												className="w-full overflow-hidden"
											>
												<ContentCard content={movie} />
											</motion.div>
										))}
									</AnimatePresence>
								)}
							</div>
							<h3 className="mt-5 text-xl font-bold text-white">TV Shows ({tv.length})</h3>
							<div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
								{tv.length === 0 ? (
									<div className="text-white">No TV shows added</div>
								) : (
									<AnimatePresence mode="popLayout">
										{tv.map((tv: ShowDetails) => (
											<motion.div
												className="w-full overflow-hidden"
												initial={{ width: 0, opacity: 0, margin: 0 }}
												animate={{
													width: 'auto',
													opacity: 1,
													marginRight: '0.75em',
													transition: {
														type: 'spring',
														bounce: 0.3,
														opacity: {
															delay: 0.1,
														},
													},
												}}
												exit={{
													width: 0,
													opacity: 0,
													padding: 0,
													marginRight: 0,
												}}
												transition={{
													duration: 0.6,
													type: 'spring',
													bounce: 0,
													position: {
														delay: 1,
													},
													opacity: {
														duration: 0.12,
													},
												}}
												key={tv.id}
											>
												<ContentCard content={tv} />
											</motion.div>
										))}
									</AnimatePresence>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Watchlist;
