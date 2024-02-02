import React from 'react';
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import { IoHome, IoSearch, IoListOutline, IoTv, IoCog } from 'react-icons/io5';

const BottomNavbar: React.FC = () => {
	const icons = [
		{
			path: '/',
			title: 'Home',
			link: true,
			icon: (
				<div>
					<IoHome size={30} />
				</div>
			),
		},
		{
			path: '/search',
			title: 'Search',
			link: true,
			icon: (
				<div>
					<IoSearch size={30} />
				</div>
			),
		},
		{
			path: '/watchlist',
			title: 'Watchlist',
			link: true,
			icon: (
				<div>
					<IoListOutline size={30} />
				</div>
			),
		},
	];

	return (
		<div className="fc fixed bottom-2 z-50 w-screen items-end pointer-events-none pr-4 sm:hidden">
			<div className="fc h-full gap-5 rounded-full bg-black/20 px-3 py-5 backdrop-blur-xl pointer-events-auto">
				{icons.map((icon) => (
					<Link href={icon.path} key={icon.title} className="fc h-8 w-8 text-white/70">
						{icon.icon}
					</Link>
				))}
			</div>
		</div>
	);
};

export default BottomNavbar;
