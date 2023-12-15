import { Scrollbar, FreeMode, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import CommentCard from './CommentCard';
import { Comment, Comments } from '@/types';
import { Button, Input } from '@nextui-org/react';
import useComment from '@/app/firebase/useComment';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Filter from 'bad-words';
interface Props {
	comments: Comments | null;
	mediatype: string;
	id: number;
	user: User | null;
}

const CommentSlider = ({ comments, mediatype, id, user }: Props) => {
	const filter = new Filter();
	const { send } = useComment();
	// Function to filter bad words
	const filterBadWords = (comment: string): boolean => {
		const words = comment.split(' ');
		for (let i = 0; i < words.length; i++) {
			if (filter.isProfane(words[i])) {
				return true;
			}
		}
		return false;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formdata = new FormData(e.currentTarget);
		let comment = formdata.get('comment');
		if (!comment) return;

		if (filterBadWords(comment as string)) {
			toast.error('Please do not use profanity');
		} else {
			send(comment as string, id, mediatype);
		}
	};

	return (
		<section className="fc w-full items-start gap-5 overflow-hidden py-2">
			<div className="max-w-full overflow-x-hidden">
				<Swiper
					modules={[Scrollbar, FreeMode, Mousewheel]}
					freeMode={true}
					scrollbar={{ draggable: true, enabled: true }}
					spaceBetween={20}
					mousewheel={{ releaseOnEdges: true }}
					slidesPerView={'auto'}
				>
					<SwiperSlide className="!aspect-auto !h-auto !min-w-[initial]">
						{user && (
							<div className="w-full min-w-[260px] h-full bg-zinc-800 fc items-start cursor-pointer px-5 py-4 rounded-2xl gap-3 justify-start">
								<form onSubmit={handleSubmit} className="fc gap-3 w-full items-start h-full justify-between min-h-[160px]">
									<div className="gap-3 fc w-full items-start">
										<Input name="comment" placeholder="Add a comment" variant="bordered" />
										<p className="text-xs text-zinc-300">
											Posting as <span className="font-bold">{user?.displayName}</span>
										</p>
									</div>
									<div className="fr ">
										<Button type="submit" color="primary">
											Post
										</Button>
									</div>
								</form>
							</div>
						)}
						{!user && (
							<div className="w-full h-full bg-zinc-800 fc items-start cursor-pointer min-w-[250px] px-5 py-4 rounded-2xl gap-3 justify-start">
								<div className="fc gap-3 w-full h-full">
									<p className="text-xs text-zinc-300">
										You must be <span className="font-bold">logged in</span> to comment
									</p>
								</div>
							</div>
						)}
					</SwiperSlide>

					<AnimatePresence mode="wait">
						{comments && Object.keys(comments).length !== 0 ? (
							Object.keys(comments)
								.sort((a, b) => {
									// createdAt: "2023-12-15T17:03:22.446Z"
									const dateA = new Date(comments[a].createdAt);
									const dateB = new Date(comments[b].createdAt);
									return dateB.getTime() - dateA.getTime();
								})
								.map((key) => {
									const comment = comments[key] as Comment;
									return (
										<SwiperSlide key={comment.uuid} className="!aspect-auto !h-auto !min-w-[initial]">
											{/*  */}
											<CommentCard comment={comment} user={user} />
										</SwiperSlide>
									);
								})
						) : (
							<SwiperSlide className="!aspect-auto !h-auto !min-w-[initial]">
								<div className="w-full h-full bg-zinc-800 fc items-start cursor-grab active:cursor-grabbing min-w-[250px] px-5 py-4 rounded-2xl gap-3 justify-start">
									<div className="fc gap-3 w-full h-full">
										<p className="text-xs text-zinc-300">No comments yet</p>
									</div>
								</div>
							</SwiperSlide>
						)}
					</AnimatePresence>
				</Swiper>
			</div>
		</section>
	);
};

export default CommentSlider;
