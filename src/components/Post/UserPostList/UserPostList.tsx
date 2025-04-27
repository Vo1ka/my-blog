import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../../fireBase";
import { Post } from "../../../types/post";
import PostList from "../PostList/PostList";

interface UserPostListProps {
    userId?: string; 
  }

  const UserPostList = ({ userId }: UserPostListProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserPosts = async () => {
        try {
          if (!userId) throw new Error("Не указан ID пользователя");
  
          setLoading(true);
          setError(null);
  
          // 1. Получаем данные пользователя
          const userDoc = await getDoc(doc(db, "users", userId));
          if (!userDoc.exists()) {
            throw new Error("Пользователь не найден");
          }
          
          const userData = userDoc.data();
          const userDisplayName = userData.displayName

          // 2. Получаем посты пользователя
          const postsSnapshot = await getDocs(
            query(collection(db, "posts"), where("userId", "==", userId))
          );
          
          const userPosts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            userDisplayName,
            createdAt: doc.data().createdAt?.toDate(),
          } as Post));
  
          setPosts(userPosts);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Ошибка загрузки");
          console.error(err);
          return <p>{error}</p>
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserPosts();
    }, [userId]);
  
    return <PostList posts={posts} loading={loading} listType="userPostList" />;
  };

  export default UserPostList;