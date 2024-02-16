import { MovieDetails, ShowDetails } from '@/types';
import options from './options';

export default async function fetchDetails(id: number, media_type: string) {
	const res = await fetch(`https://api.themoviedb.org/3/${media_type}/${id}?language=en-US`, options);
	const data: MovieDetails | ShowDetails = await res.json();

	const fetchLogo = async (id: number, media_type: string) => {
		// fetch movie logos
		const res3 = await fetch(`https://api.themoviedb.org/3/${media_type}/${id}/images`, options);
		// filter logos that have iso_639_1 = en
		const res = await res3.json();
		const logos = res.logos;
		let path = '';
		for (let i = 0; i < logos.length; i++) {
			if (logos[i].iso_639_1 === 'en') {
				path = logos[i].file_path;
				break;
			}
		}
		return 'https://image.tmdb.org/t/p/original' + path;
	};

	// fetch content rating
	if (media_type === 'movie') {
		const res2 = await fetch(`https://api.themoviedb.org/3/${media_type}/${id}/release_dates?language=en-US`, options);
		const data2 = await res2.json();

		const countries = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'IN', 'ZA'];

		let content_rating = '';
		for (let i = 0; i < data2.results.length; i++) {
			if (countries.includes(data2.results[i].iso_3166_1)) {
				content_rating = data2.results[i].release_dates[0].certification;
				break;
			}
		}
		data.content_rating = content_rating;
		data.media_type = media_type;
		data.logo = await fetchLogo(id, media_type).then((res) => res);
	} else {
		const res2 = await fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings`, options);
		const data2 = await res2.json();
		console.log(data2);

		const countries = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'IN', 'ZA', 'BR'];

		let content_rating = '';
		for (let i = 0; i < data2.results.length; i++) {
			if (countries.includes(data2.results[i].iso_3166_1)) {
				content_rating = data2.results[i].rating;
				break;
			}
		}
		data.content_rating = content_rating;
		data.media_type = media_type;
		data.logo = await fetchLogo(id, media_type).then((res) => res);
	}
	return data;
}
