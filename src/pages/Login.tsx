import AuthForm from "../components/Auth/AuthForm/AuthForm";
import Footer from "../components/UI/Footer/Footer";
import Header from "../components/UI/Header/Header";


const Login = () => {

    return(
        <div className="login-container">
        <Header  />
        <AuthForm />
        <Footer />
        </div>
    )
}

export default Login;