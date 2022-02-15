import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

const routes = [{
    name: "HomePage",
    path: "/",
    meta: {
        title: "Home Page"
    },
    component: () =>
        import ("@/views/Home")
}, {
    name: "LoginPage",
    path: "/login",
    meta: {
        title: "Login Page"
    },
    component: () =>
        import ("@/views/Login")
}, {
    name: "RegisterPage",
    path: "/register",
    meta: {
        title: "Register Page"
    },
    component: () =>
        import ("@/views/Register")
}]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

const DEFAULT_TITLE = "Crypto - Exchange";
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || DEFAULT_TITLE;
    const authRequiredRoutes = ["HomePage"];
    const authNotRequiredRoutes = ["LoginPage", "RegisterPage"];
    const _isAuthendicated = store.getters._isAuthendicated;

    if (authNotRequiredRoutes.indexOf(to.name) > -1 && _isAuthendicated) next(false);

    if (authRequiredRoutes.indexOf(to.name) > -1) {
        if (_isAuthendicated) next();
        else next({ name: "LoginPage" });
    } else {
        next();
    }

    next();
});


export default router;