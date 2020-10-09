import Vue from "vue";
import Vuex from "vuex";
import { dataService } from "../shared";
import * as axios from "axios";

import {
	AUTH_SUCCESS,
	SAVE_TOKEN,
	AUTH_ERROR,
	LOGOUT,
	TOGGLE_SNACKBAR,
	SAVE_DOCS,
} from "./mutation-types";

Vue.use(Vuex);

const state = {
	token: localStorage.getItem("token"),
	status: "",
	user: {},
	snackbarInfo: {},
	scannedDocs: [
		{
			id: 1,
			extractedText:
				"justo sollicitudin ut suscipit a feugiat et eros vestibulum ac",
			title: "Duobam",
			extractedTextTitle: "Enterprise-wide uniform time-frame",
			docImage: "http://dummyimage.com/221x235.jpg/5fa2dd/ffffff",
		},
		{
			id: 2,
			extractedText:
				"non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse",
			title: "Hatity",
			extractedTextTitle: "Programmable directional forecast",
			docImage: "http://dummyimage.com/192x208.png/5fa2dd/ffffff",
		},
		{
			id: 3,
			extractedText:
				"metus aenean fermentum donec ut mauris eget massa tempor convallis nulla neque",
			title: "Sub-Ex",
			extractedTextTitle: "Streamlined fresh-thinking contingency",
			docImage: "http://dummyimage.com/127x103.png/cc0000/ffffff",
		},
		{
			id: 4,
			extractedText:
				"tempor convallis nulla neque libero convallis eget eleifend luctus ultricies",
			title: "Wrapsafe",
			extractedTextTitle: "Right-sized analyzing extranet",
			docImage: "http://dummyimage.com/218x232.bmp/ff4444/ffffff",
		},
		{
			id: 5,
			extractedText:
				"curae duis faucibus accumsan odio curabitur convallis duis consequat dui",
			title: "Redhold",
			extractedTextTitle: "Right-sized fresh-thinking hardware",
			docImage: "http://dummyimage.com/238x229.bmp/cc0000/ffffff",
		},
		{
			id: 6,
			extractedText:
				"mauris lacinia sapien quis libero nullam sit amet turpis elementum ligula vehicula",
			title: "Duobam",
			extractedTextTitle: "Front-line multi-state framework",
			docImage: "http://dummyimage.com/225x151.png/5fa2dd/ffffff",
		},
		{
			id: 7,
			extractedText:
				"odio condimentum id luctus nec molestie sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas tristique est",
			title: "Daltfresh",
			extractedTextTitle: "Future-proofed real-time forecast",
			docImage: "http://dummyimage.com/164x244.jpg/dddddd/000000",
		},
		{
			id: 8,
			extractedText:
				"elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est",
			title: "Stim",
			extractedTextTitle: "Robust uniform neural-net",
			docImage: "http://dummyimage.com/127x248.jpg/dddddd/000000",
		},
		{
			id: 9,
			extractedText:
				"eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus",
			title: "Matsoft",
			extractedTextTitle: "Streamlined demand-driven Graphic Interface",
			docImage: "http://dummyimage.com/165x236.png/cc0000/ffffff",
		},
		{
			id: 10,
			extractedText:
				"lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur in",
			title: "Toughjoyfax",
			extractedTextTitle: "Networked value-added customer loyalty",
			docImage: "http://dummyimage.com/151x102.jpg/ff4444/ffffff",
		},
	],
};
const mutations = {
	[AUTH_SUCCESS](state, payload) {
		state.message = payload.message;
		state.user = payload.user;
		state.tokenExpiry = payload.tokenExpiry;
	},
	[SAVE_TOKEN](state, payload) {
		state.token = payload.token;
		localStorage.setItem("token", payload.token);
	},
	[AUTH_ERROR](state, error_message) {
		state.status = error_message;
		localStorage.removeItem("token");
	},
	[LOGOUT](state) {
		state.token = state.user = state.tokenExpiry = null;
		localStorage.removeItem("token");
	},
	[TOGGLE_SNACKBAR](state, payload) {
		state.snackbarInfo = payload;
	},
	[SAVE_DOCS](state, docs) {
		state.scannedDocs = docs;
	},
};
const actions = {
	deleteDoc({ commit }, docId) {
		return new Promise((resolve) => {
			let docs = state.scannedDocs;
			console.log(docId);
			let res = false;
			let message = "Failed to delete";
			try {
				docs = docs.filter((item) => item.id !== docId);
				res = true;
				message = `${docId} deleted!`;
				commit(SAVE_DOCS, docs);
			} catch (error) {
				console.log(error);
			}
			let payload = { visibility: res, message: message };
			commit(TOGGLE_SNACKBAR, payload);
			resolve(payload);
		});
	},
	copyText({ commit }, textToCopy) {
		return new Promise((resolve, reject) => {
			let copied = false;
			let msg = "Failed to copy";
			const textarea = document.createElement("textarea");
			textarea.value = textToCopy;
			textarea.setAttribute("readonly", "");
			textarea.style.position = "absolute";
			textarea.style.left = "-9999px";
			document.body.appendChild(textarea);
			textarea.select();
			try {
				copied = document.execCommand("copy");
				msg = "Text copied";
				resolve(copied);
			} catch (err) {
				reject(err);
			}
			let payload = { visibility: copied, message: msg };
			commit(TOGGLE_SNACKBAR, payload);
		});
	},
	verifyAuthToken({ commit }) {
		return new Promise((resolve, reject) => {
			axios
				.get("/verifyAuth", {
					headers: {
						Authorization: state.token,
					},
				})
				.then((res, status) => {
					const parsedResponse = dataService.parseList(res, 200);
					const { token, userDetails, message, tokenExpiry } = parsedResponse;
					const payload = {
						message: message,
						token: token,
						user: userDetails,
						status: status,
						tokenExpiry: tokenExpiry,
					};
					let snackbarPayload = {
						visibility: true,
						message: res.message,
					};
					commit(TOGGLE_SNACKBAR, snackbarPayload);
					commit(AUTH_SUCCESS, payload);
					resolve(parsedResponse);
				})
				.catch((err) => {
					commit(LOGOUT);
					reject(err);
				});
		});
	},

	login({ commit }, user) {
		return new Promise((resolve, reject) => {
			axios
				.post("/login", user)
				.then((res) => {
					res = dataService.parseList(res, res.status);
					const payload = { token: res.token };
					commit(SAVE_TOKEN, payload);
					resolve(res.message);
				})
				.catch((err) => {
					const error = err.response.data.message;
					commit(AUTH_ERROR, error);
					reject(error);
				});
		});
	},
	logout({ commit }) {
		return new Promise((resolve, reject) => {
			try {
				commit(LOGOUT);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	},
};

const getters = {
	isLoggedIn: (state) => !!state.token,
	getLoggedInProfile: (state) => state.user,
	getSnackBarInfo: (state) => state.snackbarInfo,
	getScannedDocs: (state) => state.scannedDocs,
};

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
	modules: {},
});
