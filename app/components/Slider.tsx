'use client';
import ContentCard from './ContentCard';
import React, { useEffect, useRef, useState } from 'react';
import { MovieSection, TvSection } from '../../types';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Button } from '@nextui-org/react';
import { loadMore } from '@/app/lib/loadMore';
import { db } from '@/app/lib/firebase/firebase';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { UserAuth } from '@/app/context/AuthContext';
import fetchDetails from '@/app/lib/fetchDetails';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, FreeMode, Navigation } from 'swiper/modules';

interface Props {
	section: MovieSection | TvSection;
	headline?: string;
	more?: boolean;
	setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	removeFromCW?: boolean;
}
import 'swiper/css/free-mode';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

const Slider = ({ section, headline, more, removeFromCW, setIsLoading }: Props) => {
	const prev = useRef<HTMLButtonElement>(null);
	const next = useRef<HTMLButtonElement>(null);

	const { user } = UserAuth();
	const [stateCollection, setStateCollection] = useState<MovieSection | TvSection>(section);
	const [loadMoreIsLoading, setloadMoreisLoading] = useState(false);

	const [cwCollection, setCwCollection] = useState([]);

	const [value, loading, error] = useDocumentData(doc(db, 'users/' + user?.uid));

	useEffect(() => {
		if (!removeFromCW) return;
		if (!value) return;
		console.log(value);
		const getCW = async () => {
			let tempCollection = [];

			// map through the array and fetch the details of each item
			const promises = value.continueWatching.map(async (item) => {
				const res = await fetchDetails(item.id, item.type);
				return res;
			});
			// await all promises
			const results = await Promise.all(promises);

			results.map((item, i) => {
				tempCollection.push(item);
			});

			setCwCollection(tempCollection);
		};
		getCW();
	}, [value]);

	return (
		<>
			{(removeFromCW ? cwCollection?.length > 0 : stateCollection.collection) && (
				<section className="fc w-full items-start gap-5 overflow-hidden">
					{headline && <h2 className="px-5 text-2xl font-bold text-white sm:text-4xl">{headline}</h2>}
					<div className="max-w-full overflow-x-hidden">
						<Swiper
							modules={[Scrollbar, Navigation]}
							// freeMode={true}
							navigation={{
								nextEl: next.current,
								prevEl: prev.current,
								hideOnClick: true,
							}}
							scrollbar={{ draggable: true, hide: false, enabled: true }}
							spaceBetween={10}
							slidesPerView={'auto'}
							onInit={() => setIsLoading && setIsLoading(false)}
							// onTouchStart={() => setIsDragging(true)}
							// onTouchEnd={() => setIsDragging(false)}
						>
							{removeFromCW
								? cwCollection?.map((content) => (
										<SwiperSlide key={`${content.id} ${content.popularity}`}>
											<ContentCard removeFromCW={removeFromCW} content={content} />
										</SwiperSlide>
									))
								: stateCollection.collection.map((content) => (
										<SwiperSlide key={`${content.id} ${content.popularity}`}>
											<ContentCard removeFromCW={removeFromCW} content={content} />
										</SwiperSlide>
									))}
							{more === false ? null : (
								<SwiperSlide>
									<div className="fr aspect-[2/3] min-w-[200px] cursor-pointer gap-3 rounded-lg pr-5 text-white">
										<Button
											// use load more function to take the prev statecollection and in the collection key of that object append the output from loadMore
											onClick={async () => {
												setloadMoreisLoading(true);
												const updatedCollection = await loadMore(stateCollection);
												setStateCollection(updatedCollection);
												setloadMoreisLoading(false);
											}}
											variant="ghost"
											className="py-2 text-white transition-colors hover:text-black"
										>
											{loadMoreIsLoading ? (
												'Loading...'
											) : (
												<>
													Load More <IoIosArrowRoundForward size={30} />
												</>
											)}
										</Button>
									</div>
								</SwiperSlide>
							)}
						</Swiper>
					</div>
					<div className="fr gap-2 pl-4">
						<Button ref={prev} className="swiper-button-prev px-6 py-1 rounded-full bg-foreground-300 text-black">
							<IoArrowBack size={30} />
						</Button>
						<Button ref={next} className="swiper-button-next px-6 py-1 rounded-full bg-foreground-300 text-black">
							<IoArrowForward size={30} />
						</Button>
					</div>
				</section>
			)}
		</>
	);
};

export default Slider;