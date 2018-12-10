import {fetchGraphQL} from '../../../js/utils';
import config         from '../../../../config/config';

export const auth = {

    namespaced: true,

    state: {
        user: null,
        apikey: localStorage.getItem('apikey')
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
                             fullname
                         }
                     }
                 `,
                variables: {username, password}
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {apikey, id, email, fullname, permissions} = data.login;
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
                            username
                        }
                     }
                `,
                variables: {apikey}
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {id, email, fullname, username, permissions} = data.login;
                    state.apikey = apikey;
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
                             permissions
                         }
                     }
                `,
                variables: {email, username, fullname, password}
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {id, apikey, permissions} = data.register;
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
