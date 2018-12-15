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
                    // TODO: Log?
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
            const {id, permissions} = user;

            if (type === 'add') {
                permissions.push(permission);
            } else if (type === 'remove') {
                const idx = permissions.indexOf(permission);
                ~idx && permissions.splice(idx, 1);
            } else {
                return Promise.reject();
            }

            return this.dispatch('graphql', {
                operation: 'updateUser',
                vars: {apikey, permissions, id},
                types: {permissions: 'String'},
                fields: ['id']
            }).then(({errors}) => {
                if (errors && errors.length) {
                    // TODO: Log?
                } else {
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
                    // TODO: Log?
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
