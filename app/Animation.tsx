import { motion } from 'framer-motion';
export function Animation() {
	return (
		<div className="fc animation-container fixed z-30 h-screen w-screen bg-black">
			{/* <motion.svg
        className="h-full w-full stroke-white md:h-[130px]"
        width="90"
        height="81"
        viewBox="0 0 90 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            yoyo: Infinity,
          }}
          initial={{
            pathLength: 0,
          }}
          d="M0 10.2062V10.2062C8.68276 5.19325 19.7777 7.99117 25.0449 16.5221L58.5 70.7062V70.7062C49.8172 75.7192 38.7223 72.9213 33.4551 64.3904L0 10.2062Z"
          fill="none"
          strokeWidth={4}
          strokeDasharray="0 1"
        />
        <motion.path
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            yoyo: Infinity,
          }}
          initial={{
            pathLength: 0,
          }}
          d="M30 10.7021V10.7021C38.6703 5.6963 49.7507 8.52051 54.967 17.0657L75.5 50.7021V50.7021C66.8297 55.7079 55.7493 52.8837 50.533 44.3384L30 10.7021Z"
          fill="none"
          strokeWidth={4}
          strokeDasharray="0 1"
        />
        <motion.path
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            yoyo: Infinity,
          }}
          initial={{
            pathLength: 0,
          }}
          d="M66.6063 13.3877C70.7505 6.85852 79.3054 4.75754 86.0027 8.62422L89.6091 10.7064L75.5885 34.9908L66.5381 20.0671C65.2898 18.0085 65.3162 15.4203 66.6063 13.3877V13.3877Z"
          fill="none"
          strokeWidth={4}
          strokeDasharray="0 1"
        />
      </motion.svg> */}
			<svg
				className="w-full animate-pulse stroke-white h-[100px] md:h-[130px]"
				width="90"
				height="81"
				viewBox="0 0 90 81"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 10.2062V10.2062C8.68276 5.19325 19.7777 7.99117 25.0449 16.5221L58.5 70.7062V70.7062C49.8172 75.7192 38.7223 72.9213 33.4551 64.3904L0 10.2062Z"
					fill="none"
					className="stroke-white"
					strokeWidth={4}
				/>
				<path
					d="M30 10.7021V10.7021C38.6703 5.6963 49.7507 8.52051 54.967 17.0657L75.5 50.7021V50.7021C66.8297 55.7079 55.7493 52.8837 50.533 44.3384L30 10.7021Z"
					fill="none"
					className="stroke-white"
					strokeWidth={4}
				/>
				<path
					d="M66.6063 13.3877C70.7505 6.85852 79.3054 4.75754 86.0027 8.62422L89.6091 10.7064L75.5885 34.9908L66.5381 20.0671C65.2898 18.0085 65.3162 15.4203 66.6063 13.3877V13.3877Z"
					fill="none"
					className="stroke-white"
					strokeWidth={4}
				/>
			</svg>
		</div>
	);
}
