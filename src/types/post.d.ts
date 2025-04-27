import { FieldValue } from "@firebase/firestore";

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  userDisplayName: string;
  createdAt: Date | FieldValue;
  likeCount: number;
  photoURL?: string | null;
  tags?: string[];
}