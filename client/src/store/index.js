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
	SAVE_SPEECH_DETS,
	SAVE_USER_SETTINGS,
	SAVE_DOC_INFO,
} from "./mutation-types";

Vue.use(Vuex);

const state = {
	token: localStorage.getItem("token"),
	status: "",
	user: {},
	snackbarInfo: {},
	speechDetail: {
		rate: 1,
		pitch: 1,
		voice: 2,
		volume: 13,
		selectedExtractingLang: "eng",
	},
	userSettings: {},
	scannedDocs: [],
};
const mutations = {
	[AUTH_SUCCESS](state, payload) {
		state.message = payload.message;
		state.user = payload.user;
		state.tokenExpiry = payload.tokenExpiry;
		state.token = payload.token;
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
	[SAVE_SPEECH_DETS](state, speechInfo) {
		const { rate, pitch, voice, volume, selectedExtractingLang } = speechInfo;
		state.speechDetail.rate = rate;
		state.speechDetail.pitch = pitch;
		state.speechDetail.voice = voice;
		state.speechDetail.volume = volume;
		state.speechDetail.selectedExtractingLang = selectedExtractingLang;
	},
	[SAVE_USER_SETTINGS](state, speechInfo) {
		// console.log(speechInfo);
		state.userSettings = speechInfo;
		// const { rate, pitch, voice } = speechInfo;
		// state.speechDetail.rate = rate;
		// state.speechDetail.pitch = pitch;
		// state.speechDetail.voice = voice;
	},
	[SAVE_DOC_INFO](state, doc) {
		state.doc = doc;
	},
};
const actions = {
	getUserDocs({ commit }) {
		return new Promise((resolve, reject) => {
			axios
				.get("/documents", {
					headers: {
						Authorization: state.token,
					},
				})
				.then((res) => {
					const parsedResponse = dataService.parseList(res, 200);
					const { documents } = parsedResponse;
					let snackbarPayload = {
						visibility: true,
						message: res.message,
					};
					commit(TOGGLE_SNACKBAR, snackbarPayload);
					commit(SAVE_DOCS, documents);
					resolve(documents);
				})
				.catch((err) => {
					console.log(err);
					reject();
				});
		});
	},
	search({ commit }, searchQuery) {
		return new Promise((resolve, reject) => {
			axios
				.get("/search/" + searchQuery, {
					headers: {
						Authorization: state.token,
					},
				})
				.then((res) => {
					const parsedResponse = dataService.parseList(res, 200);
					const { documentDetails } = parsedResponse;
					commit(SAVE_DOC_INFO, documentDetails);
					resolve(documentDetails);
				})
				.catch((err) => {
					console.log(err);
					reject();
				});
		});
	},
	getDocumentDetails({ commit }, docId) {
		return new Promise((resolve, reject) => {
			axios
				.get("/document/" + docId, {
					headers: {
						Authorization: state.token,
					},
				})
				.then((res) => {
					const parsedResponse = dataService.parseList(res, 200);
					const { documentDetails } = parsedResponse;
					let snackbarPayload = {
						visibility: true,
						message: res.message,
					};
					// console.log(documentDetails);
					commit(TOGGLE_SNACKBAR, snackbarPayload);
					commit(SAVE_DOC_INFO, documentDetails);
					resolve(documentDetails);
				})
				.catch((err) => {
					console.log(err);
					reject();
				});
		});
	},
	getUserSettings({ commit }) {
		return new Promise((resolve, reject) => {
			axios
				.get("/userSettings", {
					headers: {
						Authorization: state.token,
					},
				})
				.then((response) => {
					const parsedResponse = dataService.parseList(response, 200);
					const userSettings = parsedResponse.settings;

					commit(SAVE_USER_SETTINGS, userSettings);
					resolve(userSettings);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},
	saveUserSettings({ commit }, settings) {
		return new Promise((resolve, reject) => {
			axios
				.post("/userSettings", settings, {
					headers: {
						Authorization: state.token,
					},
				})
				.then((response) => {
					commit(SAVE_SPEECH_DETS, settings);
					resolve(response);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},
	async deleteDoc({ commit }, docId) {
		return new Promise((resolve, reject) => {
			console.log("docId ", docId);
			if (!docId) {
				reject("No valid document id");
			}
			let docs = state.scannedDocs;
			let response = null;
			let message = "Failed to delete";
			let payload = { color: "red", visibility: true, message: message };
			response = axios.delete("/document/" + docId, {
				headers: {
					Authorization: state.token,
				},
			});
			response
				.then((res) => {
					res = dataService.parseList(res, res.status);
					docs = docs.filter((item) => item._id !== docId);
					message = `${docId} deleted!`;
					commit(SAVE_DOCS, docs);
					message = res.message;
					payload.color = "green";
					payload.visibility = true;
					payload.message = message;
					commit(TOGGLE_SNACKBAR, payload);
					commit(SAVE_DOCS, docs);
					resolve(payload);
				})
				.catch((err) => {
					const errMsg = err.response.data.message;
					payload.message = errMsg;
					commit(TOGGLE_SNACKBAR, payload);
					commit(AUTH_ERROR, errMsg);
					reject(errMsg);
				});
			// } else {
			// 	reject("No document id supplied");
			// }
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
					const tokenPayload = { token: token };
					commit(SAVE_TOKEN, tokenPayload);
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
	register({ commit }, user) {
		return new Promise((resolve, reject) => {
			axios
				.post("/register", user)
				.then((res) => {
					res = dataService.parseList(res, res.status);
					const payload = { token: res.token };
					commit(SAVE_TOKEN, payload);
					resolve(res.message);
					// console.log(res);
				})
				.catch((err) => {
					let error = "Something went wrong. Please contact admin";
					let adminError = "";
					if (err.response) {
						error = err.response.data.message;
						adminError = err;
					} else if (err.request) {
						adminError = err.request;
					} else {
						adminError = err.request;
					}
					reject(error);
					commit(AUTH_ERROR, adminError);
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
					console.log(res);
				})
				.catch((err) => {
					let error = "Something went wrong. Please contact admin";
					let adminError = "";
					if (err.response) {
						error = err.response.data.message;
						adminError = err;
					} else if (err.request) {
						adminError = err.request;
					} else {
						adminError = err.request;
					}
					reject(error);
					commit(AUTH_ERROR, adminError);
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
	getSpeechDetail: () => state.speechDetail,
	getUserSettings: () => state.userSettings,
	getExtractingLang: () => state.userSettings.speechDetail.extractingLang,
	getFileDetails: () => state.doc.fileId
};

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
	modules: {},
});
