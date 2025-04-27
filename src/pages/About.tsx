import Footer from "../components/UI/Footer/Footer"
import Header from "../components/UI/Header/Header"
import './../styles/about-page.scss';


const  About = () => {



    return(
        <>
        <Header />
        <main className="about-page">
            <article className="about-content">
            <header className="about-header">
                <h1 className="about-title">О блоге</h1>
                <p className="about-subtitle">Ваше пространство для творчества и самовыражения</p>
            </header>

            <section className="about-section">
                <h2 className="section-title">Добро пожаловать!</h2>
                <div className="section-content">
                <p>Это простое и удобное приложение для тех, кто любит делиться своими мыслями с миром.</p>
                
                <div className="features-grid">
                    <div className="feature-card">
                    <span className="feature-icon">✍️</span>
                    <h3>Публикация постов</h3>
                    <p>Пишите тексты, добавляйте изображения и оформляйте записи</p>
                    </div>
                    
                    <div className="feature-card">
                    <span className="feature-icon">📂</span>
                    <h3>Организация контента</h3>
                    <p>Используйте теги для удобной навигации</p>
                    </div>
                    
                    <div className="feature-card">
                    <span className="feature-icon">🔍</span>
                    <h3>Открытие нового</h3>
                    <p>Читайте посты других авторов и находите вдохновение</p>
                    </div>
                </div>
                </div>
            </section>

            <section className="about-section about-tech">
                <h2 className="section-title">Технологии проекта</h2>
                <div className="tech-stack">
                <div className="tech-category">
                    <h4>Frontend</h4>
                    <ul className="tech-list">
                    <li>React + TypeScript</li>
                    <li>Redux Toolkit</li>
                    <li>React Router</li>
                    <li>SCSS Modules</li>
                    </ul>
                </div>
                
                <div className="tech-category">
                    <h4>Backend</h4>
                    <ul className="tech-list">
                    <li>Firebase</li>
                    <li>Firestore Database</li>
                    <li>Firebase Auth</li>
                    </ul>
                </div>
                </div>
                
                <div className="about-cta">
                <p>Проект с открытым исходным кодом. Присоединяйтесь к разработке!</p>
                <a 
                    href="https://github.com/Vo1ka/my-blog" 
                    className="cta-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub репозиторий
                </a>
                </div>
            </section>
            </article>
        </main>
        <Footer />
        </>


    )
}

export default About