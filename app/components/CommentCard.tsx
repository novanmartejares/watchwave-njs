import useComment from '@/app/lib/firebase/useComment';
import { Comment } from '@/types';
import { Button } from '@nextui-org/react';
import { format } from 'date-fns';
import { User } from 'firebase/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { IoHeart } from 'react-icons/io5';

interface Props {
	comment: Comment;
	user: User | null;
}

const CommentCard = ({ comment, user }: Props) => {
	const { deleteC, likeComment } = useComment();
	if (!comment) return null;
	console.log(comment);

	return (
		<motion.div
			key={comment.uuid}
			initial={{ opacity: 0, width: '0px', minWidth: '0px' }}
			animate={{ opacity: 1, width: 'auto', minWidth: '280px' }}
			exit={{ opacity: 0, width: '0px', minWidth: '0px' }}
			transition={{ duration: 0.2 }}
			className="w-full bg-zinc-800 fc cursor-grab active:cursor-grabbing h-full rounded-2xl gap-3 overflow-hidden"
		>
			<motion.div
				animate={{ opacity: [0, 1] }}
				transition={{ duration: 0.3 }}
				initial={{ opacity: 0 }}
				exit={{ opacity: 0 }}
				className="min-w-[280px] h-full fc items-start px-5 py-4 justify-between"
			>
				<div className="fc gap-3 justify-start items-start">
					<div className="fr gap-2 w-full items-start justify-start">
						<Image src={comment.photoURL} width={40} height={40} alt="profile picture" className="w-10 h-10 rounded-full" />
						<div className="fc justify-start items-start">
							<h4 className="text-lg font-bold">{comment.name}</h4>
							<p className="text-sm text-zinc-400">
								{/* created at timestamp example "2024-02-02T05:48:00.598Z" */}
								{/* format with date-fns into example format: May 5, 2024 • 5:32 PM */}
								{format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
							</p>
						</div>
					</div>
					<p className="text-sm w-full">{comment.comment}</p>
				</div>
				<div className="w-full fr pt-5 justify-between">
					{user?.uid === comment.userId && (
						<Button onClick={() => deleteC(comment.uuid, comment.contentId, comment.category)}>Delete</Button>
					)}
					{/* like button */}
					<Button
						className={`fr gap-2 px-unit-xs min-w-unit-2 ${comment.likes[user?.uid as string] ? 'text-red-500' : 'text-zinc-400'}`}
						onClick={() => {
							// if comment.likes includes user.uid, then unlike
							// else like
							if (comment.likes[user?.uid as string]) {
								likeComment(comment.uuid, comment.contentId, comment.category, false);
							} else {
								likeComment(comment.uuid, comment.contentId, comment.category, true);
							}
						}}
						endContent={<IoHeart />}
					>
						<span className="ml-2">{Object.keys(comment.likes).length}</span>
					</Button>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default CommentCard;
