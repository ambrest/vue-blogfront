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
                    permissions: ['admin', 'comment', 'post'],
                    email: faker.internet.email()
                });
            }

            state.splice(0, state.length, ...fakeUsers);

            return new Promise(resolve => {
                setTimeout(resolve, 3000)
            })
        },

        async addPermission({state}, {user, permission}) {

            // TODO: Use apollo
            !user.permissions.includes(permission) && user.permissions.push(permission);
        },

        async removePermission({state}, {user, permission}) {

            // TODO: Use apollo
            const idx = user.permissions.indexOf(permission);
            ~idx && user.permissions.splice(idx, 1);
        }

    }

};
