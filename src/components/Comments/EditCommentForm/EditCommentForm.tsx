import { useState } from 'react';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../fireBase';
import './EditCommentForm.scss'

interface EditFormProps {
  postId: string;
  commentId: string;
  initialContent: string;
  onSuccess: (newContent: string) => void
  onCancel: () => void;
}

const EditCommentForm = ({ 
  postId, 
  commentId,
  initialContent,
  onSuccess,
  onCancel 
}: EditFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateDoc(
        doc(db, 'comments', postId, 'comments', commentId),
        {
          content,
          updatedAt: serverTimestamp()
        }
      );
      onSuccess(content);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='edit-comment-form'>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        Сохранить
      </button>
      <button type="button" onClick={onCancel}>
        Отмена
      </button>
    </form>
  );
};

export default EditCommentForm;