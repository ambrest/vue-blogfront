// TODO: Remove faker
import faker from 'faker';

export const users = {

    namespaced: true,

    state: [],

    actions: {

        update({state}) {

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
        },

        addPermission({state}, {user, permission}) {

            // TODO: Use apollo
            !user.permissions.includes(permission) && user.permissions.push(permission);
        },

        removePermission({state}, {user, permission}) {

            // TODO: Use apollo
            const idx = user.permissions.indexOf(permission);
            ~idx && user.permissions.splice(idx, 1);
        }

    }

};
