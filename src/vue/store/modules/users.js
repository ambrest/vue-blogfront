export const users = {

    namespaced: true,

    state: [],

    actions: {

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

        async setPermission({rootState}, {user, type, permission}) {
            const {apikey} = rootState.auth;
            const {id} = user;

            if (type === 'add') {
                user.permissions.push(permission);
            } else if (type === 'remove') {
                const idx = user.permissions.indexOf(permission);
                ~idx && user.permissions.splice(idx, 1);
            } else {
                return Promise.reject();
            }

            const {permissions} = user;
            return this.dispatch('graphql', {
                operation: 'getAllUsers',
                vars: {apikey, permissions, id},
                fields: ['id']
            }).then(({errors}) => {
                if (errors && errors.length) {
                    // TODO: Log?
                } else {
                    return this.dispatch('users/update');
                }
            });
        },

        async setDeactivated({rootState}, {user, deactivated}) {
            const {apikey} = rootState.auth;
            const {id} = user;

            return this.dispatch('graphql', {
                operation: 'getAllUsers',
                vars: {apikey, deactivated, id},
                fields: ['id']
            }).then(({errors}) => {

                if (errors && errors.length) {
                    // TODO: Log?
                } else {
                    return this.dispatch('users/update');
                }

            });
        }
    }

};
