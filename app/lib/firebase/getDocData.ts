import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const getDocData = async (user) => {
  if (!user) return;
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log(docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    throw new Error("No such document!");
  }

  return docSnap.data();
};

export default getDocData;
