"use client";
import React, { useState } from "react";
import signInWithGoogle from "@/app/firebase/signInWithGoogle";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Logout from "@/app/firebase/Logout";
import { UserAuth } from "../context/AuthContext";
const User = () => {
  const { user } = UserAuth();
  console.log(user);

  return (
    <div className="fc h-screen w-screen">
      <button onClick={signInWithGoogle}>sign in</button>
      <button onClick={Logout}>log out</button>
      {user && user.displayName}
    </div>
  );
};

export default User;
