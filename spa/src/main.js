import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store"
import { appAxios } from '@/utils/appAxios';
import Toaster from "@meforma/vue-toaster";


import appHeader from './components/AppHeader';



const app = createApp(App);
app.use(router);
app.use(store);
app.use(Toaster);


app.component("appHeader", appHeader);




app.config.globalProperties.$appAxios = appAxios;
app.mount("#app");