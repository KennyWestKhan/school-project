import store from "../store";
async function authenticateRoute(to, from, next) {
	const loginRedirectObj = {
		name: "Login", // back to safety route //
		query: { redirectFrom: to.fullPath, message: "Authorized access" },
	};
	try {
		const hasPermission = await store.dispatch("verifyAuthToken");
		// console.log(hasPermission);
		if (
			!hasPermission.isAuthenticated ||
			to.params.username !== hasPermission.userDetails.username
		) {
			// console.log("going to next route");
			next();
		} else {
			next();
		}
	} catch (e) {
		console.log(e);
		next(loginRedirectObj);
	}
}

async function loginRouteCheck(to, from, next) {
	try {
		if (localStorage.getItem("token")) {
			let hasPermission = await store.dispatch("verifyAuthToken");
			if (hasPermission.isAuthenticated) {
				next({ path: "/dashboard/" + hasPermission.userDetails.username });
			} else next(false);
		} else next();
	} catch (e) {
		next(false);
	}
}

export default {
	loginRouteCheck,
	authenticateRoute,
};
