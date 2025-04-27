export interface PostData {
    title: string;
    content: string;
    userId: string;
    userDisplayName?: string;
    userAvatar?: string | null;
    likeCount?: number;
    createdAt: Timestamp;
    tags?: string[];
  }
  
export interface UserData {
    displayName?: string;
    photoURL?: string | null;
}