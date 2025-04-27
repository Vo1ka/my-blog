import { onSnapshot, collection, DocumentSnapshot, limit, orderBy, query, doc, getDoc, Timestamp, FieldValue } from "@firebase/firestore";
import { useState, useCallback, useEffect } from "react";
import { db } from "../../../fireBase";
import { fetchPosts } from "../../../services/api";
import { Post } from "../../../types/post";
import PostList from "../PostList/PostList";


interface RawPost {
    id?: string;
    title?: string;
    content?: string;
    userId?: string;
    userDisplayName?: string;
    userAvatar?: string;
    likeCount?: number;
    createdAt?: Timestamp | Date | FieldValue;
    tags?: string[];
  }
  
  interface PostDocument extends DocumentSnapshot {
    data(): RawPost;
  }

const PostListLoader = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const addPostsWithoutDuplicates = (newPosts: Post[], existingPosts: Post[]) => {
        const existingIds = new Set(existingPosts.map(p => p.id));
        return [...newPosts.filter(post => !existingIds.has(post.id)), ...existingPosts];
    };
    //
    const fetchPostsBatch = useCallback(async (lastDoc: DocumentSnapshot | null) => {
        try {
          const result = await fetchPosts(5, lastDoc);
          if (!result) return null;
          
          const postsWithAuthors = await Promise.all(
            result.posts.map(async (post) => {
              const postData: RawPost = post instanceof DocumentSnapshot 
                ? (post as PostDocument).data() 
                : post;
              
              let displayName = postData.userDisplayName;
              
              if (!displayName && postData.userId) {
                try {
                  const userRef = doc(db, "users", postData.userId);
                  const userSnap = await getDoc(userRef);
                  
                  if (userSnap.exists()) {
                    const userData = userSnap.data() as { displayName?: string; photoURL?: string };
                    displayName = userData.displayName || `User_${postData.userId.slice(0, 6)}`;
                  }
                } catch (error) {
                  console.error('Error fetching user data:', error);
                }
              }
              
              const processedPost: Post = {
                id: post.id || postData.id || '',
                title: postData.title || 'Без названия',
                content: postData.content || '',
                userId: postData.userId || 'unknown',
                userDisplayName: displayName || 'Аноним',
                likeCount: postData.likeCount || 0,
                createdAt: postData.createdAt instanceof Timestamp 
                  ? postData.createdAt.toDate() 
                  : postData.createdAt || new Date(),
                tags: postData.tags || []
              };
              
              return processedPost;
            })
          );
          
          return {
            posts: postsWithAuthors,
            lastVisible: result.lastVisible,
            hasMore: result.hasMore
          };
        } catch (e) {
          setError(e instanceof Error ? e : new Error('Ошибка загрузки'));
          return null;
        }
      }, []);
  //
    const loadInitialPosts = useCallback(async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      const result = await fetchPostsBatch(null);
      if (result) {
        setPosts(result.posts);
        setLastVisible(result.lastVisible);
        setHasMore(result.hasMore);
      }
      setIsLoading(false);
    }, [fetchPostsBatch, isLoading]);
    //
    const loadMore = useCallback(async () => {
      if (!hasMore || isLoading || !lastVisible) return;
      
       setIsLoadingMore(true);
      const result = await fetchPostsBatch(lastVisible);
      if (result) {
        setPosts(prev => addPostsWithoutDuplicates(result.posts, prev));
        setLastVisible(result.lastVisible);
        setHasMore(result.hasMore);
      }
      setIsLoadingMore(false);
    }, [hasMore, isLoading, lastVisible, fetchPostsBatch]);
  
    useEffect(() => {
        loadInitialPosts();
        
        const unsubscribe = onSnapshot(
          query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(1)),
          async (snapshot) => {
            if (!snapshot.empty && !isLoading) {
              const postDoc = snapshot.docs[0];
              const postData = postDoc.data();
              
              let displayName = postData.userDisplayName;
              let avatar = postData.userAvatar;
              
              if (!displayName && postData.userId) {
                try {
                  const userRef = doc(db, "users", postData.userId);
                  const userSnap = await getDoc(userRef);
                  
                  if (userSnap.exists()) {
                    const userData = userSnap.data();
                    displayName = userData.displayName || `User_${postData.userId.slice(0, 6)}`;
                    avatar = userData.photoURL || null;
                  }
                } catch (error) {
                  console.error('Error fetching user data:', error);
                }
              }
              
              const newPost = {
                id: postDoc.id,
                title: postData.title || '',
                content: postData.content || '',
                userId: postData.userId || '',
                userDisplayName: displayName || 'Аноним',
                userAvatar: avatar,
                likeCount: postData.likeCount || 0,
                createdAt: postData.createdAt?.toDate() || null,
                tags: postData.tags || []
              } as Post;
              
              setPosts(prev => addPostsWithoutDuplicates([newPost], prev));
            }
          }
        );
        
        return () => unsubscribe();
      }, [isLoading]);
    return (
      <PostList 
        posts={posts} 
        loading={isLoading} 
        error={error} 
        onLoadMore={loadMore} 
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        listType="PostList"
      />
    );
  };

  export default PostListLoader;