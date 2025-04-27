import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../fireBase";
import { setDoc, doc, serverTimestamp } from "@firebase/firestore";
import './AuthForm.scss'

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
   
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, {
          displayName: displayName.trim()
        });
          // Создаем запись в Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName.trim(),
          createdAt: serverTimestamp()
        });
      }
      // Редирект после успешной авторизации
      setTimeout(()=>{
        navigate('/profile');
      }, 3000)
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error:", error.code);
        setError(getFriendlyError(error.code));
      } else {
        console.error("Unknown Error:", error);
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendlyError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-email': return 'Некорректный email';
      case 'auth/user-not-found': return 'Пользователь не найден';
      case 'auth/wrong-password': return 'Неверный пароль';
      case 'auth/email-already-in-use': return 'Email уже используется';
      default: return 'Ошибка авторизации';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="authForm">
      <h2 className='authForm__title'>
        {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
      </h2>
      <div className="authForm_inputGroup">
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="authForm__input"
        />
      </div>
      <div className="authForm_inputGroup">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="authForm__input"
        />
      </div>
      {!isLogin && (
        <div className="authForm_inputGroup">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Придумайте никнейм"
            required
            minLength={3}
            maxLength={20}
            className="authForm__input"
          />
          </div>
      )}
      
      {error && <div className="authForm__error">{error}</div>}
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="authForm__submitBtn"
      >
        {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>
      <div className="authForm__divider">
        <span>или</span>
      </div>
      <button 
        type="button" 
        onClick={() => {
          setIsLogin(!isLogin);
          setDisplayName(''); // Сбрасываем никнейм при переключении
        }}
        disabled={isLoading}
        className="authForm__toggleBtn"
      >
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
      </button>
    </form>
  );
};

export default AuthForm;

