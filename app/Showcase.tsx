"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { MovieDetails, ShowDetails, fetchResults } from "../types";
import { Button, useDisclosure } from "@nextui-org/react";

import { IoAdd, IoCheckmark, IoPlay, IoStar } from "react-icons/io5";

import Slider from "@/app/components/Slider";
import Footer from "@/app/components/Footer";
import { Animation } from "./Animation";
import { useRouter } from "next/navigation";
import { UserAuth } from "./context/AuthContext";
import useAddToWatchlist from "./lib/firebase/addToWatchlist";
import getDocData from "./lib/firebase/getDocData";
import fetchDetails from "@/app/lib/fetchDetails";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./lib/firebase/firebase";
import { ModalManager } from "./lib/ModalManager";
import { format } from "date-fns";

import Link from "next/link";


interface Props {
  movie: MovieDetails & ShowDetails;
  collection: fetchResults;
}

const Showcase = ({ movie, collection }: Props) => {
  const imageURL = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  console.log(movie.logo);
  const router = useRouter();
  const { user } = UserAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const { add, remove } = useAddToWatchlist("movie", movie.id);
  const [cW, setCW] = useState<{
    heading: string;
    collection: Array<ShowDetails | MovieDetails>;
  } | null>(null);
  // record user info in firestore

  const generateDetails = () => {
    const details = {
      vote_average: (
        <li className="fr gap-1 whitespace-nowrap">
          <IoStar />
          <span>{movie.vote_average.toFixed(1)}</span>
        </li>
      ),
      release_date: new Date(movie.release_date).getFullYear(),
      content_rating: movie.content_rating && (
        <li className="border-1 whitespace-nowrap rounded-lg border-[#a1a1a1] px-1.5">
          {movie.content_rating}
        </li>
      ),
      runtime:
        movie.runtime &&
        format(
          new Date(0, 0, 0, 0, movie.runtime),
          "h 'hr' m 'min'",
        ).toString(),
      first_air_date: new Date(movie.first_air_date).getFullYear(),
      number_of_episodes:
        movie.number_of_episodes && `${movie.number_of_episodes} episodes`,
    };

    // remove undefined or NaN or null values
    Object.keys(details).forEach((key) => {
      const detailKey = key as keyof typeof details;
      if (
        details[detailKey] === undefined ||
        Number.isNaN(details[detailKey]) ||
        details[detailKey] === null
      ) {
        delete details[detailKey];
      }
    });

    // create an <li> for each value
    // in between, add a bullet point wrapped in a <li>
    let detailsArray = Object.values(details).map((detail, i) => {
      // if the value is already an <li>, return it
      if (typeof detail === "object") return detail;
      // otherwise, create a new <li> and return it
      return (
        <li className="whitespace-nowrap" key={i}>
          {detail}
        </li>
      );
    });

    // add a bullet point between each <li>
    detailsArray = detailsArray.reduce(
      (acc: React.ReactElement[], li: React.ReactElement, i: number) => {
        // if it's the last item, don't add a bullet point
        if (i === detailsArray.length - 1) return [...acc, li];
        // otherwise, add a bullet point and the <li>
        console.log([...acc, li, <li key={`bullet-${i}`}>•</li>]);
        return [...acc, li, <li key={`bullet-${i}`}>•</li>];
      },
      [] as React.ReactElement[],
    );

    return detailsArray;
  };

  const logUser = () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef)
      .then(async (docSnap) => {
        if (!docSnap.exists()) {
          console.log("doc does not exist");
          return;
        }
        await setDoc(
          docRef,
          {
            userInfo: {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              uid: user.uid,
              emailVerified: user.emailVerified,
            },
          },
          { merge: true },
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log(user);
    if (!user) return;
    logUser();
  }, [user]);

  //get continue watching data
  useEffect(() => {
    const getCW = async () => {
      //////////////////////////
      // Continue watching //

      let continueWatching = [];
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // access continueWatching array
          const continueWatchingData = docSnap.data().continueWatching;
          if (!continueWatchingData) return;
          console.log("continueWatchingData", continueWatchingData);
          // map through the array and fetch the details of each item
          const promises = continueWatchingData.map(async (item) => {
            const res = await fetchDetails(item.id, item.type);
            return res;
          });
          // await all promises
          const results = await Promise.all(promises);
          console.log("results", results);

          continueWatching = results.map((item, i) => {
            return {
              ...item,
              ...results[i],
            };
          });
        }
      }
      // set continue watching collection
      if (continueWatching.length > 0) {
        const continueWatchingCollection = {
          heading: "Continue Watching",
          collection: continueWatching,
        };
        setCW(continueWatchingCollection);
      }
    };
    getCW();
  }, [user]);

  // run getDocData only once
  useEffect(() => {
    if (!user) return;
    getDocData(user)
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (!user) setData(null);
  }, [user]);

  useEffect(() => {
    if (!data) return;
    if (data.movie) {
      if (data.movie.includes(movie.id)) {
        setIsInWatchlist(true);
      } else {
        setIsInWatchlist(false);
      }
    }
  }, [data, user]);

  const textRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const textElement = textRef.current;
    const maxHeight = 100; // Adjust as needed

    if (textElement === null) return;
    while (textElement.offsetHeight > maxHeight) {
      const style = window.getComputedStyle(textElement);
      const fontSize = parseFloat(style.fontSize);

      textElement.style.fontSize = `${fontSize - 1}px`;
    }
  }, []);

  return (
    <>
      {isLoading && <Animation />}
      {/* <iframe className="w-screen h-screen" src="https://d.daddylivehd.sx/embed/stream-1.php">
				Your Browser Do not Support Iframe
			</iframe> */}
      <ModalManager
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        type="watchlist"
      />
      <main className="light min-h-screen w-full overflow-hidden bg-black">
        <div className="fc w-screen justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-full w-full"
          >
            <Image
              src={imageURL}
              priority
              alt="movie poster"
              width={1920}
              height={1080}
              className="absolute h-full w-full object-cover object-center"
            />
            <motion.div
              initial={{
                background:
                  "radial-gradient(ellipse 100% 80% at 80% -50%, rgba(0, 0, 0) 0%, rgb(0, 0, 0) 100%)",
              }}
              animate={{
                background:
                  "radial-gradient(ellipse 100% 80% at 80% 20%, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)",
              }}
              transition={{ duration: 1 }}
              className="mask absolute h-full w-full"
            />
          </motion.div>
          <div className="fc mb-10 h-full w-full items-start justify-start">
            <div className="fc z-10 w-full items-start justify-start pt-80 sm:px-0 sm:pl-36">
              <div className="fc items-start justify-start px-5 pr-10">
                {movie.logo ? (
                  <div className="w-full px-3 lg:w-1/3">
                    <Image
                      src={movie.logo}
                      alt="movie logo"
                      width={300}
                      height={200}
                      className="mb-5 w-full lg:w-auto"
                    />
                  </div>
                ) : (
                  <h1
                    ref={textRef}
                    className="mb-3 pr-10 text-5xl font-bold text-white md:mb-5 md:text-8xl"
                  >
                    {movie.title}
                  </h1>
                )}

                {/* details */}
                <ul className="showcase_detail fr gap-3 font-medium text-white/80 sm:text-lg md:mt-1">
                  {generateDetails()}
                </ul>
								<p className="mt-4 max-w-[50ch] text-base font-medium leading-normal text-white/80">{movie.overview}</p>
								<div className="fr mt-4 gap-3">
									<Link href={`/watch/${movie.media_type}/${movie.id}`}>
										<Button size="lg" radius="sm" className="group h-11 font-semibold">
											<IoPlay
												size={20}
												className="text-sm transition-transform duration-500 group-hover:scale-110 sm:text-base"
											/>
											Play
										</Button>
									</Link>
									<Button
										size="lg"
										radius="sm"
										className="group h-11 text-sm font-semibold text-white hover:text-black sm:text-base"
										variant="ghost"
										onClick={() => {
											if (user) {
												if (isInWatchlist) {
													remove();
												} else {
													add();
												}
												getDocData(user)
													.then((res) => {
														setData(res);
													})
													.catch((err) => console.log(err));
											} else {
												onOpen();
											}
										}}
									>
										{!isInWatchlist ? (
											<>
												<IoAdd
													className="transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110"
													size={20}
												/>
												Add to Watchlist
											</>
										) : (
											<>
												<IoCheckmark size={20} />
												Added to Watchlist
											</>
										)}
									</Button>
								</div>
							</div>


              <div className="fc mt-10 w-full gap-10">
                {cW && cW.collection.length > 0 && (
                  <Slider
                    setIsLoading={setIsLoading}
                    headline={cW.heading}
                    section={cW}
                    more={false}
                    removeFromCW={true}
                  />
                )}
                {Object.keys(collection).map((key) => {
                  const collectionItem = collection[key as keyof fetchResults];
                  return (
                    <Slider
                      setIsLoading={setIsLoading}
                      key={key}
                      headline={collectionItem.heading}
                      section={collectionItem}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Showcase;
