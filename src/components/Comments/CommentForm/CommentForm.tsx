import { useState } from 'react';
import './CommentForm.scss'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../fireBase';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSuccess: () => void;
}

const CommentForm = ({ postId, parentId = null, onSuccess }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Комментарий не может быть пустым');
      return;
    }

    if (!user) {
      setError('Необходимо авторизоваться');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'comments', postId, 'comments'), {
        content,
        authorId: user.uid,
        authorName: user.displayName || 'Аноним',
        authorAvatar: user.photoURL || null,
        parentId,
        postId,
        likes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        replyCount: 0
      });

      setContent('');
      onSuccess();
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      setError('Ошибка при отправке комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="error">{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Напишите комментарий..."
        disabled={isSubmitting}
        rows={3}
      />
      <button 
        type="submit" 
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};

export default CommentForm;