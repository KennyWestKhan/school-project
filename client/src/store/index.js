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
	scannedDocs: [],
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
					let error = err;
					err = err.response ? err.response.data.message : err;
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
	hasDocs: (state) => state.scannedDocs.length > 0,
};

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
	modules: {},
});
