import {
  Movie,
  MovieDetails,
  Show,
  ShowDetails,
  recommendationProps,
} from "@/types";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { IoAdd, IoCheckmark, IoClose, IoImage, IoList } from "react-icons/io5";
import useAddToContinueWatching from "../lib/firebase/addToContinueWatching";
import useAddToWatchlist from "../lib/firebase/addToWatchlist";
import getDocData from "../lib/firebase/getDocData";
import { UserAuth } from "../context/AuthContext";
import { ModalManager } from "../lib/ModalManager";
import { format } from "date-fns";

interface Props {
  content: Show | Movie | MovieDetails | ShowDetails | recommendationProps;
  removeFromCW?: boolean;
}

const NewCard = ({ content, removeFromCW }: Props) => {
  const { user } = UserAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const cw = useAddToContinueWatching(content.media_type, content.id);
  const [data, setData] = useState<any>(null);
  const [popover, setPopover] = useState(false);
  const { add, remove } = useAddToWatchlist(content.media_type, content.id);

  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    getDocData(user)
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
  }, [data, user]);

  const handleWatchlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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

  const handleRemoveFromCW = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) onOpen();
    cw.remove();
    getDocData(user)
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  };

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // create glow on hover
    const card = cardRef.current;
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - cardRect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - cardRect.top}px`);
  };

  return (
    <>
      <ModalManager
        onClose={onClose}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        type="watchlist"
      />
      <Popover
        isOpen={popover}
        onClick={() => setPopover(false)}
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
        <PopoverContent>
          {() => (
            <div className="max-w-[300px] px-1 py-2">
              <Image
                src={`https://image.tmdb.org/t/p/w500${content.backdrop_path}`}
                alt={"title" in content ? content.title : content.name}
                width={300}
                height={450}
                className="mb-3 aspect-video h-full w-full rounded-2xl"
              />

              <h3 className="font-bold">
                {"title" in content ? content.title : content.name} •{" "}
                {"release_date" in content && content.release_date.length !== 0
                  ? content.release_date.split("-")[0]
                  : "first_air_date" in content &&
                      content.first_air_date.length !== 0
                    ? content.first_air_date.split("-")[0]
                    : "N/A"}
                {"runtime" in content
                  ? ` • ${format(
                      new Date(0, 0, 0, 0, content.runtime),
                      "h 'hr' m 'min'",
                    )}`
                  : "number_of_episodes" in content
                    ? `• ${content.number_of_episodes} episodes • ${content.number_of_seasons} seasons`
                    : ""}
              </h3>
              <p className="w-full">{content.overview}</p>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <div
        onMouseMove={mouseMove}
        className="fc no-pointer:hidden group relative w-full max-w-[202px] cursor-pointer overflow-hidden rounded-2xl p-px"
      >
        {/* desktop with pointer */}
        <div
          ref={cardRef}
          className="glow absolute inset-0 h-full w-full rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
        <div className="group-hover:bg-foreground-800/90 transition-background h-full w-full max-w-[200px] rounded-2xl bg-transparent backdrop-blur-2xl">
          <div className="fc h-full w-full gap-2 p-2">
            <div className="fc w-full items-start gap-1">
              <Link
                href={`/watch/${content.media_type}/${content.id}`}
                className="w-full transition-transform group-hover:scale-[.97]"
              >
                {content.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${content.poster_path}`}
                    alt={"title" in content ? content.title : content.name}
                    width={300}
                    height={450}
                    className="mb-3 aspect-[2/3] h-full w-full rounded-2xl"
                  />
                ) : (
                  <div className="bg-foreground-800 fc relative mb-3 aspect-[2/3] rounded-2xl text-2xl">
                    <Image
                      src="/dummy_300x450.png"
                      alt="No Poster"
                      width={300}
                      height={450}
                      className="aspect-[2/3] h-full w-full opacity-0"
                    />
                    <IoImage className="absolute z-10" />
                  </div>
                )}
                <h4 className="text-sm font-bold text-white">
                  {"title" in content ? content.title : content.name}
                </h4>
                <div className="fr text-foreground-500 justify-start gap-1 text-xs">
                  <p>{content.media_type === "movie" ? "Movie" : "TV"}</p>
                  <p>•</p>
                  <p>
                    {"release_date" in content &&
                    content.release_date.length !== 0
                      ? content.release_date.split("-")[0]
                      : "first_air_date" in content &&
                          content.first_air_date.length !== 0
                        ? content.first_air_date.split("-")[0]
                        : "N/A"}
                  </p>
                </div>
              </Link>
              <div className="fr mt-3 gap-2">
                {removeFromCW && (
                  <Tooltip content="Remove from Continue Watching">
                    <Button
                      isIconOnly
                      color="danger"
                      radius="full"
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-black"
                      aria-label="add to watchlist"
                      onClick={handleRemoveFromCW}
                    >
                      {<IoClose size={15} />}
                    </Button>
                  </Tooltip>
                )}
                <Tooltip
                  content={
                    isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
                  }
                >
                  <Button
                    isIconOnly
                    color="default"
                    radius="full"
                    variant="ghost"
                    size="sm"
                    className={`text-white hover:text-black ${
                      !isInWatchlist ? "hover:rotate-90" : "hover:rotate-0"
                    }`}
                    aria-label="add to watchlist"
                    onClick={handleWatchlistClick}
                  >
                    {isInWatchlist ? (
                      <IoCheckmark size={15} />
                    ) : (
                      <IoAdd size={15} />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="More Info">
                  <Button
                    isIconOnly
                    color="default"
                    radius="full"
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-black"
                    onClick={() => setPopover(true)}
                  >
                    <IoList size={15} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile with no pointer */}
      <div className="pointer:hidden group">
        <div className="transition-background h-full w-full  max-w-[200px] rounded-2xl bg-transparent backdrop-blur-2xl">
          <div className="fc h-full w-full gap-2 p-2">
            <div className="fc w-full items-start gap-1">
              <Link href={`/watch/${content.media_type}/${content.id}`}>
                {content.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${content.poster_path}`}
                    alt={"title" in content ? content.title : content.name}
                    width={300}
                    height={450}
                    className="mb-3 aspect-[2/3] h-full w-full rounded-2xl"
                  />
                ) : (
                  <div className="bg-foreground-800 fc relative mb-3 aspect-[2/3] rounded-2xl text-2xl">
                    <Image
                      src="/dummy_300x450.png"
                      alt="No Poster"
                      width={300}
                      height={450}
                      className="aspect-[2/3] h-full w-full opacity-0"
                    />
                    <IoImage className="absolute z-10" />
                  </div>
                )}
                <h4 className="text-sm font-bold text-white">
                  {"title" in content ? content.title : content.name}
                </h4>
                <div className="fr text-foreground-500 justify-start gap-1 text-xs">
                  <p>{content.media_type === "movie" ? "Movie" : "TV"}</p>
                  <p>•</p>
                  <p>
                    {"release_date" in content &&
                    content.release_date.length !== 0
                      ? content.release_date.split("-")[0]
                      : "first_air_date" in content &&
                          content.first_air_date.length !== 0
                        ? content.first_air_date.split("-")[0]
                        : "N/A"}
                  </p>
                </div>
              </Link>
              <div className="fr mt-3 gap-2">
                {removeFromCW && (
                  <Tooltip content="Remove from Continue Watching">
                    <Button
                      isIconOnly
                      color="danger"
                      radius="full"
                      variant="ghost"
                      size="md"
                      className="text-white"
                      aria-label="add to watchlist"
                      onClick={handleRemoveFromCW}
                    >
                      {<IoClose size={22} />}
                    </Button>
                  </Tooltip>
                )}
                <Tooltip
                  content={
                    isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
                  }
                >
                  <Button
                    isIconOnly
                    color="default"
                    radius="full"
                    variant="ghost"
                    size="md"
                    className={`text-white`}
                    aria-label="add to watchlist"
                    onClick={handleWatchlistClick}
                  >
                    {isInWatchlist ? (
                      <IoCheckmark size={22} />
                    ) : (
                      <IoAdd size={22} />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="More Info">
                  <Button
                    isIconOnly
                    color="default"
                    radius="full"
                    variant="ghost"
                    size="md"
                    className="text-white"
                    onClick={() => setPopover(true)}
                  >
                    <IoList size={22} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCard;
