export const users = {

    namespaced: true,

    state: [],

    actions: {

        async update({state}) {

        },

        async setPermissions({state}, {user, add = [], remove = []}) {

            // TODO: Use apollo
            add.forEach(v => {
                v && !user.permissions.includes(v) && user.permissions.push(v);
            });

            remove.forEach(v => {
                const idx = user.permissions.indexOf(v);
                ~idx && user.permissions.splice(idx, 1);
            });
        },

        async setDisabled({state}, {user, disabled}) {

            // TODO: Use apollo
            user.disabled = disabled;
        }
    }

};
