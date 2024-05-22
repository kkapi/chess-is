import { ThemeProvider } from '@/components/ThemeProvider';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { useContext, useEffect, useState } from 'react';
import { Context } from './main';
import socket from './socket/socket';
import axios from 'axios';
import { API_URL } from './http';

const router = createBrowserRouter([...routes]);

function App() {
	const { store } = useContext(Context);
  const [loading, setLoading] = useState(true);

	useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/refresh`, {
          withCredentials: true,
        });
  
        const { user, accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        store.user = user;
        store.isAuth = true;
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();    

    socket.on('connect', () => {
      console.log('ПОДКЛЮЧЕНИЕ УСТАНОВЛЕНО')
    })
  }, []);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {loading ? <div></div> : <RouterProvider router={router} />}
			
		</ThemeProvider>
	);
}

export default App;
