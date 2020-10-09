import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const opts = {
	theme: {
		dark: false,
	},
	icons: {
		iconfont: "md" || "fa",
	},
};
export default new Vuetify(opts);
