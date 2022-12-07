import HomePage from "./pages/Home";
import SettingsPage from "./pages/Settings";

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import "./styles/tailwind.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
