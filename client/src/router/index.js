import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
// import sDocument from "../views/Document.vue";
import middlewareLogic from "../middleWare";
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
	{
		path: "/",
		redirect: {
			name: "Login",
		},
	},
	{
		path: "/login",
		name: "Login",
		// meta: {
		// 	requiresVisitor: true,
		// },
		component: () =>
			import(/* webpackChunkName: "rootInterface" */ "../views/Login.vue"),
		beforeEnter: middlewareLogic.loginRouteCheck,
	},

	{
		path: "/dashboard",
		redirect: {
			name: "Login",
		},
	},
	{
		path: "/dashboard/:username",
		name: "Dashboard",
		component: Dashboard,
		beforeEnter: middlewareLogic.authenticateRoute,
	},
	{
		path: "/document/:id",
		name: "Document",
		component: () =>
			import(/* webpackChunkName: "docInterface" */ "../views/Document.vue"),
		beforeEnter: middlewareLogic.authenticateRoute,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
