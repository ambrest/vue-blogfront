import Vue       from 'vue';
import VueRouter from 'vue-router';
import App       from './vue/App.vue';
import config    from './config';
import store     from './vue/store/index';

// Custom plugins
import CallOnDestroy from './vue-extensions/plugins/CallOnDestroy';
Vue.use(CallOnDestroy);

// Import service worker
import './registerServiceWorker';

// Add utils to vue
import * as _ from './js/utils';
Vue.prototype.utils = _;

// Add config to vue
Vue.prototype.config = config;

// Routing
import Routes from './routes';
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
