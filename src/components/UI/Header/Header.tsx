import { Link } from "react-router-dom";
import './Header.scss'
import Auth from "../../Auth/Auth";
import { useState } from "react";
import { CgClose, CgMenu } from "react-icons/cg";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return(
        <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Мой блог
        </Link>
        
        <div className="header__controls">
            <ThemeToggle />
            <button 
                className="header__burger" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <CgClose size={24} /> : <CgMenu size={24} />}
            </button>
        </div>

        <nav 
          className={`nav-bar ${isMenuOpen ? 'nav-bar--open' : ''}`}
          aria-label="Основная навигация"
        >
          <ul>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Главная
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                О проекте
              </Link>
            </li>
          </ul>
        </nav>

        <div className={`header__auth ${isMenuOpen ? 'header__auth--open' : ''}`}>
          <Auth />
        </div>
      </div>
    </header>
    )
}

export default Header;