export const auth = {

    namespaced: true,

    /**
     * Holds user and a apikey which is used as sessionkey
     */
    state: {
        user: null,
        apikey: null
    },

    actions: {

        /**
         * Reset's the module state and removes
         * the sessionkey from localStorage
         */
        async logout({state}) {
            state.user = null;
            state.apikey = null;

            // Clear cache
            localStorage.clear();
        },

        /**
         * Basic login, receives an api-key and general
         * user informations such as email, id etc. and saves
         * these to the module state.
         *
         * @param state
         * @param username Username (email is currently as alternative not available)
         * @param password Password
         */
        async login({state}, {username, password}) {
            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'login',
                    vars: {username, password},
                    fields: ['apikey', 'email', 'permissions', 'id', 'fullname']
                }
            }).then(({errors, data}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
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

                    // Save apikey and return loaded user
                    localStorage.setItem('apikey', apikey);
                    return state.user;
                }
            });
        },

        /**
         * Login via exising apikey
         *
         * @param state
         * @param apikey
         */
        async key({state}, {apikey}) {

            // Apply api if other request are getting feed forward
            state.apikey = apikey;

            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'login',
                    vars: {apikey},
                    fields: ['email', 'permissions', 'id', 'fullname', 'username']
                }
            }).then(({errors, data}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {

                    // Invalid apikey, logout
                    this.dispatch('auth/logout');
                    throw errors[0].message;
                } else {

                    // Save to current state
                    const {id, email, fullname, username, permissions} = data.login;
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

        /**
         * Registers an new user
         *
         * @param state
         * @param email E-Mail Address
         * @param username Username, need to be unique
         * @param fullname Fullname
         * @param password Password
         */
        async register(_, {email, username, fullname, password}) {
            return this.dispatch('graphql', {
                query: {
                    operation: 'register',
                    vars: {email, username, fullname, password},
                    fields: ['id', 'permissions']
                }
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                }
            });
        },

        /**
         * Updates the credentials of the currently
         * logged in user.
         *
         * @param state
         * @param email New E-Mail
         * @param fullname New Fullname
         * @param password New Password
         */
        async updateCredentials({state}, {email, fullname, password}) {
            return this.dispatch('graphql', {
                query: {
                    operation: 'updateUser',
                    vars: {
                        email, fullname, password,
                        id: state.user.id,
                        apikey: state.apikey
                    },
                    fields: ['email', 'fullname', 'permissions']
                }
            }).then(({errors, data}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    // Update changes in current state
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
        },

        /**
         * Requests an E-Mail to reset the password
         *
         * @param email E-Mail address
         */
        async resetPassword(_, {email}) {
            return this.dispatch('graphql', {
                query: {
                    operation: 'recoverPassword',
                    vars: {email}
                }
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                }
            });
        }
    }
};
