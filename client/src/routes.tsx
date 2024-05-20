import { ANALYSIS_ROUTE, COMPUTER_ROUTE, CREATENEWS_ROUTE, FINDGAME_ROUTE, HOME_ROUTE, LOGIN_ROUTE, MATERIALS_ROUTE, NEWROOM_ROUTE, NEWS_ROUTE, NEW_PASSWORD_ROUTE, ONE_NEWS_ROUTE, PROFILE_ROUTE, RECOVERY_ROUTE, REGISTRATION_ROUTE, USERS_ROUTE } from "./lib/constants"
import AnalysisPage from "./pages/AnalysisPage"
import ComputerGamePage from "./pages/ComputerGamePage"
import CreateNewsPage from "./pages/CreateNewsPage"
import CreateRoomPage from "./pages/CreateRoomPage"
import FindGamePage from "./pages/FindGamePage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import MaterialsPage from "./pages/MaterialsPage"
import NewPasswordPage from "./pages/NewPasswordPage"
import NewsPage from "./pages/NewsPage"
import OneNewsPage from "./pages/OneNewsPage"
import ProfilePage from "./pages/ProfilePage"
import RecoveryPage from "./pages/RecoveryPage"
import RegistrationPage from "./pages/RegistrationPage"

export const routes = [
  {
		path: HOME_ROUTE,
		element: <HomePage />,
	},
	{
    path: LOGIN_ROUTE,
    element: <LoginPage />,
  },
	{
    path: REGISTRATION_ROUTE,
    element: <RegistrationPage />,
  },
	{
    path: RECOVERY_ROUTE,
    element: <RecoveryPage />,
  },
	{
    path: NEW_PASSWORD_ROUTE,
    element: <NewPasswordPage />,
  },
	{
    path: FINDGAME_ROUTE,
    element: <FindGamePage />,
  },
	{
    path: NEWROOM_ROUTE,
    element: <CreateRoomPage />,
  },
	{
    path: COMPUTER_ROUTE,
    element: <ComputerGamePage />,
  },
	{
    path: ANALYSIS_ROUTE,
    element: <AnalysisPage />,
  },
	{
    path: NEWS_ROUTE,
    element: <NewsPage />,
  },
  {
    path: ONE_NEWS_ROUTE,
    element: <OneNewsPage />,
  },
  {
    path: MATERIALS_ROUTE,
    element: <MaterialsPage />,
  },
  {
    path: PROFILE_ROUTE,
    element: <ProfilePage />,
  },
  {
    path: CREATENEWS_ROUTE,
    element: <CreateNewsPage />,
  },
]