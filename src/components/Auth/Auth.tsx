import { Link } from 'react-router-dom';
import './Auth.scss'
import { CgProfile } from "react-icons/cg";
import { useAuth } from '../../contexts/AuthContext';


const Auth = () => {

    const user = useAuth();
    return( 
        <div className="auth">
        {user.user ? (
            <Link className='user' to='/profile'>
                <CgProfile style={{width: '20px', height:'20px'}}/>
                <p>Профиль</p>
            </Link>
        ) : (
            <>
            <Link className="auth-link" to="/login">Войти</Link>
            <Link className="auth-link register" to="/register">Регистрация</Link>
            </>
        )}
        </div>
    )
}

export default Auth;