'use client';
import options from '@/app/lib/options';
import { MovieDetails, ShowDetails, castProps, genresProps, keywordProps, recommendationProps, reviewProps, videoProps } from '@/types';
import { Chip, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Video from './Video';
import Review from './Review';
import Slider from './Slider';
import CommentSlider from './CommentSlider';
import { db } from '@/app/lib/firebase/firebase';
import { doc } from 'firebase/firestore';
import { UserAuth } from '@/app/context/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Error from '@/app/error';

async function fetchDetails(id: number, type: string) {
	// console.log(id, type);

	// fetch recommendations, credits, keywords, videos, reviews
	const reccomendations = await fetch(`https://api.themoviedb.org/3/${type}/${id}/recommendations?language=en-US&page=1`, options);
	let recc: {
		results: recommendationProps[];
	} = await reccomendations.json();
	// console.log(recc);

	const credits = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?language=en-US`, options);
	let cred = await credits.json();
	// for each cast inside cred.cast,
	//  fetch(
	//   `https://api.themoviedb.org/3/person/${cast.id}/external_ids`,
	//   options,
	// )
	// and then add it to the cast object as imdb_id in cred

	await cred.cast.forEach(async (cast: castProps) => {
		if (!cast.id) return;
		const external = await fetch(`https://api.themoviedb.org/3/person/${cast.id}/external_ids`, options);
		let ext = await external.json();
		cast.imdb_id = ext.imdb_id;
	});

	// console.log(credits);

	const videos = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, options);
	let vid = await videos.json();
	const reviews = await fetch(`https://api.themoviedb.org/3/${type}/${id}/reviews?language=en-US&page=1`, options);
	let rev = await reviews.json();

	const external = await fetch(`https://api.themoviedb.org/3/${type}/${id}/external_ids?language=en-US`, options);
	let ext = await external.json();
	const keywords = await fetch(`https://api.themoviedb.org/3/${type}/${id}/keywords?language=en-US`, options);
	let keyw = await keywords.json();

	return {
		recommendations: recc,
		credits: cred,
		keywords: keyw,
		videos: vid,
		reviews: rev,
		external: ext,
	};
}

interface Props {
	result: MovieDetails | ShowDetails | null;
	setIsLoading: (isLoading: boolean) => void;
}
interface DetailsData {
	recommendations: { results: recommendationProps[] };
	credits: any;
	keywords: any;
	videos: any;
	reviews: any;
	external: any;
}

const Details = ({ result, setIsLoading }: Props) => {
	// console.log(setIsLoading);
	const [detailsData, setDetailsData] = useState<DetailsData | null>(null);
	const { user } = UserAuth();
	const [value, loading, error] = useDocumentData(doc(db, 'commentsCollection/' + result?.media_type));

	useEffect(() => {
		console.log(value);
	}, [value]);
	useEffect(() => {
		setIsLoading(true);
	}, [loading]);

	useEffect(() => {
		if (result?.id) {
			setIsLoading(true);
			fetchDetails(result.id, result.media_type).then((data) => {
				setDetailsData(data);
				setIsLoading(false);
			});
		}
	}, [result]);

	if (error)
		<Error
			error={error}
			reset={() => {
				window.location.reload();
			}}
		/>;

	const { recommendations, credits, keywords, videos, reviews, external } = detailsData || {}; // Add default empty object to handle null case

	if (!result?.id) return null;

	const timeConvert = (n: number): string => {
		const num = n;
		const hours = num / 60;
		const rhours = Math.floor(hours);
		const minutes = (hours - rhours) * 60;
		const rminutes = Math.round(parseFloat(minutes.toString()));
		return rhours + ' h ' + rminutes + 'm';
	};
	return (
		<div>
			{/* check if result is type MovieDetails */}
			{result && (
				<div className="fc w-full pt-7">
					<div className="fc md:fr mb-20 w-full max-w-7xl gap-5 px-5 sm:px-10 md:items-start md:justify-start">
						{result.poster_path && (
							<Image
								width={250}
								height={375}
								className="z-10 aspect-[2/3] max-w-[250px] rounded-xl object-cover"
								src={`https://image.tmdb.org/t/p/w400${result.poster_path}`}
								alt=""
							/>
						)}
						<div className="fc items-start gap-2">
							<h1 className="text-5xl font-bold">{'release_date' in result ? result.title : result.name}</h1>
							{external && (
								<>
									{'release_date' in result ? (
										<ul className="inline-flex flex-wrap gap-2 pb-3 font-bold tracking-tight">
											{/* year, content rating, runtime, imdb */}
											<li className="inline-detail">{result.release_date.split('-')[0]}</li>
											{(result.content_rating || result.runtime || external.imdb_id) && <span>•</span>}
											{result.content_rating && (
												<>
													<li className="inline-detail rounded-lg border-1 border-[#a1a1a1] px-1.5">
														{result.content_rating}
													</li>
													{(result.runtime || external.imdb_id) && <span>•</span>}
												</>
											)}
											{result.runtime && (
												<>
													<li className="inline-detail">{timeConvert(result.runtime)}</li>
													{external.imdb_id && <span>•</span>}
												</>
											)}
											{external.imdb_id && (
												<Link target="_blank" href={`https://imdb.com/title/${external.imdb_id}`}>
													<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
												</Link>
											)}
										</ul>
									) : (
										<ul className="inline-flex flex-wrap gap-2 pb-3 font-bold tracking-tight">
											<li className="inline-detail">
												{result.first_air_date.split('-')[0]} - {result.last_air_date.split('-')[0]}
											</li>
											{(result.content_rating || result.number_of_seasons || result.number_of_episodes || external.imdb_id) && (
												<span>•</span>
											)}
											{result.content_rating && (
												<>
													<li className="inline-detail rounded-lg border-1 border-[#a1a1a1] px-1.5">
														{result.content_rating}
													</li>
													{(result.number_of_seasons || result.number_of_episodes || external.imdb_id) && <span>•</span>}
												</>
											)}
											{result.number_of_seasons && (
												<>
													<li className="inline-detail">{result.number_of_seasons} Seasons</li>
													{(result.number_of_episodes || external.imdb_id) && <span>•</span>}
												</>
											)}
											{result.number_of_episodes && (
												<>
													<li className="inline-detail">{result.number_of_episodes} Episodes</li>
													{external.imdb_id && <span>•</span>}
												</>
											)}
											{external.imdb_id && (
												<Link target="_blank" href={`https://imdb.com/title/${external.imdb_id}`}>
													<Image src="/imdb.svg" className="h-6 w-auto" width={50} height={25.1} alt={'Imdb logo'} />
												</Link>
											)}
										</ul>
									)}
								</>
							)}

							<p className="max-w-[50ch] text-sm sm:text-lg">{result.overview}</p>
							<ul className="fc gap-4 lg:fr justify-start items-start flex-wrap">
								{
									<>
										<li className="fr items-start justify-start gap-3 w-full">
											<div className="font-bold">Cast:</div>
											<p>
												{credits?.cast &&
													credits.cast.slice(0, 5).map((cast: castProps, i: number) => (
														<Tooltip key={cast.name} content={cast.character}>
															<span className="underline-offset-2 hover:underline">
																<a
																	target="_blank"
																	href={`https://www.imdb.com/name/${cast.imdb_id}`}
																	aria-label={`View details for ${cast.name}`}
																>
																	{cast.name + (i !== 4 ? ', ' : '')}
																</a>
															</span>
														</Tooltip>
													))}
											</p>
										</li>
									</>
								}
								<li className="fr items-start justify-start gap-3 w-full">
									<div className="font-bold">Genres</div>
									<div className="fr flex-wrap justify-start gap-2">
										{result.genres && result.genres.map((genre: genresProps, i: number) => <Chip key={i}>{genre.name}</Chip>)}
									</div>
								</li>
								{keywords?.keywords && keywords.keywords.length !== 0 && (
									<li className="fr items-start  w-full justify-start gap-3 sm:col-span-2">
										<div className="font-bold">Keywords</div>
										<div className="fr flex-wrap justify-start gap-2">
											{keywords.keywords.map((keyword: keywordProps, i: number) => (
												<Chip variant="bordered" key={i}>
													{keyword.name}
												</Chip>
											))}
										</div>
									</li>
								)}
							</ul>
						</div>
					</div>
					<div className="w-full px-5">
						{value && (
							<div className="fc w-full justify-start">
								<h3 className="mb-5 text-3xl font-bold">Comments</h3>
								<CommentSlider user={user} comments={value[result?.id] || null} mediatype={result.media_type} id={result.id} />
							</div>
						)}
						{recommendations && recommendations.results && recommendations.results.length !== 0 && (
							<div className="fc w-full justify-start my-10 light">
								<h3 className="mb-5 text-3xl font-bold">More Like This</h3>
								<Slider
									section={{
										collection: recommendations.results,
										url: '', // Add the missing url property
										page: 1, // Add the missing page property
										heading: '', // Add the missing heading property
									}}
									more={false}
								/>
							</div>
						)}
						{videos && videos.results && videos.results.length !== 0 && (
							<div className="fc my-10 w-full">
								<h3 className="mb-5 text-3xl font-bold">Trailers</h3>
								<div className="fr w-full flex-wrap gap-5">
									{videos.results
										.filter((video: videoProps) => video.site === 'YouTube' && video.type === 'Trailer')
										.sort((a: videoProps, b: videoProps) => b.size - a.size)
										.map((video: videoProps) => (
											<Video key={video.id} video={video} />
										))}
								</div>
							</div>
						)}
						{reviews && reviews.results && reviews.results.length !== 0 && (
							<div className="fc my-10 w-full">
								<h3 className="mb-5 text-3xl font-bold">Reviews</h3>
								<div className="fr w-full flex-wrap items-start gap-6">
									{reviews.results.map((review: reviewProps) => (
										<Review key={review.id} review={review} />
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Details;
