// TODO: Remove faker
import faker from 'faker';

export const users = {

    namespaced: true,

    state: [],

    actions: {

        async update({state}) {

            // TODO: Use apollo
            const fakeUsers = [];
            for (let i = 0; i < 150; i++) {
                fakeUsers.push({
                    userid: Math.floor(Math.random() * 100000),
                    username: faker.internet.userName(),
                    fullname: faker.name.findName(),
                    disabled: Math.random() < 0.2,
                    permissions: ['admin', 'comment', 'post'],
                    email: faker.internet.email()
                });
            }

            state.splice(0, state.length, ...fakeUsers);
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

        async setDisabled({state}, {user, disabled}){

            // TODO: Use apollo
            user.disabled = disabled;
        }
    }

};
