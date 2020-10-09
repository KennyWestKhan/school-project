const parseList = (response, code) => {
	if (response.status !== code) throw Error(response.message);
	if (!response.data) return [];
	let list = response.data;
	if (typeof list !== "object") {
		list = [];
	}
	return list;
};

function authHeader() {
	let user = JSON.parse(localStorage.getItem("user"));

	if (user && user.accessToken) {
		return { Authorization: "Bearer " + user.accessToken };
	} else {
		return {};
	}
}

const parseItem = (response, code) => {
	if (response.status !== code) throw Error(response.message);
	let item = response;
	if (typeof item !== "object") {
		item = undefined;
	}
	return item;
};

export const dataService = {
	parseList,
	parseItem,
	authHeader,
};
