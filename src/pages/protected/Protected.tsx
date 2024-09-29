import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
interface ProtectedProps {
	Component: React.ComponentType; // This defines Component as a React component.
}
function Protected({ Component }: ProtectedProps) {
	const navigate = useNavigate();
	let login = !!Cookies.get("user_token");
	const location = useLocation();
	useEffect(() => {
		let login = !!Cookies.get("user_token");
		console.log("get user", login);

		if (!login) {
			navigate("/login");
		}
	}, []);

	return <>{login && location?.pathname !== "/login" ? <Component /> : null}</>;
}

export default Protected;