import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import titleMixin from "./mixins/titleMixin";
import axios from "axios";
import { API } from "../src/shared";

axios.defaults.baseURL = API;

// router.beforeEach((to, from, next) => {
// 	if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (!store.getters.isLoggedIn){
//       next({
//         path: '/login'
//       });
//     }
// 	}
// });

Vue.mixin(titleMixin);
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount("#app");
