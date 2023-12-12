import { useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { UserInfo } from "@/types";

// firebase
const useGetUser = () => {
  const [user, setUser] = useState<UserInfo | null | string>("loading");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return user;
};

export default useGetUser;
