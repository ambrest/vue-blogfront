import {fetchGraphQL} from '../../../js/utils';
import config         from '../../../config';

export const auth = {

    namespaced: true,

    state: {
        user: null,
        apikey: null
    },

    actions: {

        async logout({state}) {
            state.user = null;
            state.apikey = null;

            // Clear session
            localStorage.removeItem('apikey');
        },

        async login({state}, {username, password}) {
            return fetchGraphQL(config.apiEndPoint, {
                query: `
                       query Login($username: String!, $password: String!) {
                           login(username: $username, password: $password) {
                               apikey,
                               email,
                               permissions,
                               id,
                               fullname,
                               error,
                               errorMessage
                           }
                       }
                    `,
                variables: {username, password}
            }).then(({data}) => {
                const {error, errorMessage, apikey, id, email, fullname, permissions} = data.login;

                if (error) {
                    return Promise.reject(errorMessage);
                } else {
                    state.apikey = apikey;
                    state.user = {
                        email,
                        id,
                        permissions,
                        username,
                        fullname
                    };

                    // Save api-key
                    localStorage.setItem('apikey', apikey);
                }
            });
        },

        async key({state, rootState}, {apikey}) {
            return fetchGraphQL(config.apiEndPoint, {
                query: `
                       query Login($apikey: String!) {
                           login(apikey: $apikey) {
                               email,
                               permissions,
                               id,
                               fullname,
                               username,
                               error,
                               errorMessage
                           }
                       }
                    `,
                variables: {apikey}
            }).then(({data}) => {
                const {error, errorMessage, id, email, fullname, username, permissions} = data.login;

                if (error) {
                    return Promise.reject(errorMessage);
                } else {
                    state.user = {
                        email,
                        id,
                        permissions,
                        username,
                        fullname
                    };
                }
            });
        },

        async register({state}, {email, username, fullname, password}) {
            return fetchGraphQL(config.apiEndPoint, {
                query: `
                       query Register($username: String!, $email: String!, $fullname: String!, $password: String!) {
                           register(username: $username, email: $email, fullname: $fullname, password: $password) {
                               apikey,
                               id,
                               permissions,
                               error,
                               errorMessage
                           }
                       }
                    `,
                variables: {email, username, fullname, password}
            }).then(({data}) => {
                const {error, errorMessage, id, apikey, permissions} = data.register;

                if (error) {
                    return Promise.reject(errorMessage);
                } else {
                    state.apikey = apikey;
                    state.user = {
                        email,
                        id,
                        permissions,
                        username,
                        fullname
                    };

                    // Save api-key
                    localStorage.setItem('apikey', apikey);
                }
            });
        }
    }

};
