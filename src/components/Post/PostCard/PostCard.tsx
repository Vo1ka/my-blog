import { Link, useNavigate } from "react-router-dom";
import './PostCard.scss'
import { Post } from "../../../types/post";
import { useState, useEffect, lazy, Suspense } from "react";
import { onSnapshot, doc, serverTimestamp, runTransaction } from "@firebase/firestore";
import { auth, db } from "../../../fireBase";

interface PostCardProps {
    post: Post;
    readMore?: boolean;
    isFullText?: boolean;  // Флаг для полного/краткого отображения
  }
const CommentsSection = lazy(() => import('../../Comments/CommentSection/CommentSection'));

const PostCard = ({post, readMore = true, isFullText = false}:PostCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(false);


    useEffect(() => {
        const unsubscribePost = onSnapshot(doc(db, "posts", post.id), (doc) => {
          if (doc.exists()) {
            setLikeCount(doc.data()?.likeCount || 0);
          }
        });
        return () => unsubscribePost();
      }, [post.id]);
  
    // 2. Подписка на лайк текущего пользователя
    useEffect(() => {
        if (!auth.currentUser?.uid) return;

        const userLikeRef = doc(db, `users/${auth.currentUser.uid}/likes`, post.id);
        const unsubscribeLike = onSnapshot(userLikeRef, (doc) => {
        setIsLiked(doc.exists());
        });

        return () => unsubscribeLike();
    }, [post.id, auth.currentUser?.uid]);
  
    const handleLike = async () => {
        if (!auth.currentUser) {
          navigate('/login');
          return;
        }
    
        const userLikeRef = doc(db, `users/${auth.currentUser.uid}/likes`, post.id);
        const postLikeRef = doc(db, "posts", post.id);
    
        try {
          await runTransaction(db, async (transaction) => {
            const likeDoc = await transaction.get(userLikeRef);
            const postDoc = await transaction.get(postLikeRef);
            
            if (likeDoc.exists()) {
              transaction.delete(userLikeRef);
              transaction.update(postLikeRef, {
                likeCount: (postDoc.data()?.likeCount || 0) - 1
              });
            } else {
              transaction.set(userLikeRef, {
                timestamp: serverTimestamp()
              });
              transaction.update(postLikeRef, {
                likeCount: (postDoc.data()?.likeCount || 0) + 1
              });
            }
          });
        } catch (error) {
          console.error("Ошибка при обновлении лайка:", error);
        }
      };

    const formattedDate = post.createdAt?.toLocaleString?.('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) || 'Дата не указана';
    return(
        <div className="postcard">
            <div className="postcard__header">
                <div className="author-info">
                <span className="author-avatar">
                    {post.userDisplayName?.charAt(0)}
                </span>
                <div className="author-details">
                    <span className="author-name">{post.userDisplayName}</span>
                    <time 
                      className="post-date" 
                      dateTime={post.createdAt instanceof Date ? post.createdAt.toISOString() : ''}
                    >
                    {formattedDate}
                    </time>
                </div>
                </div>
                <button 
                className={`like-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                
                >
                <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
                <span className="like-count">{likeCount}</span>
                </button>
            </div>

            <div className="postcard__content">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-excerpt">
                {isFullText ? (
                    <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                    <>
                    <p>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                    {post.content.length > 150 && (
                        <div className="postcard__footer">
                        <Link to={`/posts/${post.id}`} className="read-more">
                            Читать далее <span className="arrow">→</span>
                        </Link>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>

            {post.tags && (
                <div className="post-tags">
                {post.tags.map((tag, index) => (
                    <Link 
                    to={`/404`} 
                    key={index} 
                    className="tag"
                    onClick={(e) => e.stopPropagation()}
                    >
                    #{tag}
                    </Link>
                ))}
                </div>
            )}

            {readMore && (
                <div className="postcard__footer">
                <Link to={`/posts/${post.id}`} className="read-more">
                    Читать далее <span className="arrow">→</span>
                </Link>
                </div>
            )}

          <button onClick={() => setShowComments(!showComments)} className="comments-btn">
            {showComments ? 'Скрыть' : 'Показать комментарии'}
          </button>

          {showComments && (
            <Suspense fallback={<div>Загрузка комментариев...</div>}>
              <CommentsSection postId={post.id} />
            </Suspense>
          )}
        </div>

    )
}



export default PostCard;
