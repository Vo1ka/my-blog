import CommentItem from "../CommentItem/CommentItem";
import './CommentList.scss'

interface CommentListProps {
  comments: Comment[];
  postId: string;
}

const CommentList = ({ comments, postId }: CommentListProps) => {
  return (
    <ul className='commentsList'>
      {comments.map((comment) => (
        <li key={comment.id}>
          <CommentItem 
            comment={comment} 
            postId={postId} 
            parentId={null}
            depth={0}
          />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;