import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../fireBase";


export const createPost = async (title: string, content: string) => {
  await addDoc(collection(db, "posts"), {
    title,
    content,
    userId: auth.currentUser?.uid,
    createdAt: serverTimestamp()
  });
};