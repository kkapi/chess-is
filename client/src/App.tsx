import { ThemeProvider } from '@/components/ThemeProvider';
import DefaultLayout from './layouts/DefaultLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
]);

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

export default App;
