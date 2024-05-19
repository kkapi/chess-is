import { ThemeProvider } from '@/components/ThemeProvider';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import ComputerGamePage from './pages/ComputerGamePage';
import CreateGamePage from './pages/CreateGamePage';
import FindGamePage from './pages/FindGamePage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/analysis',
		element: <AnalysisPage />,
	},
	{
		path: '/computer',
		element: <ComputerGamePage />,
	},
	{
		path: '/create',
		element: <CreateGamePage />,
	},
	{
		path: '/find',
		element: <FindGamePage />,
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
