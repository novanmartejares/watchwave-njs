'use client';
import React, { Fragment } from 'react';
import { IoHome, IoSearch, IoListOutline } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UserAuth } from '@/app/context/AuthContext';
const Navbar = () => {
	const { user, googleSignIn, logOut } = UserAuth();
	const pathname = usePathname();
	const router = useRouter();
	const icons = [
		{
			path: '/',
			link: true,
			icon: (
				<svg className="h-10" width="90" height="81" viewBox="0 0 90 81" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						className="fill-white"
						d="M0 10.2062V10.2062C8.68276 5.19325 19.7777 7.99117 25.0449 16.5221L58.5 70.7062V70.7062C49.8172 75.7192 38.7223 72.9213 33.4551 64.3904L0 10.2062Z"
					/>
					<path
						className="fill-white"
						d="M30 10.7021V10.7021C38.6703 5.6963 49.7507 8.52051 54.967 17.0657L75.5 50.7021V50.7021C66.8297 55.7079 55.7493 52.8837 50.533 44.3384L30 10.7021Z"
					/>
					<path
						className="fill-white"
						d="M66.6063 13.3877C70.7505 6.85852 79.3054 4.75754 86.0027 8.62422L89.6091 10.7064L75.5885 34.9908L66.5381 20.0671C65.2898 18.0085 65.3162 15.4203 66.6063 13.3877V13.3877Z"
					/>
				</svg>
			),
		},
		{
			path: '/',
			title: 'Home',
			link: true,
			hideOnMobile: true,
			icon: (
				<div>
					<IoHome />
				</div>
			),
		},
		{
			path: '/search',
			title: 'Search',
			link: true,
			hideOnMobile: true,
			icon: (
				<div>
					<IoSearch />
				</div>
			),
		},
		{
			path: '/watchlist',
			title: 'Watchlist',
			link: true,
			hideOnMobile: true,
			icon: (
				<div>
					<IoListOutline />
				</div>
			),
		},

		// {
		//   path: "/settings",
		//   title: "Settings",
		//   link: true,
		//   hideOnMobile: true,
		//   icon: (
		//     <div>
		//       <IoCog />
		//     </div>
		//   ),
		// },
		{
			path: '/account',
			// title: "Account",
			link: false,
			icon: (
				<div className="h-10">
					{typeof user !== 'string' && (
						<>
							{user?.photoURL ? (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="cursor-pointer">
									<Dropdown placement="right">
										<DropdownTrigger>
											<Image className="h-10 rounded-full" width={40} height={40} src={user.photoURL} alt="avatar" />
										</DropdownTrigger>
										<DropdownMenu aria-label="Static Actions">
											{/* <DropdownItem key="account">
                        Account Settings
                      </DropdownItem> */}
											<DropdownItem
												key="delete"
												className="text-danger"
												color="danger"
												onClick={() => {
													logOut();
													router.refresh();
												}}
											>
												Log Out
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</motion.div>
							) : (
								<Button
									onClick={() => {
										try {
											googleSignIn();
										} catch (e) {
											console.log(e);
										}
									}}
									className="text-white light hover:text-black"
									variant="ghost"
								>
									Login
								</Button>
							)}
						</>
					)}
				</div>
			),
		},
	];

	return (
		<div className="fixed z-20 w-full bg-black/20 px-5 backdrop-blur-xl sm:h-full sm:w-auto sm:bg-transparent sm:backdrop-blur-none  standalone:pt-10 pointer-events-none">
			<div className="fr sm:fc justify-between text-2xl sm:justify-center sm:px-10 sm:pt-0 w-full h-full pointer-events-auto relative">
				{icons.map((icon, i) => (
					<Fragment key={icon.path + i}>
						{icon.link !== false ? (
							<Link
								href={icon.path}
								className={`flex h-16 w-16 items-center justify-center ${pathname === icon.path ? 'text-white' : 'text-white/50'} ${
									icon.icon.props.className
								} ${icon.hideOnMobile && 'hidden sm:flex'}`}
							>
								{icon.title ? (
									<Tooltip className="text-foreground dark" placement="right" content={icon.title}>
										{icon.icon}
									</Tooltip>
								) : (
									icon.icon
								)}
							</Link>
						) : (
							<div
								className={`flex h-16 w-16 items-center justify-center ${pathname === icon.path ? 'text-white' : 'text-white/50'} ${
									icon.icon.props.className
								}`}
							>
								{icon.title ? (
									<Tooltip className="text-foreground dark" placement="right" content={icon.title}>
										{icon.icon}
									</Tooltip>
								) : (
									icon.icon
								)}
							</div>
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default Navbar;
