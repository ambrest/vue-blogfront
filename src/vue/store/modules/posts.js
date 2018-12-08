// TODO: Remove faker
import faker from 'faker';

export const posts = {

    namespaced: true,

    state: [],

    actions: {

        async update({state}) {

            // TODO: Use apollo
            const fakePosts = [];
            for (let i = 0; i < 20; i++) {
                fakePosts.push({
                    id: String(Math.floor(Math.random() * 100000)),
                    title: faker.lorem.sentence(),
                    timestamp: Math.random() * Date.now(),
                    body: faker.lorem.paragraphs().repeat(Math.floor(Math.random() * 20) + 1),
                    author: {
                        userid: String(Math.floor(Math.random() * 100000)),
                        username: faker.internet.userName(),
                        fullname: faker.name.findName()
                    }
                });
            }

            state.splice(0, state.length, ...fakePosts);
        }

    }

};
