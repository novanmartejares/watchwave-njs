"use client";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import options from "@/app/lib/options";
import { Movie, Show } from "@/types";
import { Input } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { fetchDMCA } from "../lib/fetchDMCA";
import SearchResults from "./SearchResults";

const Search: React.FC = () => {
  const [fieldQuery, setFieldQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const filterDMCA = async (d) => {
    // collection "dmca", document "dmca", array "notices" inside array are numbers that are the id of the content
    // if the id of the content is in the array, remove it
    // fetch dmca data
    let dmca = await fetchDMCA();
    // console.log(dmca);
    const filtered = d.filter((result: Movie | Show) => {
      if (!dmca.includes(result.id)) {
        return result;
      }
    });
    console.log(filtered);
    return filtered;
  };

  useEffect(() => {
    if (fieldQuery === "") {
      setFilteredData([]);
      setIsLoading(false);
      setPage(1);
    }
  }, [fieldQuery]);

  // useEffect(() => {
  // 	console.log(fieldQuery);
  // }, [fieldQuery]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query) return;
      console.log(query, "searching...");
      setIsLoading(true);
      fetch(
        `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`,
        options,
      )
        .then((res) => res.json())
        .then((data) => {
          setTotalPages(data.total_pages);
          setAllData(data);
          data.results = data.results.filter(
            (result: Movie | Show) => result.media_type !== "person",
          );
          setIsLoading(false);
          console.log(data.results);
          filterDMCA(data.results).then((d) => {
            setFilteredData(() => [...d]);
          });
        });
      setPage(1);
    }, 800),
    [fieldQuery, page],
  );

  const setCurrentPage = (page: number) => {
    console.log("setting page...", page);
    setPage(page);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/multi?query=${fieldQuery}&include_adult=false&language=en-US&page=${page}`,
      options,
    )
      .then((res) => res.json())
      .then((data) => {
        data.results = data.results.filter(
          (result: Movie | Show) => result.media_type !== "person",
        );
        setIsLoading(false);
        setAllData(data);
        filterDMCA(data.results).then((d) => {
          setFilteredData([...d]);
        });
      });
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFieldQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="dark:bg-grid-white/[0.1] bg-grid-black/[0.1] relative flex h-full w-full items-center justify-center">
          {/* Radial gradient for the container to give a faded look */}
          <div className="pointer-events-none absolute inset-0  h-1/3 bg-gradient-to-b from-zinc-950 to-transparent"></div>
        </div>
      </div>
      <div className="fc mx-auto max-w-6xl justify-start px-3 pt-24 antialiased sm:px-10 sm:pl-36">
        <h1 className="z-10 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-5xl font-medium tracking-tight text-transparent md:text-7xl">
          Search
        </h1>
        <div className="fc w-full gap-2">
          <Input
            autoComplete="off"
            value={fieldQuery}
            onChange={handleInputChange}
            startContent={
              <IoSearch className="text-foreground-500" size={20} />
            }
            placeholder="Enter title to search"
            variant="flat"
            classNames={{
              base: "w-full max-w-[500px]",
              inputWrapper: "h-12",
              input: "text-base sm:text-xl",
            }}
          />
          <p className="text-sm font-semibold text-zinc-400">
            Enter exact title to search
          </p>
        </div>
        <SearchResults
          isLoading={isLoading}
          filteredData={filteredData}
          query={fieldQuery}
          totalPages={totalPages || 1}
          setPage={setCurrentPage}
          allData={allData}
        />
      </div>
    </div>
  );
};

export default Search;
