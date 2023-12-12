import { signOut } from "firebase/auth";
import { auth } from "./firebase";

const Logout = () => {
  signOut(auth)
    .then(() => {
      console.log("signed out");
    })
    .catch((error) => {
      console.log(error);
    });
};

export default Logout;
