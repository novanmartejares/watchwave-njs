"use client";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { reviewProps } from "@/types";
import Image from "next/image";

const Review = ({ review }: { review: reviewProps }) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [height, setHeight] = useState<number | null>(null);
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    el.current && setHeight(el.current?.clientHeight);
  }, []);

  return (
    <div
      key={review.id}
      className="fc w-full rounded-xl bg-default-100 p-4 sm:w-auto"
    >
      <div className="fc w-full  items-start gap-2">
        <h5 className="fr gap-3 text-xl font-bold">
          {review?.author_details?.avatar_path && (
            <Image
              width={40}
              height={40}
              className="aspect-square w-10 rounded-full object-cover"
              src={`https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`}
              alt={"profile picture of " + review.author}
            />
          )}
          {review.author}
        </h5>
        <motion.div
          ref={el}
          className="relative w-full overflow-hidden"
          initial={{ height: "auto" }}
          animate={{
            height: showMore ? "auto" : height && height < 150 ? "auto" : 100,
          }}
        >
          <ReactMarkdown
            components={{
              br: ({ ...props }) => <br {...props} />,
            }}
            className="w-full max-w-[70ch] text-sm md:text-lg"
          >
            {review.content}
          </ReactMarkdown>
          <AnimatePresence>
            {!showMore && height && height > 100 && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-1/2 w-full bg-gradient-to-b from-transparent to-default-100"
              />
            )}
          </AnimatePresence>
        </motion.div>
        {height && height > 100 && (
          <div className="fr w-full justify-end">
            <Button
              onClick={() => setShowMore(!showMore)}
              variant="solid"
              color="default"
            >
              Show {showMore ? "Less" : "More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
