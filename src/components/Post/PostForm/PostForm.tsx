import { useState } from "react";
import { auth, db } from "../../../fireBase";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { FirebaseError } from "firebase/app";
import './PostForm.scss';

const PostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    
    const handleTagAdd = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
          setTags([...tags, currentTag.trim()]);
          setCurrentTag('');
        }
      };
      
      const handleTagRemove = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
      };
      
      const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleTagAdd();
        }
      };

    const onChangeInput = (e:React.ChangeEvent<HTMLInputElement>) => {

        const prev = e.target.value;
        setTitle(prev);
    }

    const onChangeContent = (e:React.ChangeEvent<HTMLTextAreaElement>) => {

        const prev = e.target.value;
        setContent(prev)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.currentUser) {
            alert("Нужно авторизоваться!");
            return;
          }
          
          try {
            const newPost = {
                title,
                content,
                userId: auth.currentUser.uid,
                userDisplayName: auth.currentUser.displayName || 'Пользователь',
                userAvatar: auth.currentUser.photoURL || null,
                createdAt: serverTimestamp(),
                likeCount: 0,
                tags
              };
            
              await addDoc(collection(db, "posts"), newPost);
            
            // Очистка формы после успешного создания
            setTitle("");
            setContent("");
            setTags([]);
            setCurrentTag("");
            alert("Пост создан!");
          } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Firebase Error:", error.code);
                alert(`Ошибка: ${error.message}`);
            } else {
                console.error("Unknown Error:", error);
                alert("Произошла неизвестная ошибка");
            }
        };
    }
    return(
        <form className="post-form" onSubmit={handleSubmit}>
            <h2 className="post-form__title">Создание поста</h2>
            
            <div className="post-form__group">
                <label className="post-form__label">Заголовок</label>
                <input
                type="text"
                className="post-form__input"
                value={title}
                onChange={onChangeInput}
                placeholder="Напишите заголовок..."
                />
            </div>

            <div className="post-form__group">
                <label className="post-form__label">Содержание</label>
                <textarea
                className="post-form__textarea"
                value={content}
                onChange={onChangeContent}
                placeholder="Расскажите подробнее..."
                />
            </div>

            <div className="post-form__group">
                <label className="post-form__label">Теги</label>
                <div className="tags-input-container">
                    <div className="tags-list">
                    {tags.map(tag => (
                        <span key={tag} className="tag">
                        {tag}
                        <button 
                            type="button" 
                            onClick={() => handleTagRemove(tag)}
                            className="tag-remove"
                        >
                            ×
                        </button>
                        </span>
                    ))}
                    </div>
                    <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Добавьте теги..."
                    className="post-form__input"
                    />
                    <button 
                    type="button" 
                    onClick={handleTagAdd}
                    className="add-tag-button"
                    >
                    Добавить
                    </button>
                </div>
            </div>

            <button type="submit" className="post-form__button">
                Опубликовать
            </button>
        </form>

    )
}


export default PostForm;