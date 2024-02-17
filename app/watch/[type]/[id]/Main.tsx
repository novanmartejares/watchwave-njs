'use client';
import { UserAuth } from '@/app/context/AuthContext';
import useAddToWatchlist from '@/app/lib/firebase/addToWatchlist';
import useAddToContinueWatching from '@/app/lib/firebase/addToContinueWatching';
import Loading from '@/app/loading';
import Details from '@/app/components/Details';
import EpisodeSlider from '@/app/components/EpisodeSlider';
import options from '@/app/lib/options';
import { Episode, MovieDetails, ShowDetails } from '@/types';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { IoCheckmark, IoAdd, IoArrowDown } from 'react-icons/io5';
import Footer from '@/app/components/Footer';
import { DetectAdblock } from '@scthakuri/adblock-detector';
import useSetTracker from '@/app/lib/firebase/useSetTracker';
import { doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { ModalManager } from '@/app/lib/ModalManager';
import { format } from 'date-fns';
import { fetchDMCA } from '@/app/lib/fetchDMCA';

const Main = ({ params }: { params: { type: string; id: number } }) => {
	const { id, type } = params;
	const [result, setResult] = useState<MovieDetails | ShowDetails | null>(null);
	const [season, setSeason] = useState<number>(0);
	const [episode, setEpisode] = useState<number>(1);
	const [source, setSource] = useState<number>(0);
	const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
	const { user, googleSignIn } = UserAuth();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isInFuture, setIsInFuture] = useState<boolean>(false);
	const [isinDMCA, setIsInDMCA] = useState<boolean>(false);

	const sourceCollectionMovie = [
		`https://vidsrc.to/embed/movie/${id}`,
		`https://vidsrc.me/embed/movie?tmdb=${id}`,
		`https://embed.smashystream.com/playere.php?tmdb=${id}`,
		`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
		`https://anyembed.xyz/movie/${id}`,
	];
	const sourceCollectionTV = result &&
		'name' in result && [
			`https://vidsrc.to/embed/tv/${id}/${result?.seasons[0]?.name === 'Specials' ? season : season + 1}/${episode}`,
			`https://vidsrc.me/embed/tv?tmdb=${id}&season=${
				result?.seasons[0]?.name === 'Specials' ? season : season + 1
			}&episode=${episode}&color=006FEE`,
			`https://embed.smashystream.com/playere.php?tmdb=${id}&season=${
				result?.seasons[0]?.name === 'Specials' ? season : season + 1
			}&episode=${episode}`,
			`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${
				result?.seasons[0]?.name === 'Specials' ? season : season + 1
			}&e=${episode}`,
			`https://anyembed.xyz/tv/${id}/${result?.seasons[0]?.name === 'Specials' ? season : season + 1}/${episode}`,
		];

	const [value, loading] = useDocumentData(doc(db, 'users/' + user?.uid));

	const { add, remove } = useAddToWatchlist(result?.media_type, result?.id);
	const ca = useAddToContinueWatching(result?.media_type, result?.id);
	const { set } = useSetTracker();

	// if release date of the content is in the future, show a countdown timer
	useEffect(() => {
		if (!result) return;
		if ('release_date' in result) {
			if (result.release_date) {
				const releaseDate = new Date(result.release_date);
				const currentDate = new Date();
				if (releaseDate > currentDate) {
					setIsInFuture(true);
				}
			}
		}

		fetchDMCA().then((data) => {
			if (data.includes(result.id)) {
				setIsInDMCA(true);
			}
		});
	}, [result]);

	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const adb = useDisclosure();

	useEffect(() => {
		DetectAdblock((detected) => {
			console.log('Adblock detected:', detected);
			if (detected) {
			} else {
				adb.onOpen();
			}
		});
	}, []);
	useEffect(() => {
		console.log(`%c ${season} ${episode}`, 'background: #222; color: #bada55; font-size: 25px; font-weight: bold;');
	}, [season, episode]);

	// start a 30 second timer, after which the content will be added to firestore continue watching
	// if the user is logged in
	useEffect(() => {
		if (!user) return;
		if (result?.media_type === 'tv') {
			if (!value) return;
			if (value && value.tracker && !value.tracker[id]) {
				set(season, episode, id);
			}
		}

		const timer = setTimeout(
			() => {
				if (result) {
					ca.add();
				}
			},
			1000 * 60 * 5
		); // 5 minutes
		return () => clearTimeout(timer);
	}, [user, result, value]);

	useEffect(() => {
		if (!value) return;
		if (!result) return;
		if (value[result.media_type]) {
			if (value[result.media_type].includes(result.id)) {
				setIsInWatchlist(true);
			} else {
				setIsInWatchlist(false);
			}
		}
	}, [value, user, result]);

	useEffect(() => {
		if (type === 'movie') {
			fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options)
				.then((res) => res.json())
				.then((data) => {
					fetch(`https://api.themoviedb.org/3/${type}/${id}/release_dates?language=en-US`, options)
						.then((res2) => res2.json())
						.then((data2) => {
							const countries = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'IN', 'ZA'];
							let content_rating = '';
							for (let i = 0; i < data2.results.length; i++) {
								if (countries.includes(data2.results[i].iso_3166_1)) {
									content_rating = data2.results[i].release_dates[0].certification;
									break;
								}
							}
							data.content_rating = content_rating;
							// media_type is used for the Details component
							data.media_type = 'movie';
							setResult(data);
							setIsLoading(false);
						});
				});
		} else if (type === 'tv') {
			fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options)
				.then((res) => res.json())
				.then((data) => {
					fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?language=en-US`, options)
						.then((res2) => res2.json())
						.then((data2) => {
							let content_rating = '';
							for (let i = 0; i < data2.results.length; i++) {
								if (data2.results[i].iso_3166_1 === 'US') {
									content_rating = data2.results[i].rating;
									break;
								}
							}
							data.content_rating = content_rating;
							// media_type is used for the Details component
							data.media_type = 'tv';

							const fetchSeasonData = async (season: { season_number: number }) => {
								// console.log("fetching season data..." + season.season_number);
								const seasonData = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}`, options);
								const seasonDataJson = await seasonData.json();
								// console.log("season data fetched!");
								// console.log(seasonDataJson);
								return seasonDataJson;
							};

							Promise.all(data.seasons.map(fetchSeasonData)).then((tempContent: Episode[][]) => {
								console.log(tempContent);
								data.seasons = tempContent;
								setResult(data);
								setIsLoading(false);
							});

							// from the tracker data that fetch tracker returns, check if there's a tracker for the current id, if not, check if the first season's name is Specials, if it is, setSeason to 1, else setSeason to 0
							// if there is a tracker for the current id, setSeason to the season number and setEpisode to the episode number
							if (data.seasons[0].name === 'Specials') {
								setSeason(1);
							} else {
								setSeason(0);
							}

							if (!value) return;
							if (!value.tracker) return;
							if (!value.tracker[id]) return;

							console.log('setting season and episode');
							console.log(value);
							console.log(value.tracker[id].episodeNumber, value.tracker[id].seasonNumber);
							setEpisode(value.tracker[id].episodeNumber);
							setSeason(value.tracker[id].seasonNumber);
						});
				});
		}
	}, [user, value]);

	useEffect(() => {
		console.log(result);
	}, [result]);

	const handleClick = () => {
		if (!user) onOpen();
		if (isInWatchlist) {
			remove();
		} else {
			add();
		}
	};

	const setLoading = (state: boolean) => {
		setIsLoading(state);
	};

	if (isInFuture || isinDMCA) {
		return (
			<div className="min-h-screen w-full overflow-hidden bg-background text-foreground dark fc">
				{result && (
					<div className="relative h-full w-full fc">
						<Image
							src={`https://image.tmdb.org/t/p/original${result?.backdrop_path}`}
							alt="backdrop"
							width={1920}
							height={1080}
							className="h-screen w-full object-cover object-center absolute"
						/>
						<div className="fc absolute bg-background/50 backdrop-blur-2xl border border-foreground/30 p-5 rounded-2xl">
							{isInFuture && (
								<>
									<h3 className="text-2xl font-bold text-center">
										{result && 'title' in result && result.title ? result.title : 'name' in result ? result.name : ''} has not
										been released yet
									</h3>
									{'release_date' in result && result.release_date ? (
										<h4 className="text-lg text-center">
											{/* May 5, 2024 format with date-fns */}
											Set to release on {format(new Date(result.release_date), 'MMMM d, yyyy')}
										</h4>
									) : null}
								</>
							)}
							{isinDMCA && (
								<h3 className="text-2xl font-bold text-center">
									{result && 'title' in result && result.title ? result.title : 'name' in result ? result.name : ''} has been
									removed due to DMCA
								</h3>
							)}
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen w-full overflow-hidden bg-background text-foreground dark">
				{(isLoading || loading) && <Loading />}
				<ModalManager isOpen={adb.isOpen} onClose={adb.onClose} onOpenChange={adb.onOpenChange} type="adBlock" />
				{result && <ModalManager isOpen={isOpen} onClose={onOpen} onOpenChange={onOpenChange} type="watchlist" data={{ googleSignIn }} />}
				<div className="w-full overflow-hidden sm:pl-28 md:pl-36 pt-16 sm:pt-8">
					{type === 'movie' && result && 'title' in result ? (
						<>
							<div className="relative z-10 h-full w-full sm:px-5">
								{result?.backdrop_path && (
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 0.4 }}
										viewport={{ once: true }}
										className="fc pointer-events-none absolute h-full w-full scale-125 opacity-10 blur-2xl"
									>
										<Image
											width={1920}
											height={1080}
											className="h-full w-full object-cover object-center"
											src={`https://image.tmdb.org/t/p/w400/${result.backdrop_path}`}
											alt={'title' in result && result.title ? result.title : result.original_title}
										/>
									</motion.div>
								)}
								<div className="fc z-10 aspect-video w-full sm:rounded-2xl">
									<iframe
										allowFullScreen={true}
										className="z-10 aspect-video w-full sm:rounded-2xl"
										src={sourceCollectionMovie[source]}
									/>
									<div className="fr w-full flex-wrap gap-3 pt-2 sm:items-end">
										<Button size="sm" onClick={handleClick}>
											{isInWatchlist ? (
												<>
													Added to Watchlist <IoCheckmark size={20} />
												</>
											) : (
												<>
													Add to Watchlist <IoAdd size={20} />
												</>
											)}
										</Button>
										<Dropdown>
											<DropdownTrigger>
												<Button size="sm">
													Source {source + 1} <BsChevronDown />
												</Button>
											</DropdownTrigger>
											<DropdownMenu aria-label="Source Selection" onAction={(key) => setSource(Number(key))}>
												{sourceCollectionMovie.map((source, index) => (
													<DropdownItem key={index}>Source {index + 1}</DropdownItem>
												))}
											</DropdownMenu>
										</Dropdown>
									</div>
								</div>
								<div className="relative w-full"></div>
							</div>
							<Details result={result} setIsLoading={setLoading} />
						</>
					) : type === 'tv' && result && 'seasons' in result ? (
						<>
							<div className="relative z-10 h-full w-full sm:px-5">
								{result?.backdrop_path && (
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 0.4 }}
										viewport={{ once: true }}
										className="fc pointer-events-none absolute h-full w-full scale-125 opacity-10 blur-2xl"
									>
										<Image
											width={1920}
											height={1080}
											className="h-full w-full object-cover object-center"
											src={`https://image.tmdb.org/t/p/w400/${result.backdrop_path}`}
											alt={result.name}
										/>
									</motion.div>
								)}
								<div className="fc z-10 aspect-video w-full bg-background sm:rounded-2xl">
									{sourceCollectionTV ? (
										<iframe
											allowFullScreen={true}
											className="z-10 aspect-video w-full sm:rounded-2xl"
											src={sourceCollectionTV[source]}
										/>
									) : (
										<div className="z-10 aspect-video w-full sm:rounded-2xl">Loading</div>
									)}
									<div className="fr w-full flex-wrap gap-3 pt-2 sm:justify-between">
										<Dropdown>
											<DropdownTrigger>
												<Button size="sm">
													{
														// find name of current season
														result && result.seasons[season] && result.seasons[season].name
													}
													<IoArrowDown />
												</Button>
											</DropdownTrigger>
											<DropdownMenu>
												{result &&
													result.seasons.map((season, index) => (
														<DropdownItem
															key={index}
															onClick={() => {
																setSeason(index);

																// set episode to first index of the selected season
																setEpisode(result.seasons[index].episodes[0].episode_number);
																set(index, result.seasons[index].episodes[0].episode_number, id);
															}}
														>
															{season.name} •{' '}
															{!(season.episodes.length === 1) ? (
																<>{season.episodes.length} episodes</>
															) : (
																<>1 episode</>
															)}
														</DropdownItem>
													))}
											</DropdownMenu>
										</Dropdown>
										<div className="fr flex-wrap gap-3">
											<Button size="sm" onClick={handleClick}>
												{isInWatchlist ? (
													<>
														Added to Watchlist <IoCheckmark size={20} />
													</>
												) : (
													<>
														Add to Watchlist <IoAdd size={20} />
													</>
												)}
											</Button>
											<Dropdown size="sm">
												<DropdownTrigger>
													<Button size="sm">
														Source {source + 1} <BsChevronDown />
													</Button>
												</DropdownTrigger>
												<DropdownMenu aria-label="Source Selection" onAction={(key) => setSource(Number(key))}>
													{sourceCollectionTV ? (
														sourceCollectionTV.map((source, index) => (
															<DropdownItem key={index}>Source {index + 1}</DropdownItem>
														))
													) : (
														<DropdownItem>Sources not available</DropdownItem>
													)}
												</DropdownMenu>
											</Dropdown>
										</div>
									</div>
									<EpisodeSlider
										setSeason={setSeason}
										setEpisode={setEpisode}
										episode={episode}
										season={season}
										id={id}
										result={result}
									/>
								</div>
							</div>
							<Details result={result} setIsLoading={setLoading} />
						</>
					) : null}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Main;
