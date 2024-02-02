'use client';
import React, { useEffect, useState } from 'react';
import EpisodeCard from './EpisodeCard';
import { Episode, Season } from '@/types';
import { SwiperSlide, Swiper } from 'swiper/react';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import './episode.css';

interface EpisodeSliderProps {
	id: number;
	result: any;
	setEpisode: React.Dispatch<React.SetStateAction<number>>;
	setSeason: React.Dispatch<React.SetStateAction<number>>;
	season: number;
	episode: number;
}

const EpisodeSlider = ({ id, result, setEpisode, season, episode }: EpisodeSliderProps) => {
	const [seasons, setSeasons] = useState<Episode[][] | null>(null);

	useEffect(() => {
		if (!result) return;
		if (!result.seasons) return;
		const { seasons } = result;
		const newSsns: Episode[][] = [];
		seasons.forEach((ssn: Season) => {
			const { episodes } = ssn;
			const newEpisodes = episodes.map((e: Episode) => {
				return e;
			});
			newSsns.push(newEpisodes);
		});
		setSeasons(newSsns);
	}, [result]);

	return (
		<section className="fc w-full items-start gap-5 overflow-hidden py-2 light">
			<div className="max-w-full overflow-x-hidden">
				<Swiper
					modules={[Scrollbar, FreeMode, Mousewheel]}
					freeMode={true}
					scrollbar={{ draggable: true, enabled: true }}
					spaceBetween={20}
					mousewheel={{ releaseOnEdges: true }}
					slidesPerView={'auto'}
				>
					{seasons &&
						// show episodes for only the selected season
						seasons[season].map((e) => (
							<SwiperSlide key={e.episode_number} className="!aspect-auto !h-auto !min-w-[initial]">
								<EpisodeCard
									id={id}
									season={season}
									episodeSelected={episode === e.episode_number}
									episode={e}
									setEpisode={setEpisode}
								/>
							</SwiperSlide>
						))}
				</Swiper>
				{/* <motion.div
          key={season}
          onDrag={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          ref={slidesRef}
          drag="x"
          dragConstraints={{
            left: -(slidesWidth - sliderWidth + getGap()),
            right: 0,
          }}
          style={{ touchAction: "none" }}
          className="fr relative w-full justify-start gap-5 p-3 will-change-transform"
        >
          {seasons &&
            // show episodes for only the selected season
            seasons[season].map((e) => (
              <EpisodeCard
                episodeSelected={episode === e.episode_number}
                key={e.episode_number}
                episode={e}
                isDragging={isDragging}
                setEpisode={setEpisode}
              />
            ))}
        </motion.div> */}
			</div>
		</section>
	);
};

export default EpisodeSlider;
