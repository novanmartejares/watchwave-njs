'use client';
import React, { useEffect, useState } from 'react';
import { UserAuth } from '@/app/context/AuthContext';
import ContentCard from '@/app/components/ContentCard';
import fetchDetails from '@/app/lib/fetchDetails';
import { MovieDetails, ShowDetails } from '@/types';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';
import Loading from '../loading';
import NewCard from '../components/NewCard';

const Watchlist = () => {
	const { user } = UserAuth();
	const [value, loading, error] = useDocumentData(doc(db, 'users/' + user?.uid));
	console.log(value, loading, error);
	const [movies, setMovies] = useState<MovieDetails[] | null>(null);
	const [tv, setTv] = useState<ShowDetails[] | null>(null);

	const getStuff = async () => {
		if (!value) return;
		if (value.movie) {
			const tempMovies = await Promise.all(value.movie.map((id) => fetchDetails(id, 'movie')));
			tempMovies.forEach((movie) => (movie.media_type = 'movie'));

			setMovies(tempMovies.reverse());
		}
		if (value.tv) {
			const tempTv = await Promise.all(value.tv.map((id) => fetchDetails(id, 'tv')));

			tempTv.forEach((tv) => (tv.media_type = 'tv'));
			console.log(tempTv);
			setTv(tempTv.reverse());
		}
	};

	useEffect(() => {
		if (!movies || !tv) return;
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
		<div className="min-h-screen w-full bg-background text-foreground">
			{loading && <Loading />}
			<div className="fc min-h-screen w-full items-start gap-20 pt-16 sm:pl-36 md:pt-0">
				{!user ? (
					<div className="fc h-full w-full text-white">Login to view your watchlist</div>
				) : loading ? (
					<Loading />
				) : (
					<>
						<div className="fc my-5 w-full items-start gap-3 px-2 sm:px-5">
							<h2 className="text-2xl sm:text-4xl font-bold text-white">Here's your watchlist, {user.displayName.split(' ')[0]}</h2>
							{movies && (
								<>
									<h3 className="text-xl font-bold text-white">Movies ({movies.length})</h3>
									<div className="grid w-full grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 md:gap-5 gap-3 place-items-center">
										{movies.length === 0 ? (
											<div className="text-white">No movies added</div>
										) : (
											<>
												{movies.map((movie: MovieDetails) => (
													<div key={movie.id} className="w-full fc light justify-start min-h-full">
														<NewCard content={movie} />
													</div>
												))}
											</>
										)}
									</div>
								</>
							)}
							{tv && (
								<>
									<h3 className="mt-16 text-xl font-bold text-white">TV Shows ({tv.length})</h3>
									<div className="grid w-full grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 md:gap-5 gap-3 place-items-center">
										{tv.length === 0 ? (
											<div className="text-white">No TV shows added</div>
										) : (
											<>
												{tv.map((show: ShowDetails) => (
													<div key={show.id} className="w-full overflow-hidden fc light">
														<NewCard content={show} />
													</div>
												))}
											</>
										)}
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Watchlist;
