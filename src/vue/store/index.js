import Vue  from 'vue';
import Vuex from 'vuex';

// Config
import config from '../../../config/config';

// Utils
import queryBuilder from '../../js/GraphQLQueryBuilder';

// Modules
import {posts} from './modules/posts';
import {auth}  from './modules/auth';
import {users} from './modules/users';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {posts, auth, users},

    state: {
        requestActive: false
    },

    actions: {

        async graphql({state}, ops) {
            state.requestActive = true;
            return fetch(config.apiEndPoint, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },

                body: JSON.stringify(queryBuilder(ops))

                /* eslint-disable no-console */
            }).then(v => {
                state.requestActive = false;
                return v.json();
            }).catch(console.error); // TODO: Server error message?
        }

    }
});
