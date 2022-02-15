import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import user from "../../../models/user";
var ls = new SecureLS({ isCompression: false });

export default createStore({
    state: {
        user: null,
        saltKey: "*********************"
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        logoutUser(state) {
            state.user = null
        }
    },

    getters: {
        _isAuthendicated: state => state.user != null,
        _getCurrentUser(state) {
            const user = state.user;
            delete user ? .password;
            /*if(user!=null && user.hasOwnProperty("password"){
                delete user.password;
            }*/
            return user;
        },
        _saltKey: state => state.saltKey
    },
    plugins: [createPersistedState({
        key: "user",
        storage: {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key),
        },
    }), ],

});