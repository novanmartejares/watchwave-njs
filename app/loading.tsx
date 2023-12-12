"use client";
import { cubicBezier, motion } from "framer-motion";
import React from "react";

const Loading = () => {
  // ball easing
  const easing = cubicBezier(1, 0.5, 0, 1);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fc fixed z-50 h-screen w-screen bg-black"
    >
      {/* bouncing ball animation */}

      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className="text-white">Loading...</div>
    </motion.div>
  );
};

export default Loading;
