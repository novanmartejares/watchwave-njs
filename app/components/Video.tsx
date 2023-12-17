"use client";
import { videoProps } from "@/types";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const Video = ({ video }: { video: videoProps }) => {
  const [started, setStarted] = useState(false);

  return (
    <div
      key={video.id}
      className="group relative aspect-[16/9] w-full min-w-[200px] max-w-[325px] flex-grow cursor-pointer"
    >
      <AnimatePresence mode="popLayout">
        {!started && (
          <motion.div
            // initial={{ opacity: 0, filter: "blur(10px)" }}
            // animate={{ opacity: 1, filter: "blur(0px)" }}
            // exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            onClick={() => setStarted((started) => !started)}
            className="aspect-video w-full"
          >
            <Image
              width={400}
              height={225}
              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
              alt="placeholder"
              className="h-full w-full rounded-2xl object-cover"
            />
            <div className="fc absolute inset-0 -right-1">
              <button>
                <FaPlay
                  className="text-white transition-transform group-hover:scale-150"
                  size={48}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {started && (
          <motion.div
            // initial={{ opacity: 0, filter: "blur(10px)" }}
            // animate={{ opacity: 1, filter: "blur(0px)" }}
            // exit={{ opacity: 0, filter: "blur(10px)" }}
            className="aspect-video w-full"
          >
            <motion.iframe
              // initial={{ opacity: 0, filter: "blur(10px)" }}
              // whileInView={{ opacity: 1, filter: "blur(0px)" }}
              // transition={{ duration: 0.5 }}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&modestbranding=1&enablejsapi=1`}
              title={video.name}
              allowFullScreen
            />
            <div className="fc pointer-events-none absolute right-2 top-2 items-end justify-start">
              <button
                onClick={() => setStarted(false)}
                className="pointer-events-auto rounded-full bg-default-50 p-2"
              >
                <AiFillCloseCircle size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Video;
