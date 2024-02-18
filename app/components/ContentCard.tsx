'use client';
import React, { useEffect, useState } from 'react';
import { Movie, MovieDetails, Show, ShowDetails, recommendationProps } from '@/types';
import Image from 'next/image';
import { Button, Chip, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from '@nextui-org/react';
import { IoAdd, IoCheckmark, IoClose, IoList } from 'react-icons/io5';
import useAddToWatchlist from '@/app/lib/firebase/addToWatchlist';
interface Props {
	content: Show | Movie | MovieDetails | ShowDetails | recommendationProps;
	isDragging?: boolean;
	removeFromCW?: boolean;
}
import getDocData from '@/app/lib/firebase/getDocData';
import { UserAuth } from '@/app/context/AuthContext';
import useAddToContinueWatching from '@/app/lib/firebase/addToContinueWatching';
import Link from 'next/link';
import { ModalManager } from '../lib/ModalManager';
import { format } from 'date-fns';

const ContentCard = ({ content, isDragging, removeFromCW }: Props) => {
	const { user } = UserAuth();
	const cw = useAddToContinueWatching(content.media_type, content.id);
	const { add, remove } = useAddToWatchlist(content.media_type, content.id);
	const [isInWatchlist, setIsInWatchlist] = useState(false);
	const [data, setData] = useState<any>(null);
	const [popover, setPopover] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	}, [user]);

	useEffect(() => {
		if (!data) return;
		if (data[content.media_type]) {
			if (data[content.media_type].includes(content.id)) {
				setIsInWatchlist(true);
			} else {
				setIsInWatchlist(false);
			}
		}
	}, [data, user]);

	const handleWatchlistClick = () => {
		if (!user) onOpen();
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
	};

	const handleRemoveFromCW = () => {
		if (!user) onOpen();
		cw.remove();
		getDocData(user)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	};

	const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
	return (
		<div className={`aspect-[2/3] w-full max-w-[250px] ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}>
			<ModalManager onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} type="watchlist" />
			<div className="group relative h-full w-full">
				{content.poster_path ? (
					<>
						{!loading && (
							<div className="fc absolute h-full w-full bg-zinc-800">
								<div className="h-10 w-10 animate-pulse rounded-full border-2 border-zinc-500 bg-transparent" />
							</div>
						)}
						<Link href={`/watch/${content.media_type}/${content.id}`}>
							<Image
								onLoad={() => setLoading(true)}
								width={400}
								draggable={false}
								height={600}
								src={`https://image.tmdb.org/t/p/w400${content.poster_path}`}
								alt={'title' in content ? content.title : content.name}
								className="absolute h-full w-full rounded-xl object-cover"
							/>
						</Link>
					</>
				) : (
					<Link href={isDragging === null || isDragging === false ? `/watch/${content.media_type}/${content.id}` : '#'}>
						<div className="fc h-full w-full rounded-xl bg-zinc-800 px-3">
							<p className="text-center">{'title' in content ? content.title : content.name}</p>
						</div>
					</Link>
				)}
				<div className="fr pointer-events-none absolute bottom-0 h-full w-full opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
					{/* <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-b from-transparent to-black"></div> */}
					<div className="fc relative h-full w-full items-end justify-between px-3 py-3">
						<div className="fr gap-2">
							<Chip radius="sm" color="default" size="sm">
								{content.media_type === 'movie' ? 'Movie' : 'TV'}
							</Chip>
							<Chip radius="sm" color="default" size="sm">
								{'release_date' in content && content.release_date.length !== 0
									? content.release_date.split('-')[0]
									: 'first_air_date' in content && content.first_air_date.length !== 0
										? content.first_air_date.split('-')[0]
										: 'N/A'}
							</Chip>
						</div>
						<div className="fr pointer-events-auto text-white">
							{removeFromCW && (
								<Tooltip content="Remove from Continue Watching">
									<Button
										isIconOnly
										color="default"
										radius="full"
										variant="solid"
										className="mr-2 bg-zinc-500/70 text-white backdrop-blur-2xl"
										aria-label="add to watchlist"
										onClick={handleRemoveFromCW}
									>
										{<IoClose size={20} />}
									</Button>
								</Tooltip>
							)}
							<Tooltip content={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}>
								<Button
									isIconOnly
									color="default"
									radius="full"
									variant="solid"
									className="mr-2 bg-zinc-500/70 text-white backdrop-blur-2xl"
									aria-label="add to watchlist"
									onClick={handleWatchlistClick}
								>
									{isInWatchlist ? <IoCheckmark size={20} /> : <IoAdd size={20} />}
								</Button>
							</Tooltip>
							<Tooltip content="More Info">
								<Button
									isIconOnly
									color="default"
									radius="full"
									variant="solid"
									className="bg-zinc-500/70 text-white backdrop-blur-2xl"
									onClick={() => setPopover(true)}
								>
									<IoList size={20} />
								</Button>
							</Tooltip>
							<Popover
								onClick={() => setPopover(false)}
								isOpen={popover}
								onOpenChange={(open) => setPopover(open)}
								showArrow
								backdrop="opaque"
								placement="right"
								classNames={{
									base: [
										// arrow color
										'before:bg-default-200',
									],
								}}
							>
								<PopoverTrigger>
									<div></div>
								</PopoverTrigger>
								<PopoverContent onClick={() => setPopover(false)}>
									{() => (
										<div className="px-1 py-2 max-w-[300px]">
											<h3 className="font-bold">
												{'title' in content ? content.title : content.name} •{' '}
												{'release_date' in content && content.release_date.length !== 0
													? content.release_date.split('-')[0]
													: 'first_air_date' in content && content.first_air_date.length !== 0
														? content.first_air_date.split('-')[0]
														: 'N/A'}
												{'runtime' in content
													? ` • ${format(new Date(0, 0, 0, 0, content.runtime), "h 'hr' m 'min'")}`
													: 'number_of_episodes' in content
														? `• ${content.number_of_episodes} episodes • ${content.number_of_seasons} seasons`
														: ''}
											</h3>
											<p className="w-full">{content.overview}</p>
										</div>
									)}
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContentCard;
