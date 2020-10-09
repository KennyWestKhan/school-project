import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import sDocument from "../views/Document.vue";
import Login from "../views/Login.vue";
Vue.use(VueRouter);

const routes = [
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/About.vue"),
	},
	// {
	// 	path: "/login",
	// 	name: "Login",
	// 	// meta: {
	// 	// 	requiresVisitor: true,
	// 	// },
	// 	component: () =>
	// 		import(/* webpackChunkName: "rootInterface" */ "../views/Login.vue"),
	// },
	{
		path: "/login/",
		name: "Login",
		// meta: {
		// 	requiresAuth: true,
		// },
		component: Login,
	},
	{
		path: "/dashboard/:username",
		name: "Dashboard",
		// meta: {
		// 	requiresAuth: true,
		// },
		component: Dashboard,
	},
	{
		path: "/document/:id",
		name: "Document",
		// meta: {
		// 	requiresAuth: true,
		// },
		component: sDocument,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
