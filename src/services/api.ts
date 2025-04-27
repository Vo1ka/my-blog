// Новые импорты из Firebase
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit, 
  addDoc, 
  FieldValue,
  DocumentSnapshot,
  serverTimestamp,
  startAfter,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "./../fireBase";

// Типы остаются прежними, но могут расширяться
interface Post {
  data(): unknown;
  likeCount: number;
  id?: string; // Теперь id будет отдельно
  title: string;
  content: string;
  userId: string;
  createdAt: Date | FieldValue; // Для serverTimestamp()
  userDisplayName: string;
  tags: string[];
}

interface FetchPostsResponse {
  posts: Post[];
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
}


export const fetchPosts = async (
  itemsPerPage: number = 10,
  lastVisibleDoc: DocumentSnapshot | null = null
): Promise<FetchPostsResponse> => {
  try {
    // 1. Создаём базовый запрос
    let postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(itemsPerPage)
    );

    // 2. Добавляем пагинацию если нужно
    if (lastVisibleDoc) {
      postsQuery = query(postsQuery, startAfter(lastVisibleDoc));
    }

    // 3. Выполняем запрос
    const querySnapshot = await getDocs(postsQuery);
    
    // 4. Преобразуем документы (как у тебя сейчас)
    const posts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        userId: data.userId,
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate?.() || new Date()
      } as Post;
    });

    // 5. Определяем есть ли ещё данные
    const hasMore = posts.length === itemsPerPage;

    return {
      posts,
      lastVisible: hasMore ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
      hasMore
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

//По айди
export const fetchPost = async (id: string) => {
  try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
          const data = docSnap.data();
          return {
              id: docSnap.id,
              title: data.title,
              content: data.content,
              userId: data.userId,
              createdAt: data.createdAt?.toDate(), // Преобразуем Timestamp
              tags: data.tags || []
          } as Post;
      } else {
          throw new Error("Пост не найден");
      }
  } catch (error) {
      console.error("Ошибка при получении поста:", error);
      throw error;
  }
};

// Создание поста
export const createPost = async (postData: Omit<Post, "id">): Promise<string> => {
  try {
    // Проверка обязательных полей
    if (!postData.userId || !postData.userDisplayName) {
      throw new Error("Отсутствуют данные автора");
    }

    // Создаем объект с явным указанием всех полей
    const postToCreate = {
      title: postData.title,
      content: postData.content,
      userId: postData.userId,
      userDisplayName: postData.userDisplayName,
      createdAt: serverTimestamp(),
      tags: postData.tags || [], // Обеспечиваем fallback для tags
      likeCount: 0
    };

    const docRef = await addDoc(collection(db, "posts"), postToCreate);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    throw error;
  }
};