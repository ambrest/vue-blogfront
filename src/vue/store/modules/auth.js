import config from '../../../config';

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
        },

        async login({state}, {username, password}) {
            return fetch(config.apiEndPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                       query Login($username: String!, $password: String!) {
                           login(username: $username, password: $password) {
                               apikey,
                               email,
                               id,
                               fullname,
                               error,
                               errorMessage
                           }
                       }
                    `,
                    variables: {username, password}
                })
            }).then(v => v.json()).catch(v => v.json()).then(v => {
                const {error, errorMessage, apikey, id, email, fullname} = v.data.login;

                if (error) {
                    return Promise.reject(errorMessage);
                } else {
                    state.apikey = apikey;
                    state.user = {
                        email,
                        id,
                        username,
                        fullname
                    };
                }
            });
        },

        async register({state}, {email, username, fullname, password}) {
            return fetch(config.apiEndPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                       query Register($username: String!, $email: String!, $fullname: String!, $password: String!) {
                           register(username: $username, email: $email, fullname: $fullname, password: $password) {
                               apikey,
                               id,
                               error,
                               errorMessage
                           }
                       }
                    `,
                    variables: {email, username, fullname, password}
                })
            }).then(v => v.json()).catch(v => v.json()).then(v => {
                const {error, errorMessage, id, apikey} = v.data.register;

                if (error) {
                    return Promise.reject(errorMessage);
                } else {
                    state.apikey = apikey;
                    state.user = {
                        email,
                        id,
                        username,
                        fullname
                    };
                }
            });
        }

    }

};
