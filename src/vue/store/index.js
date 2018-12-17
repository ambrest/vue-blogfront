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

    /**
     * Store modules.
     * auth - Authentication module, holds apikey and general user information.
     * posts - Stores and caches posts, also responsible for adding, deleting posts and comments.
     * users - Same as posts, also responsible for setting permissions and deactivating a user.
     */
    modules: {posts, auth, users},

    state: {

        // Amount of how many requests are currently active
        requestsActive: 0
    },

    mutations: {},

    actions: {

        /**
         * Centralized fetch proxy to show, when ever
         * a request is made, a loading screen. Moreover
         * to simplify and modify all requests at once.
         *
         * @param state
         * @param ops Operations, see queryBuilder.
         */
        async graphql({state}, ops) {

            // Increase active requests count
            state.requestsActive++;

            // Make graphql request
            return fetch(config.apiEndPoint, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },

                body: JSON.stringify(queryBuilder(ops))

                /* eslint-disable no-console */
            }).then(v => {
                state.requestsActive--;
                return v.json();
            }).catch(() => {
                state.requestsActive--;

                /**
                 *  The user seems like to not have a internet connection so return
                 *  the prepared no-etherent-connection error.
                 */
                return Promise.resolve({errors: [{message: 'Please go online to perform this action.'}], data: {}});
            });
        }
    }
});
