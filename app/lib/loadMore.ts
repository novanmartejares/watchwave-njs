import { Movie, MovieSection, Show, TvSection } from "@/types";
import options from "./options";

// passed a url for tmdb, load the next page '&page=2' and return the data
export const loadMore = async (section: TvSection | MovieSection) => {
  // section has a url and a page number, so we can just increment the page number, and add the url data to section.collection
  const sectionCopy = { ...section };
  sectionCopy.page += 1;
  const url = `${sectionCopy.url}&page=${sectionCopy.page}`;
  const res = await fetch(url, options);
  let data = await res.json();
  data = data.results;
  console.log(data);

  // if it's trending TV, filter out anime
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

    console.log(newTV);
    return newTV;
  };

  if (sectionCopy.url.includes("tv")) {
    data.results = await getKeywordsAndFilterAnime(data);
    // add media_type to each show
    data.forEach((show: Show) => {
      show.media_type = "tv";
    });
  }

  if (sectionCopy.url.includes("movie/")) {
    // for each movie, fetch the keywords
    for (let i = 0; i < data.length; i++) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${data[i].id}/keywords?language=en-US`,
        options,
      ).then((res) => res.json());
      data[i].keywords = res.keywords;
    }

    // add a media type to each object
    data.forEach((movie: Movie) => {
      movie.media_type = "movie";
    });
  }

  // check for copies and remove them
  const ids = sectionCopy.collection.map((item: Movie | Show) => item.id);
  data = data.filter((item: Movie | Show) => !ids.includes(item.id));

  // sectioncopy.collection is an array of arrays, so we need to push the new data into the first array
  sectionCopy.collection.push(...data);
  return sectionCopy;
};
