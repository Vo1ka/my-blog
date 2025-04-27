import { Post } from "../../../types/post";
import './TagsSection.scss'

interface TagsSectionProps {
  posts: Post[];
  onTagClick: (tag: string) => void;
}

const TagsSection = ({ posts, onTagClick }: TagsSectionProps) => {
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  return (
    <div className="tags-section">
      <h3>Популярные теги</h3>
      <div className="tags-list">
        {allTags.map(tag => (
          <button 
            key={tag} 
            onClick={() => onTagClick(tag)}
            className="tag"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;