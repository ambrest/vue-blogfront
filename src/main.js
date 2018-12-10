import Vue    from 'vue';
import App    from './vue/App.vue';
import store  from './vue/store/index';
import router from './router/index';
import * as _ from './js/utils';
import config from '../config/config';
import './vue-extensions/filter';
import './registerServiceWorker';

Vue.prototype.utils = _;
Vue.prototype.config = config;

// Entry point
new Vue({
    render: h => h(App),
    store, router
}).$mount('#app');
