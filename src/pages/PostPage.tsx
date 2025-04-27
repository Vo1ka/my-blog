import { useNavigate, useParams } from 'react-router-dom';
import { Post } from '../types/post';
import { useEffect, useState } from 'react';
import PostCard from '../components/Post/PostCard/PostCard';
import './../styles/post-page.scss'
import { doc, getDoc } from '@firebase/firestore';
import { db } from '../fireBase';
import Header from '../components/UI/Header/Header';
import Footer from '../components/UI/Footer/Footer';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null); // Явно указываем тип
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
      const fetchPost = async () => {
          if (!id) return;
          
          try {
              const docRef = doc(db, "posts", id!);
              const docSnap = await getDoc(docRef);
              
              if (docSnap.exists()) {
                  const data = docSnap.data();
                  const postData: Post = {
                      id: docSnap.id,
                      title: data.title,
                      content: data.content,
                      userId: data.userId,
                      createdAt: data.createdAt?.toDate() || new Date(),
                      userDisplayName: data.userDisplayName,
                      tags: data.tags || [],
                      likeCount: 0
                  };
                  setPost(postData); 
              } else {
                  navigate('/404');
              }
          } catch (error) {
              setError(error instanceof Error ? error : new Error('Ошибка загрузки'));
          } finally {
              setIsLoading(false);
          }
      };

      fetchPost();
  }, [id]);
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Пост не найден</div>;
  if (!post) return (
    <div>
      <h2>Ошибка 404</h2>
      <p>Такого поста не существует.</p>
      <button onClick={() => navigate('/')}>На главную</button>
    </div>
  );
  return(
    <>
    <Header />
    <div className="post-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад к статьям
        </button>
        
        <div className="post-full">
          <PostCard 
            post={post} 
            
            isFullText={true}
          />
          
        </div>
      </div>
    <Footer />
    </>
    );
};

export default PostPage;