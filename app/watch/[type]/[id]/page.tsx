import options from '@/app/lib/options';
import { Metadata } from 'next';
import Main from './Main';
import { cookies } from 'next/headers';

type Props = {
	params: { type: string; id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
	} else if (keywords.keywords) {
		for (let i = 0; i < keywords.keywords.length; i++) {
			keywordsArray.push(keywords.keywords[i].name);
		}
	}
	// get image url from
	const image = content.poster_path || content.poster_path;

	return {
		title: `${content.title || content.name} | WatchWave`,
		keywords:
			'watch movies, movies online, watch TV, TV online, TV shows online, watch TV shows, stream movies, stream tv, instant streaming, watch online, movies, watch movies United States, watch TV online, no download, full length movies watch online, movies online, movies, watch movies online, watch movies, watch movies online free, watch movies for free, watch streaming media, watch tv online, watch movies online, watch movies online free, watch movies for free, watch streaming media, watch tv online, ' +
			keywordsArray.join(', '),
		description: `${content.overview}`,
		openGraph: {
			type: 'website',
			url: `https://watchwave.github.io/watch/${type}/${id}`,
			title: `Watch ${content.title || content.name} for free on WatchWave`,
			images: [image && { url: `/api/og?img=${image}&title=${content.title || content.name}` }],
		},
	};
}

export default function Page({ params }: Props) {
	return <Main params={params} />;
}
