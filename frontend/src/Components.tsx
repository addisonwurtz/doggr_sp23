import { useEffect, useState } from "react";
import axios from "axios";
export const Header = () => {


	return (
		<div>
			<h1>Doggr</h1>
			<h3>Where your pets find love(tm)</h3>
			<br />
		</div>
	);
};



// 1) Make a place to store the users list result
// 2) Make the actual request to backend and store result
// 3) Show the list of users formatted nicely in our webpage

/*
 ** Hooks—functions starting with `use`—can only be called at the top level of your components
 * or [your own Hooks.](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks)**
 * You can’t call Hooks inside conditions, loops, or other nested functions. Hooks are functions,
 * but it’s helpful to think of them as unconditional declarations about your component’s needs.
 * You “use” React features at the top of your component similar to how you “import” modules
 * at the top of your file.
 */
export const Button = () => {
	const [clicks, setClicks] = useState(0);
	const [users, setUsers] = useState([]);

	useEffect( () => {

		const getUsers = async () => {
			const usersRes = await axios.get("https://localhost:8080/users");
			setUsers(usersRes.data);
		};

		getUsers();
	}, []);


	return (
		<button
			onClick={() => {
				console.log("Clicked!");
				setClicks(clicks + 1);
			}}
		>
			Clicks: {clicks}
		</button>
	);
};


