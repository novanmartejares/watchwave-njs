'use client';
import useSetTracker from '@/app/lib/firebase/useSetTracker';
import { Episode } from '@/types';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useSwiper } from 'swiper/react';

interface EpisodeCardProps {
	episode: Episode;
	setEpisode: React.Dispatch<React.SetStateAction<number>>;
	episodeSelected: boolean;
	season: number;
	id: number;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episodeSelected, episode, setEpisode, season, id }) => {
	const { set } = useSetTracker();
	const swiper = useSwiper();
	const today = new Date();
	const airDate = new Date(episode.air_date);
	// if active slide, slideTo
	useEffect(() => {
		if (episodeSelected) {
			swiper.slideTo(episode.episode_number - 1);
		}
	}, [episodeSelected]);

	return (
		<div
			onClick={() => {
				set(season, episode.episode_number, id);
				setEpisode(episode.episode_number);
			}}
			className={`relative aspect-[16/9] min-w-[200px] max-w-[250px] cursor-pointer rounded-md outline outline-4 outline-white/0 transition-all duration-300 sm:min-w-[250px]  ${
				episodeSelected ? 'outline-offset-2 outline-white/100' : 'md:hover:outline-offset-4 md:hover:outline-white/100'
			}`}
		>
			{episode.still_path ? (
				<Image
					draggable={false}
					src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
					width={300}
					className="h-full w-full rounded-md object-cover"
					height={169}
					alt={`Episode ${episode.episode_number} still image`}
				/>
			) : (
				<div className="h-full w-full rounded-md bg-gradient-to-b from-[#0f0f0f] to-[#1f1f1f] fc">
					{airDate > today ? 'Episode not released' : 'No Image'}
				</div>
			)}
			<div className="fc absolute inset-0 items-start justify-end rounded-md bg-gradient-to-b from-transparent to-black p-2">
				<h4 className="text-sm font-bold">Episode {episode.episode_number}</h4>
				{episode.name !== `Episode ${episode.episode_number}` && <p className="text-xs">{episode.name}</p>}
			</div>
		</div>
	);
};

export default EpisodeCard;
