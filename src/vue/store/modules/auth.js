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
            return this.dispatch('graphql', {
                operation: 'login',
                vars: {username, password},
                fields: ['apikey', 'email', 'permissions', 'id', 'fullname']
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
                    return state.user;
                }
            });
        },

        async key({state}, {apikey}) {
            return this.dispatch('graphql', {
                operation: 'login',
                vars: {apikey},
                fields: ['email', 'permissions', 'id', 'fullname', 'username']
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    this.dispatch('auth/logout');
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

                    return state.user;
                }
            });
        },

        async register({state}, {email, username, fullname, password}) {
            return this.dispatch('graphql', {
                operation: 'register',
                vars: {email, username, fullname, password},
                fields: ['apikey', 'id', 'permissions']
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
                    return state.user;
                }
            });
        },

        async updateCredentials({state}, {email, fullname, password}) {
            return this.dispatch('graphql', {
                operation: 'updateUser',
                vars: {
                    email, fullname, password,
                    id: state.user.id,
                    apikey: state.apikey
                },
                fields: ['email', 'fullname', 'permissions']
            }).then(({errors, data}) => {
                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {email, fullname, permissions} = data.updateUser;
                    state.user = {
                        ...state.user,
                        email,
                        fullname,
                        permissions
                    };

                    return state.user;
                }
            });
        }
    }

};
