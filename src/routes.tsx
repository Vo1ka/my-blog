import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import PostPage from './pages/PostPage'
import ProtectedRoute from './ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import About from './pages/About'
import PageNotFound from './pages/PageNotFound'

interface AppRoutesProps{
  userId: string;
}

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))

const AppRoutes = ({userId}:AppRoutesProps) => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route path="/about" element={<About />} />
      <Route 
      path="/profile" 
      element={<ProtectedRoute><ProfilePage userId={userId} /></ProtectedRoute>} 
      />
      <Route path ="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default AppRoutes