import Vue       from 'vue';
import VueRouter from 'vue-router';
import App       from './vue/App.vue';
import store     from './vue/store/index';
import * as _    from './js/utils';
import config    from '../config/config';
import Routes    from './routes';
import './vue-extensions/filter';
import './registerServiceWorker';

Vue.prototype.utils = _;
Vue.prototype.config = config;
Vue.use(VueRouter);

// Entry point
new Vue({
    render: h => h(App),
    store,
    router: new VueRouter({
        routes: Routes,
        mode: 'history'
    })
}).$mount('#app');
