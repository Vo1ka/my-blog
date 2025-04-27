import { Link } from "react-router-dom";
import './Footer.scss'

const Footer = () => {


    return(
        <footer className="footer">
  <div className="footer__container">
    <div className="footer__content">
      <div className="footer__copyright">
        © My Blog {new Date().getFullYear()}
      </div>
      
      <nav className="footer__nav" aria-label="Дополнительная навигация">
        <ul className="footer__nav-list">
          <li className="footer__nav-item">
            <a 
              href="https://github.com/Vo1ka" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__link"
            >
              GitHub
            </a>
          </li>
          <li className="footer__nav-item">
            <Link to="/about" className="footer__link">
              О блоге
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</footer>


    )
}

export default Footer;