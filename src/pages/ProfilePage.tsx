import { getDoc, doc } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/UI/Footer/Footer";
import Header from "../components/UI/Header/Header";
import { db, auth } from "../fireBase";
import { User } from "../types/auth";
import './../styles/profile-page.scss'
import UserLikesList from "../components/Post/UserLikesList/UserLikesList";
import UserPostList from "../components/Post/UserPostList/UserPostList";



interface ProfilePageProps {
  userId: string; // Делаем обязательным
}



const ProfilePage = ({userId}:ProfilePageProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
  const navigate = useNavigate();

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
          throw new Error('Пользователь не найден');
        }
        
        const data = userDoc.data();
        if (!data) {
          throw new Error('Данные пользователя отсутствуют');
        }

        // Более строгая проверка обязательных полей
        if (!data.uid && !userId) {
          throw new Error('Идентификатор пользователя отсутствует');
        }
        const userData: User = {
          uid: data.uid || userId,
          email: data.email || 'unknown@example.com',
          displayName: data.displayName || '',
          photoURL: data.photoURL || null,
          createdAt: data.createdAt?.toDate() || null
        };
        
        setUser(userData);
      } catch (err) {
        setUser(null);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="error-message">
        <p>{error || 'Пользователь не найден'}</p>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-header">
        <div className="user-info">
          <div className="avatar">
            {user.displayName?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div className="user-details"> {/* Добавляем этот класс */}
            <h1>{user.displayName || user.email}</h1>
            <p className="user-registration-date"> {/* Дополнительный класс для даты */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Зарегистрирован: {user.createdAt?.toLocaleDateString()}
            </p>
          </div>
        </div>
          
          {auth.currentUser?.uid === userId && (
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          )}
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'posts' ? 'active' : ''}
            onClick={() => setActiveTab('posts')}
          >
            Посты
          </button>
          <button 
            className={activeTab === 'likes' ? 'active' : ''}
            onClick={() => setActiveTab('likes')}
          >
            Лайки
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'posts' ? (
            <UserPostList userId={userId} />
          ) : (
            <UserLikesList userId={userId } />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};


export default ProfilePage;