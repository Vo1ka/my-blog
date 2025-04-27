import PostCard from "../PostCard/PostCard";
import { Post } from "../../../types/post";
import './PostList.scss';

interface PostListProps {
    posts: Post[];
    loading?: boolean;
    error?: Error | null;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    listType: 'likesList' | 'userPostList' | 'PostList'
  }

const PostList = ({ 
    posts, 
    loading = false, 
    error = null, 
    onLoadMore, 
    hasMore = false, isLoadingMore = false , listType }: PostListProps)  => {
    

    return (
        <div className="post-list">
      <div className="postList__header">
          <h2>
            {listType === 'likesList' 
              ? 'Понравившееся посты' 
              : listType === 'userPostList' 
                ? 'Посты пользователя' 
                : 'Последние посты'
            }
          </h2>
      </div>

      {loading && !posts.length ? (
        <div className='loading'>Загрузка...</div>
      ) : error ? (
        <div className='error'>{error.message}</div>
      ) : posts.length > 0 ? (
        <>
          <div className='postList__grid'>
            {posts.map((post) => (
              <PostCard 
                key={post.id}
                post={{
                  ...post,
                  createdAt: post.createdAt || new Date() // fallback
                }}
                isFullText={false}
              />
            ))}
          </div>
          
          {hasMore && (
            <button 
              onClick={onLoadMore} 
              disabled={isLoadingMore} 
              className="load-more-btn"
            >
              {isLoadingMore ? 'Загрузка...' : 'Показать ещё'}
            </button>
          )}
        </>
      ) : (
        <div className='empty'>Постов нет!</div>
      )}
    </div>
    );
};

export default PostList;