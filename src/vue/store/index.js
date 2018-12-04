import Vue  from 'vue';
import Vuex from 'vuex';

// Server-related nodes
import {posts} from './posts';

// Virtual modules act only as visual helpers / representation

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {posts},

    state: {},

    mutations: {}
});
