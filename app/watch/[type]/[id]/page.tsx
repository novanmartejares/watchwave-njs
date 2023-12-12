import options from '@/lib/options';
import { Metadata, ResolvingMetadata } from 'next';
import Main from './Main';
import { cookies } from 'next/headers';

type Props = {
	params: { type: string; id: number };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	// read route params
	const id = params.id;
	const type = params.type;
	cookies();

	// fetch data
	const content = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options).then((res) => res.json());

	// fetch keywords
	const keywords = await fetch(`https://api.themoviedb.org/3/${type}/${id}/keywords?language=en-US`, options).then((res) => res.json());
	let keywordsArray = [];
	if (keywords.results) {
		for (let i = 0; i < keywords.results.length; i++) {
			keywordsArray.push(keywords.results[i].name);
		}
	} else {
		for (let i = 0; i < keywords.keywords.length; i++) {
			keywordsArray.push(keywords.keywords[i].name);
		}
	}

	// get image url from
	const image = content.backdrop_path || content.poster_path;

	return {
		title: `WatchWave`,
		keywords:
			'watch movies, movies online, watch TV, TV online, TV shows online, watch TV shows, stream movies, stream tv, instant streaming, watch online, movies, watch movies United States, watch TV online, no download, full length movies watch online, movies online, movies, watch movies online, watch movies, watch movies online free, watch movies for free, watch streaming media, watch tv online, watch movies online, watch movies online free, watch movies for free, watch streaming media, watch tv online, ' +
			keywordsArray.join(', '),
		description: `${content.overview}`,
		openGraph: {
			type: 'website',
			url: `https://watchwave.github.io/watch/${type}/${id}`,
			title: `Watch ${content.title || content.name} for free on WatchWave`,
			images: [image && { url: `https://image.tmdb.org/t/p/w1280${image}` }],
		},
	};
}

export default function Page() {
	return <Main />;
}
