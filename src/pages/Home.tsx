
import PostForm from "../components/Post/PostForm/PostForm";
import PostListLoader from "../components/Post/PostListLoader/PostListLoader";
import Footer from "../components/UI/Footer/Footer";
import Header from "../components/UI/Header/Header"
import { useAuth } from "../contexts/AuthContext";
import './../styles/main.scss'


const Home = () => {

    const user = useAuth();
    return(
        <div className="page-layout">
        <Header />
        <main className="main-content">
          <div className="container">
            {user.user && <PostForm />}
            <PostListLoader />
          </div>
        </main>
        <Footer />
      </div>

    )
}

export default Home;