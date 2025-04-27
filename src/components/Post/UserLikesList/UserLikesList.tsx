import { getDocs, query, collection, getDoc, doc } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../../fireBase";
import { Post } from "../../../types/post";
import PostList from "../PostList/PostList";

interface UserLikesListProps {
    userId?: string; // Делаем опциональным
  }

  const UserLikesList = ({ userId }: UserLikesListProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (!userId) {
        setLoading(false);
        setError('Пользователь не идентифицирован');
        return;
      }
  
      const fetchLikedPosts = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // 1. Получаем список лайков пользователя
          const likesSnapshot = await getDocs(
            query(collection(db, `users/${userId}/likes`))
          );
          
          if (likesSnapshot.empty) {
            setPosts([]);
            return;
          }
  
          // 2. Получаем данные по каждому посту
          const postsPromises = likesSnapshot.docs.map(async likeDoc => {
            const postDoc = await getDoc(doc(db, "posts", likeDoc.id));
            if (!postDoc.exists()) return null;
            
            return {
              id: postDoc.id,
              ...postDoc.data(),
              createdAt: postDoc.data().createdAt?.toDate(),
              likeCount: postDoc.data().likeCount || 0
            } as Post;
          });
  
          const postsData = (await Promise.all(postsPromises)).filter(Boolean) as Post[];
          setPosts(postsData);
          
        } catch (err) {
          console.error("Ошибка загрузки понравившихся постов:", err);
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      };
  
      fetchLikedPosts();
    }, [userId]);
  
    if (loading) {
      return <div className="loading">Загрузка понравившихся постов...</div>;
    }
  
    if (error) {
      return <div className="error">{error}</div>;
    }
  
    if (!posts.length) {
      return <div className="empty">Нет понравившихся постов</div>;
    }
  
    return <PostList posts={posts} listType="likesList" />;
  };
  
  export default UserLikesList;