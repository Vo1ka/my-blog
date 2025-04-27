import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../fireBase";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, orderBy, query, runTransaction, where } from "@firebase/firestore";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import ReplyForm from "../ReplyForm/ReplyForm";
import RepliesList from "../RepliesList/RepliesList";
import EditCommentForm from "../EditCommentForm/EditCommentForm";
import './CommentItem.scss'

interface CommentItemProps {
  comment: Comment;
  postId: string;
  parentId: string | null;
  depth?: number;
  onUpdate?: (updatedComment: Comment) => void;
  onDelete?: (commentId: string) => void;
}

const CommentItem = ({ comment, postId, parentId, depth = 0, onDelete, onUpdate }: CommentItemProps) => {

  const { user } = useAuth();
  const userId = user?.uid || '';
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const navigate = useNavigate();
    //Вложенность макс

  const MAX_DEPTH = 10;

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const commentRef = doc(db, 'comments', postId, 'comments', comment.id);
    const userId = user.uid;
    try {
      const newLikes = comment.likes.includes(userId)
        ? comment.likes.filter(id => id !== userId)
        : [...comment.likes, userId];

      onUpdate?.({ ...comment, likes: newLikes });

      await runTransaction(db, async (transaction) => {
        const docSnapshot = await transaction.get(commentRef);
        if (!docSnapshot.exists()) throw new Error('Комментарий не найден');
        transaction.update(commentRef, { likes: newLikes });
      });
    } catch (error) {
      onUpdate?.(comment);
      console.error('Ошибка при лайке:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить комментарий?')) return;
    
    try {
      await deleteDoc(doc(db, 'comments', postId, 'comments', comment.id));
      onDelete?.(comment.id);
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  const loadReplies = async () => {
    if (replies.length > 0 || !comment.replyCount) return;
    
    setIsLoadingReplies(true);
    try {
      const repliesSnapshot = await getDocs(
        query(
          collection(db, 'comments', postId, 'comments'),
          where('parentId', '==', comment.id),
          orderBy('createdAt', 'desc')
        )
      );
      
      const repliesData = repliesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      setReplies(repliesData);
    } catch (error) {
      console.error('Ошибка загрузки ответов:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  return (
    <div className={`comment ${depth > 0 ? 'reply' : ''}`}>
      <div className="comment-header">
        <span className="author-avatar">
          {comment.authorAvatar ? (
            <img src={comment.authorAvatar} alt={comment.authorName} />
          ) : (
            comment.authorName?.charAt(0) || '?'
          )}
        </span>
        <div>
          <span className="author-name">{comment.authorName || 'Аноним'}</span>
          <span className="comment-time">
          {comment.createdAt?.toDate ? 
            formatDistanceToNow(comment.createdAt.toDate(), { 
                addSuffix: true,
                locale: ru 
            }) : 
            'только что'}
          </span>
        </div>
      </div>

      {isEditing ? (
        <EditCommentForm
          postId={postId}
          commentId={comment.id}
          initialContent={comment.content}
          onSuccess={(newContent) => {
            setIsEditing(false);
            onUpdate?.({ 
              ...comment, 
              content: newContent,
              updatedAt: new Date() 
            });
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}

      <div className="comment-actions">
        <button onClick={handleLike}>
          {comment.likes.includes(userId) ? '❤️' : '♡'} {comment.likes.length}
        </button>
        <button onClick={() => setIsReplying(!isReplying)}>
          {isReplying ? 'Отмена' : 'Ответить'}
        </button>
        {user && user.uid === comment.authorId && (
          <>
            <button onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={handleDelete}>🗑️</button>
          </>
        )}
      </div>

      {isReplying && (
        <ReplyForm 
          postId={postId} 
          parentId={parentId} 
          onSuccess={() => setIsReplying(false)}
        />
      )}

      {comment.replyCount > 0 && (
        <button 
          onClick={loadReplies} 
          disabled={isLoadingReplies}
        >
          {isLoadingReplies ? 'Загрузка...' : `Показать ответы (${comment.replyCount})`}
        </button>
      )}

        {depth < MAX_DEPTH && (
        <RepliesList 
            replies={replies} 
            postId={postId}
            parentId={parentId}
            currentDepth={depth}
        />
        )}
    </div>
  );
};

export default CommentItem;