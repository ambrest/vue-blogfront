import Vue  from 'vue';
import Vuex from 'vuex';

// Modules
import {posts} from './modules/posts';
import {auth}  from './modules/auth';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {posts, auth},

    state: {},

    mutations: {}
});
