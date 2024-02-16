export interface Movie {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	media_type: string;
}

export interface Genre {
	id: number;
	name: string;
}

export interface Collection {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
}

export interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

export interface MovieDetails {
	logo: string;
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: Collection;
	budget: number;
	content_rating?: string;
	genres: Genre[];
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	media_type: string;
	vote_average: number;
	vote_count: number;
}

export interface Show {
	adult: boolean;
	backdrop_path: string;
	id: number;
	name: string;
	original_language: string;
	original_name: string;
	overview: string;
	poster_path: string;
	media_type: string;
	genre_ids: number[];
	keywords: keyword[];
	popularity: number;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	origin_country: string[];
}

export interface MovieSection {
	url: string;
	page: number;
	collection: Movie[] | recommendationProps[];
	heading: string;
}

export interface TvSection {
	url: string;
	page: number;
	collection: Show[] | recommendationProps[];
	heading: string;
}

// write fetchResults so any key is either a MovieSection or TvSection
export interface fetchResults {
	[key: string]: MovieSection | TvSection;
}

export interface keyword {
	id: number;
	name: string;
}

export interface Genre {
	id: number;
	name: string;
}

export interface EpisodeToAir {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	episode_type: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
}

export interface Network {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
}

export interface Season {
	air_date: string;
	episode_count: number;
	episodes: Episode[];
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	season_number: number;
	vote_average: number;
}

export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

export interface ShowDetails {
	logo: string;
	media_type: string;
	adult: boolean;
	backdrop_path: string;
	created_by: any[]; // Adjust the type accordingly if there's a specific type for this
	episode_run_time: number[];
	first_air_date: string;
	genres: Genre[];
	content_rating: string;
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: EpisodeToAir;
	name: string;
	next_episode_to_air: null | any; // Adjust the type accordingly
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	seasons: Season[];
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
}

export interface recommendationsProps {
	page: number;
	results: recommendationProps[];
	total_pages: number;
	total_results: number;
}
export interface tvRecommendationsProps {
	page: number;
	results: tvRecommendationProps[];
	total_pages: number;
	total_results: number;
}

export interface recommendationProps {
	original_name: string;
	adult: boolean;
	backdrop_path: string | null;
	id: number;
	title: string;
	original_language: string;
	original_title: string;
	overview: string;
	poster_path: string;
	media_type: 'tv' | 'movie' | 'person';
	genre_ids: number[];
	popularity: number;
	release_date: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface reviewProps {
	author: string;
	author_details: {
		name: string;
		username: string;
		avatar_path: string;
		rating: number;
	};
	content: string;
	created_at: string;
	id: string;
	updated_at: string;
	url: string;
}
export interface keywordProps {
	id: number;
	name: string;
}

export interface genresProps {
	id: number;
	name: string;
}
export interface keywordsProps {
	id: number;
	keywords?: keywordProps[];
	results?: keywordProps[];
}
export interface tvRecommendationProps {
	adult: boolean;
	backdrop_path: string | null;
	id: number;
	name: string;
	original_language: string;
	original_name: string;
	overview: string;
	poster_path: string | null;
	media_type: 'tv' | 'movie' | 'person';
	genre_ids: number[];
	popularity: number;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	origin_country: string[];
}

export interface videosProps {
	id: number;
	results: videoProps[];
}

export interface videoProps {
	id: string;
	iso_639_1: string;
	iso_3166_1: string;
	key: string;
	name: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	published_at: string;
}

export interface UserInfo {
	uid: string;
	email: string;
	emailVerified: boolean;
	displayName: string;
	isAnonymous: boolean;
	photoURL: string;
	providerData: ProviderData[];
	stsTokenManager: {
		refreshToken: string;
		accessToken: string;
		expirationTime: number;
	};
	createdAt: string;
	lastLoginAt: string;
	apiKey: string;
	appName: string;
}

export interface ProviderData {
	providerId: string;
	uid: string;
	displayName: string;
	email: string;
	phoneNumber: string | null;
	photoURL: string;
}

export interface creditsProps {
	cast: castProps[];
	crew: object[];
	id: number;
}

export interface castProps {
	imdb_id: string;
	adult: boolean;
	gender: 1 | 2;
	character: string;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	credit_id: string;
	department: string;
	job: string;
}

export interface Episode {
	air_date: string;
	episode_number: number;
	episode_type: string;
	id: number;
	name: string;
	overview: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
	vote_average: number;
	vote_count: number;
	crew: CrewMember[];
	guest_stars: GuestStar[];
}

export interface CrewMember {
	job: string;
	department: string;
	credit_id: string;
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
}

export interface GuestStar {
	character: string;
	credit_id: string;
	order: number;
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
}

export interface SearchResultsProps {
	page: number;
	results: Movie[] | Show[];
	total_pages: number;
	total_results: number;
}

export interface Comment {
	userId: string;
	name: string;
	photoURL: string;
	comment: string;
	likes: number;
	createdAt: string;
	uuid: string;
	contentId: number;
	category: string;
}

export interface Comments {
	[key: string]: Comment[];
}
