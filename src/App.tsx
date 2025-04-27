import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { Provider } from 'react-redux'
import { store } from '././store/index'
import './index.scss'
import { AuthProvider } from './contexts/AuthContext'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from './fireBase'
import { ThemeProvider } from './contexts/ThemeProvider/ThemeProvider'

const App = () => {
  const [id, setId] = useState<string>('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid);
        setId(user.uid);
      } else {
        console.log("User is not authenticated");
      }
    });
    return unsubscribe;
  }, []);
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <div className='app'>
            <BrowserRouter>
              <AppRoutes userId={id} />
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App