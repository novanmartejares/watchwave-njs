"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Movie,
  MovieDetails,
  Show,
  ShowDetails,
  recommendationProps,
} from "@/types";
import Image from "next/image";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { IoAdd, IoCheckmark, IoClose, IoList } from "react-icons/io5";
import { useRouter } from "next/navigation";
import useAddToWatchlist from "@/app/firebase/addToWatchlist";
interface Props {
  content: Show | Movie | MovieDetails | ShowDetails | recommendationProps;
  isDragging?: boolean;
  removeFromCW?: boolean;
}
import getDocData from "@/app/firebase/getDocData";
import { UserAuth } from "@/app/context/AuthContext";
import useAddToContinueWatching from "@/app/firebase/addToContinueWatching";

const ContentCard = ({ content, isDragging, removeFromCW }: Props) => {
  const { user, googleSignIn } = UserAuth();
  const router = useRouter();
  const cw = useAddToContinueWatching(content.media_type, content.id);
  const { add, remove } = useAddToWatchlist(content.media_type, content.id);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInCW, setIsInCW] = useState(false);
  const [data, setData] = useState<any>(null);
  const [popover, setPopover] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = getDocData(user)
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (!data) return;
    if (data[content.media_type]) {
      if (data[content.media_type].includes(content.id)) {
        setIsInWatchlist(true);
      } else {
        setIsInWatchlist(false);
      }
    }

    if (data.continueWatching) {
      if (data.continueWatching[content.media_type]) {
        if (data.continueWatching[content.media_type].includes(content.id)) {
          setIsInCW(true);
        } else {
          setIsInCW(false);
        }
      }
    }
  }, [data, user]);

  const handleWatchlistClick = () => {
    if (!user) onOpen();
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
  };

  const handleRemoveFromCW = () => {
    if (!user) onOpen();
    cw.remove();
    getDocData(user)
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  };

  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <div
      className={`aspect-[2/3] w-full max-w-[250px] ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add to Watchlist
              </ModalHeader>
              <ModalBody>
                <p>
                  You need to be logged in to add{" "}
                  {"title" in content ? content.title : content.name}
                  to watchlist.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    try {
                      googleSignIn();
                      onClose();
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Login
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="group relative h-full w-full">
        {content.poster_path ? (
          <>
            {!loading && (
              <div className="fc absolute h-full w-full bg-zinc-800">
                <div className="h-10 w-10 animate-pulse rounded-full border-2 border-zinc-500 bg-transparent" />
              </div>
            )}
            <Image
              onLoad={() => setLoading(true)}
              onClick={() => {
                if (isDragging === null) {
                  router.push(`/watch/${content.media_type}/${content.id}`);
                }
                if (!isDragging) {
                  router.push(`/watch/${content.media_type}/${content.id}`);
                }
              }}
              width={400}
              draggable={false}
              height={600}
              src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
              alt={"title" in content ? content.title : content.name}
              className="absolute h-full w-full rounded-xl object-cover"
            />
          </>
        ) : (
          <div
            onClick={() => {
              if (isDragging === null) {
                router.push(`/watch/${content.media_type}/${content.id}`);
              }
              if (!isDragging) {
                router.push(`/watch/${content.media_type}/${content.id}`);
              }
            }}
            className="fc h-full w-full rounded-xl bg-zinc-800 px-3"
          >
            <p className="text-center">
              {"title" in content ? content.title : content.name}
            </p>
          </div>
        )}
        <div className="fr pointer-events-none absolute bottom-0 h-full w-full opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          {/* <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-b from-transparent to-black"></div> */}
          <div className="fc relative h-full w-full items-end justify-between px-3 py-3">
            <div className="fr gap-2">
              <Chip radius="sm" color="default" size="sm">
                {content.media_type === "movie" ? "Movie" : "TV"}
              </Chip>
              <Chip radius="sm" color="default" size="sm">
                {"release_date" in content && content.release_date.length !== 0
                  ? content.release_date.split("-")[0]
                  : "first_air_date" in content &&
                      content.first_air_date.length !== 0
                    ? content.first_air_date.split("-")[0]
                    : "N/A"}
              </Chip>
            </div>
            <div className="fr pointer-events-auto text-white">
              {removeFromCW && (
                <Tooltip content="Remove from Continue Watching">
                  <Button
                    isIconOnly
                    color="default"
                    radius="full"
                    variant="solid"
                    className="mr-2 bg-zinc-500/70 text-white backdrop-blur-2xl"
                    aria-label="add to watchlist"
                    onClick={handleRemoveFromCW}
                  >
                    {<IoClose size={20} />}
                  </Button>
                </Tooltip>
              )}
              <Tooltip content="Add to Watchlist">
                <Button
                  isIconOnly
                  color="default"
                  radius="full"
                  variant="solid"
                  className="mr-2 bg-zinc-500/70 text-white backdrop-blur-2xl"
                  aria-label="add to watchlist"
                  onClick={handleWatchlistClick}
                >
                  {isInWatchlist ? (
                    <IoCheckmark size={20} />
                  ) : (
                    <IoAdd size={20} />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="More Info">
                <Button
                  isIconOnly
                  color="default"
                  radius="full"
                  variant="solid"
                  className="bg-zinc-500/70 text-white backdrop-blur-2xl"
                  onClick={() => setPopover(true)}
                >
                  <IoList size={20} />
                </Button>
              </Tooltip>
              <Popover
                onClick={() => setPopover(false)}
                isOpen={popover}
                onOpenChange={(open) => setPopover(open)}
                showArrow
                backdrop="opaque"
                placement="right"
                classNames={{
                  base: [
                    // arrow color
                    "before:bg-default-200",
                  ],
                }}
              >
                <PopoverTrigger>
                  <div></div>
                </PopoverTrigger>
                <PopoverContent onClick={() => setPopover(false)}>
                  {(titleProps) => (
                    <div className="px-1 py-2">
                      <h3 className="font-bold">
                        {"title" in content ? content.title : content.name} •{" "}
                        {"release_date" in content &&
                        content.release_date.length !== 0
                          ? content.release_date.split("-")[0]
                          : "first_air_date" in content &&
                              content.first_air_date.length !== 0
                            ? content.first_air_date.split("-")[0]
                            : "N/A"}
                      </h3>
                      <p className="max-w-[300px]">{content.overview}</p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
