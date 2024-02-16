'use client';
import Loading from '@/app/loading';
import ContentCard from '@/app/components/ContentCard';
import Footer from '@/app/components/Footer';
import options from '@/app/lib/options';
import { Movie, SearchResultsProps, Show } from '@/types';
import { Button, Input, Slider } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { fetchDMCA } from '../lib/fetchDMCA';
const Search = () => {
	const params = useSearchParams();
	const [fieldQuery, setFieldQuery] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [searchData, setSearchData] = useState<SearchResultsProps | null>(null);
	const [year, setYear] = useState<number[]>([1900, new Date().getFullYear()]);
	const [filteredData, setFilteredData] = useState<(Movie | Show)[]>([]);

	const router = useRouter();

	const clearField = () => {
		router.push('/search');
	};
	useEffect(() => {
		console.log(filteredData);
	}, [filteredData]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// if fieldQuery is empty, return
		if (!fieldQuery) return;
		router.push(`/search?query=${fieldQuery}`);
	};

	// filter out dmca content
	const filterDMCA = async () => {
		// collection "dmca", document "dmca", array "notices" inside array are numbers that are the id of the content
		// if the id of the content is in the array, remove it

		// fetch dmca data
		fetchDMCA().then((data) => {
			// filter out dmca content
			const filt = data.filter((result: Movie | Show) => {
				if (result.media_type === 'movie' && 'title' in result) {
					return !data.includes(result.id);
				}
				if (result.media_type === 'tv' && 'name' in result) {
					return !data.includes(result.id);
				}
			});
			return filt;
		});
	};

	// fetch data from api
	useEffect(() => {
		const query = params.get('query');
		if (!query) return;
		fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`, options)
			.then((res) => res.json())
			.then((data) => {
				// remove people
				data.results = data.results.filter((result: Movie | Show) => result.media_type !== 'person');
				setIsLoading(false);
				setSearchData(data);
				filterDMCA(data.results).then((d) => {
					setFilteredData(d);
				});
			});
	}, [params]);

	const loadMore = () => {
		// console.log(
		//   "%c Loading More...",
		//   "background: #222; color: #bada55; font-size: 25px; font-weight: bold;",
		// );
		if (!searchData) return;
		const query = params.get('query');
		fetch(
			`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${
				searchData.page + 1
			}&sort_by=popularity.desc`,
			options
		)
			.then((res) => res.json())
			.then((data) => {
				// remove people
				data.results = data.results.filter((result: Movie | Show) => result.media_type !== 'person');
				setIsLoading(false);
				setSearchData({
					...data,
					results: [...searchData.results, ...data.results],
				});
				// filter out tv shows and movies BOT
				const filtered = data.results.filter((result: Movie | Show) => {
					if (result.media_type === 'movie' && 'title' in result) {
						return (
							result.release_date &&
							new Date(result.release_date).getFullYear() >= year[0] &&
							new Date(result.release_date).getFullYear() <= year[1]
						);
					}
					if (result.media_type === 'tv' && 'name' in result) {
						return (
							result.first_air_date &&
							new Date(result.first_air_date).getFullYear() >= year[0] &&
							new Date(result.first_air_date).getFullYear() <= year[1]
						);
					}
				});
				filterDMCA([...filteredData, ...filtered]).then((d) => {
					setFilteredData([...d]);
				});
			});
	};

	// when year is changed, filter filteredData
	useEffect(() => {
		if (!searchData) return;
		const filtered: (Movie | Show)[] = searchData.results.filter((result: Movie | Show) => {
			if (result.media_type === 'movie' && 'title' in result) {
				return (
					result.release_date &&
					new Date(result.release_date).getFullYear() >= year[0] &&
					new Date(result.release_date).getFullYear() <= year[1]
				);
			}
			if (result.media_type === 'tv' && 'name' in result) {
				return (
					result.first_air_date &&
					new Date(result.first_air_date).getFullYear() >= year[0] &&
					new Date(result.first_air_date).getFullYear() <= year[1]
				);
			}
		});
		filterDMCA(filtered).then((d) => {
			setFilteredData(d);
		});

		// if filtered data's length is less than 20, load more
		if (filtered.length < 20) {
			loadMore();
		}
	}, [year]);

	// if (isLoading) return <Loading />;

	return (
		<div className="min-h-screen w-full overflow-hidden bg-background px-5 text-foreground dark">
			<div className="w-full pt-20 sm:pl-36">
				<div className="fc h-full w-full gap-3">
					<form className="fc w-full gap-2" onSubmit={handleSubmit}>
						<div className="fc sm:fr w-full gap-2">
							<Input
								value={fieldQuery}
								onChange={(e) => setFieldQuery(e.target.value)}
								startContent={<IoSearch className="text-foreground-500" size={20} />}
								placeholder="Search"
								variant="bordered"
								classNames={{
									base: 'w-full max-w-[500px]',
									inputWrapper: 'h-12',
									input: 'text-xl',
								}}
							/>
							<div className="fr w-full gap-2 sm:w-auto">
								<Button variant="bordered" className="h-12 w-full sm:w-auto" onClick={clearField}>
									Clear
								</Button>
								<Button className="h-12 w-full sm:w-auto" type="submit">
									Search
								</Button>
							</div>
						</div>
						{searchData && filteredData && (
							<Slider
								onChange={(a) => {
									// if a is number array
									if (typeof a === 'number') {
										setYear([a, a]);
									} else {
										setYear(a);
									}
								}}
								label="Year Range"
								step={1}
								minValue={1900}
								maxValue={new Date().getFullYear()}
								defaultValue={year}
								color="foreground"
								formatOptions={{
									style: 'decimal',
									useGrouping: false,
								}}
								className="w-full max-w-[500px]"
							/>
						)}
					</form>
					<p className="text-lg font-bold text-gray-500">Enter exact title to search</p>
					{searchData && filteredData && (
						<div className="mt-10 w-full">
							{
								<div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 md:grid-cols-5">
									{filteredData?.map((result) => <ContentCard content={result} key={result.id} />)}
								</div>
							}
							{filteredData.length === 0 && <div className="fc w-full">No content found</div>}
							{searchData && searchData.page < searchData.total_pages && (
								<div className="fc mt-4 w-full">
									<Button variant="bordered" onClick={loadMore}>
										Load More
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			{searchData && filteredData && <Footer />}
		</div>
	);
};

export default Search;
