export const users = {

    namespaced: true,

    state: [],

    actions: {

        /**
         * Loads all currently exising users
         * into the current store module
         */
        async update({state, rootState}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'getAllUsers',
                vars: {apikey},
                fields: ['id', 'username', 'fullname', 'permissions', 'deactivated', 'email']
            }).then(({errors, data: {getAllUsers}}) => {

                if (errors && errors.length) {
                    throw errors[0].message;
                } else if (Array.isArray(getAllUsers)) {
                    state.splice(0, state.length, ...getAllUsers);
                }

            });
        },

        /**
         * Updates the permissions of a specific user
         *
         * @param user User object
         * @param type Type, can be 'add' or 'remove'
         * @param permission Permission which should be added or removed from this user
         */
        async setPermission({rootState}, {user, type, permission}) {
            const {apikey} = rootState.auth;
            const {id} = user;

            const editArray = (type, array, item) => {
                if (type === 'add') {
                    array.push(item);
                } else if (type === 'remove') {
                    const idx = array.indexOf(item);
                    ~idx && array.splice(idx, 1);
                }
                return array;
            };

            return this.dispatch('graphql', {
                operation: 'updateUser',
                vars: {
                    apikey, id,
                    permissions: editArray(type, [...user.permissions], permission)
                },
                types: {permissions: 'String'},
                fields: ['id']
            }).then(({errors}) => {

                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    /**
                     * Request was successful, update user locally to
                     * prevent unnecessary api calls.
                     */
                    user.permissions = editArray(type, [...user.permissions], permission);
                    return Promise.resolve();
                }

            });
        },

        /**
         * Deactivates or re-activates a user.
         *
         * @param user User object
         * @param deactivated Deactivation state
         */
        async setDeactivated({rootState}, {user, deactivated}) {
            const {apikey} = rootState.auth;
            const {id} = user;

            return this.dispatch('graphql', {
                operation: 'updateUser',
                vars: {apikey, deactivated, id},
                fields: ['id']
            }).then(({errors}) => {

                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    /**
                     * Request was successful, update user locally to
                     * prevent unnecessary api calls.
                     */
                    user.deactivated = deactivated;
                    return Promise.resolve();
                }

            });
        }
    }
};