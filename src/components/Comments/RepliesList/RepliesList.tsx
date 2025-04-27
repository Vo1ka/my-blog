import CommentItem from "../CommentItem/CommentItem";
import './RepliesList.scss'

interface RepliesListProps {
  replies: Comment[];
  postId: string;
  parentId: string | null;
}

const RepliesList = ({ replies, postId, parentId, currentDepth  }: RepliesListProps & { currentDepth: number }) => {
    
  return (
    <div className="replies-list">
      {replies.map((reply) => (
        <CommentItem 
          key={reply.id} 
          comment={reply} 
          postId={postId}
          parentId={parentId}
          depth={currentDepth + 1}
        />
      ))}
    </div>
  );
};

export default RepliesList;