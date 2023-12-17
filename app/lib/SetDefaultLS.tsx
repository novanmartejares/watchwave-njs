import React, { useEffect } from 'react';

const SetDefaultLS = () => {
	useEffect(() => {
		const fc = localStorage.getItem('faviconChange');
		const ss = localStorage.getItem('sliderScroll');

		if (!fc) {
			localStorage.setItem('faviconChange', 'false');
		}
		if (!ss) {
			localStorage.setItem('sliderScroll', 'false');
		}
	}, []);
	return <></>;
};

export default SetDefaultLS;
