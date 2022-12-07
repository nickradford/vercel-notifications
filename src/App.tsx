import { useState } from "react";

import HomePage from "./pages/Home";

import "./styles/tailwind.css";

function App() {
	const [count, setCount] = useState(0);

	return <HomePage />;
}

export default App;
