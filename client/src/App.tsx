import { ThemeProvider } from '@/components/ThemeProvider';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { useContext, useEffect } from 'react';
import { Context } from './main';

const router = createBrowserRouter([...routes]);

function App() {
	const { store } = useContext(Context);
	useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

export default App;
