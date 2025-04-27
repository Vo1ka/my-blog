import { useState } from 'react';
import { db } from '../../../fireBase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import './ReplyForm.scss'

interface ReplyFormProps {
  postId: string;
  parentId: string | null;
  onSuccess: () => void; // Колбэк после успешной отправки
}

const ReplyForm = ({ postId, parentId, onSuccess }: ReplyFormProps) => {
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
    setError('');

    try {
      await addDoc(collection(db, 'comments', postId, 'comments'), {
        content,
        authorId: user.uid,
        authorName: user.displayName || 'Аноним',
        authorAvatar: user.photoURL || null,
        parentId, // Важно: привязываем к родительскому комментарию
        postId, // Дублируем для удобства запросов
        likes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setContent('');
      onSuccess(); // Закрываем форму и обновляем список
    } catch (err) {
      console.error('Ошибка при отправке комментария:', err);
      setError('Ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      {error && <div className="error-message">{error}</div>}
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ваш ответ..."
        disabled={isSubmitting}
        rows={3}
      />
      
      <div className="form-actions">
        <button 
          type="button" 
          onClick={() => onSuccess()}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        
        <button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Ответить'}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;