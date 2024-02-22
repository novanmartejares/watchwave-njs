"use client";
import { cubicBezier, motion } from "framer-motion";
import React from "react";
import LoadingAnimation from "./components/Loading";
const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fc fixed z-50 h-screen w-screen bg-black"
    >
      {/* bouncing ball animation */}
      <LoadingAnimation />
    </motion.div>
  );
};

export default Loading;
