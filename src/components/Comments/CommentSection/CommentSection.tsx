import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import CommentList from '../CommentList/CommentList';
import CommentForm from '../CommentForm/CommentForm';
import { db } from '../../../fireBase';
import './CommentSection.scss'

const CommentsSection = ({ postId }: { postId: string }) => {
  const [rootComments, setRootComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'comments', postId, 'comments'),
      where('parentId', '==', null),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setRootComments(comments);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentAdded = () => {
    // Можно добавить дополнительную логику при успешном добавлении
  };

  return (
    <div className='comments-section'>
      <h3>Комментарии ({rootComments.length})</h3>
      
      <CommentForm postId={postId} onSuccess={handleCommentAdded} />

      {isLoading ? (
        <div className='loading'>
          <div className='spinner'></div>
          Загрузка комментариев...
        </div>
      ) : (
        <CommentList comments={rootComments} postId={postId} />
      )}
    </div>
  );
};

export default CommentsSection;