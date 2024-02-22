import { Movie, Show } from "@/types";
import React from "react";
import NewCard from "../components/NewCard";
import { Pagination } from "@nextui-org/react";
import LoadingAnimation from "../components/Loading";

interface Props {
  isLoading: boolean;
  filteredData: Array<Movie | Show>;
  query: string;
  totalPages: number;
  setPage: (page: number) => void;
  allData: any;
}

const SearchResults = ({
  isLoading,
  filteredData,
  query,
  totalPages,
  setPage,
  allData,
}: Props) => {
  return (
    <div className="z-10 mt-10 h-full w-full gap-4">
      {isLoading && (
        <div className="fc w-full gap-2">
          <LoadingAnimation />
          {/* <p className="text-2xl font-semibold text-zinc-400">Loading...</p> */}
        </div>
      )}
      {filteredData.length > 0 ? (
        <div className="xs:grid-cols-2 grid w-full grid-cols-1 place-items-center gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredData
            .sort((a, b) => b.popularity - a.popularity)
            .map((result: Movie | Show) => (
              <div key={result.id} className="light fc min-h-full w-full">
                <NewCard content={result} />
              </div>
            ))}
        </div>
      ) : query.length > 0 && allData.results.length === 0 && !isLoading ? (
        <div className="fr xl w-full font-semibold text-zinc-300">
          No results found for &quot;{query}&quot;
        </div>
      ) : null}
      {totalPages > 1 && filteredData.length > 0 && (
        <div className="fr my-16 w-full">
          <Pagination
            total={totalPages}
            initialPage={1}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
