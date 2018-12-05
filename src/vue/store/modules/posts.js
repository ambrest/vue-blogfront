// TODO: Remove faker
import faker from 'faker';

export const posts = {

    namespaced: true,

    state: [],

    actions: {

        update({state}) {

            // TODO: Use apollo
            const fakePosts = [];
            for (let i = 0; i < 20; i++) {
                fakePosts.push({
                    postid: Math.floor(Math.random() * 100000),
                    title: faker.lorem.sentence(),
                    timestamp: Math.random() * Date.now(),
                    body: faker.lorem.paragraphs().repeat(Math.floor(Math.random() * 20) + 1),
                    author: {
                        username: faker.internet.userName(),
                        fullname: faker.name.findName()
                    }
                });
            }

            state.splice(0, state.length, ...fakePosts);
        }

    }

};
