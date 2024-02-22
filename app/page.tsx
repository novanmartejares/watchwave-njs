import options from "./lib/options";
import Showcase from "./Showcase";
import { Movie, MovieDetails, Show, ShowDetails, fetchResults } from "../types";
import fetchDetails from "@/app/lib/fetchDetails";

async function fetchData() {
  //////////////////////////
  // Trending //

  let trending_movies = await fetch(
    "https://api.themoviedb.org/3/trending/movie/week?language=en-US",
    options,
  ).then((res) => res.json());
  trending_movies = trending_movies.results;

  // for each movie, fetch the keywords
  for (let i = 0; i < trending_movies.length; i++) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${trending_movies[i].id}/keywords?language=en-US`,
      options,
    ).then((res) => res.json());
    trending_movies[i].keywords = res.keywords;
  }

  // add a media type to each object
  trending_movies.forEach((movie: Movie) => {
    movie.media_type = "movie";
  });

  // console.log("trending movies\n\n\n", trending_movies);

  //////////////////////////
  // Top rated movies //

  let top_rated_movies = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US",
    options,
  ).then((res) => res.json());
  top_rated_movies = top_rated_movies.results;

  // for each movie, fetch the keywords
  for (let i = 0; i < top_rated_movies.length; i++) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${top_rated_movies[i].id}/keywords?language=en-US`,
      options,
    ).then((res) => res.json());
    top_rated_movies[i].keywords = res.keywords;
  }

  // add a media type to each object
  top_rated_movies.forEach((movie: Movie) => {
    movie.media_type = "movie";
  });

  //////////////////////////
  // TV //

  const getKeywordsAndFilterAnime = async (tv: Show[]) => {
    let newTV = tv;

    for (let i = 0; i < tv.length; i++) {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${newTV[i].id}/keywords`,
        options,
      ).then((res) => res.json());
      newTV[i].keywords = res.results;
    }

    newTV = newTV.filter((tv: Show) => {
      return !tv.keywords.some((keyword) => {
        return keyword.id === 210024 || keyword.id === 287501;
      });
    });

    // console.log(newTV);
    return newTV;
  };

  let trending_tv = await fetch(
    "https://api.themoviedb.org/3/trending/tv/week?language=en-US",
    options,
  ).then((res) => res.json());
  trending_tv = trending_tv.results;

  // filter out anime
  trending_tv = await getKeywordsAndFilterAnime(trending_tv);

  // fetch second page
  let res_tv2 = await fetch(
    "https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=2",
    options,
  ).then((res) => res.json());

  trending_tv = trending_tv.concat(res_tv2.results);

  // filter out anime
  trending_tv = await getKeywordsAndFilterAnime(trending_tv);

  // add a media type to each object
  trending_tv.forEach((tv: Show) => {
    tv.media_type = "tv";
  });

  // slice to 20
  trending_tv = trending_tv.slice(0, 20);

  //////////////////////////
  // Anime //

  let res_anime = await fetch(
    "https://api.themoviedb.org/3/discover/tv?include_adult=false&language=en-US&page=1&with_keywords=210024|287501",
    options,
  ).then((res) => res.json());
  res_anime = res_anime.results;

  // add a media type to each object
  res_anime.forEach((anime: Show) => {
    anime.media_type = "tv";
  });

  //////////////////////////
  // Documentaries //
  let comedy = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=35",
    options,
  ).then((res) => res.json());
  comedy = comedy.results;

  // add a media type to each object
  comedy.forEach((doc: Movie) => {
    doc.media_type = "movie";
  });

  //////////////////////////
  // Horror //
  let horror = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=27",
    options,
  ).then((res) => res.json());
  horror = horror.results;

  // add a media type to each object
  horror.forEach((doc: Movie) => {
    doc.media_type = "movie";
  });

  //////////////////
  // Action //
  let action = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28",
    options,
  ).then((res) => res.json());
  action = action.results;

  // add a media type to each object
  action.forEach((doc: Movie) => {
    doc.media_type = "movie";
  });

  //////////////////
  // Sci-fi //
  let sci_fi = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=878",
    options,
  ).then((res) => res.json());

  sci_fi = sci_fi.results;

  // add a media type to each object
  sci_fi.forEach((doc: Movie) => {
    doc.media_type = "movie";
  });

  //////////////////
  // Fantasy //
  let fantasy = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=14",
    options,
  ).then((res) => res.json());

  fantasy = fantasy.results;

  // add a media type to each object
  fantasy.forEach((doc: Movie) => {
    doc.media_type = "movie";
  });

  //////////////////////////
  // Results //
  const results: fetchResults = {
    trending_movies: {
      url: "https://api.themoviedb.org/3/trending/movie/week?language=en-US&include_adult=false",
      page: 1,
      heading: "Trending Movies",
      collection: [...trending_movies],
    },
    top_rated_movies: {
      url: "https://api.themoviedb.org/3/movie/top_rated?language=en-US&include_adult=false",
      page: 1,
      heading: "Top Rated Movies",
      collection: [...top_rated_movies],
    },
    trending_tv: {
      url: "https://api.themoviedb.org/3/trending/tv/week?language=en-US&include_adult=false",
      page: 1,
      heading: "Trending TV",
      collection: [...trending_tv],
    },
    comedy: {
      url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=35",
      page: 1,
      heading: "Comedy",
      collection: [...comedy],
    },
    anime: {
      url: "https://api.themoviedb.org/3/discover/tv?language=en-US&with_keywords=210024|287501include_adult=false",
      page: 1,
      heading: "Anime",
      collection: [...res_anime],
    },
    horror: {
      url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=27",
      page: 1,
      heading: "Horror",
      collection: [...horror],
    },
    action: {
      url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=28",
      page: 1,
      heading: "Action",
      collection: [...action],
    },
    sci_fi: {
      url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=878",
      page: 1,
      heading: "Sci-fi",
      collection: [...sci_fi],
    },
    fantasy: {
      url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=14",
      page: 1,
      heading: "Fantasy",
      collection: [...fantasy],
    },
  };

  return results;
}

export default async function Home() {

	const data = await fetchData();
	//  for showcased, select random number (0 - 1) 50% chance of being 0 or 1
	// if 0, showcase trending movie
	// if 1, showcase trending tv
	// after this pick number between 1 and 5 to showcase
	const random = Math.floor(Math.random() * 2);
	let showcased: MovieDetails | ShowDetails;
	if (random === 0) {
		showcased = data.trending_movies.collection[Math.floor(Math.random() * 6)];
	} else {
		showcased = data.trending_tv.collection[Math.floor(Math.random() * 6)];
	}

	console.log('showcased', showcased);
	// fetch with fetchDetails()

	const res = await fetchDetails(showcased.id, showcased.media_type);
	showcased = res;

	// console.log('showcased', showcased);

	return <Showcase movie={showcased} collection={data} />;
}
