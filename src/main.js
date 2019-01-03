import Vue    from 'vue';
import App    from './vue/App.vue';
import store  from './store/index';
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

// Set Meta tags
_.setMetaTags([
    {name: 'theme-color', content: config.themeColor},
    {name: 'msapplication-navbutton-color', content: config.themeColor},
    {name: 'apple-mobile-web-app-status-bar-style', content: config.themeColor}
]);
