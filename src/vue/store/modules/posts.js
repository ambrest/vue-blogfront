import config from '../../../config';
import faker  from 'faker';

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
        },

        async newPost({state, rootState}, {title, body}) {
            const {apikey} = rootState.auth;

            return fetch(config.apiEndPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                       query Post($apikey: String!, $title: String!, $body: String!) {
                           post(apikey: $apikey, title: $title, body: $body) {
                               id,
                               timestamp,
                               error,
                               errorMessage
                           }
                       }
                    `,
                    variables: {title, body, apikey}
                })
            }).then(v => v.json()).catch(v => v.json()).then(v => {
                const {error, errorMessage, id, timestamp} = v.data.post;

                if (error) {
                    return Promise.reject(errorMessage);
                } else {
                    state.splice(0, 0, {
                        id,
                        timestamp,
                        title,
                        body,
                        author: {
                            ...state.rootState.auth.user
                        }
                    });
                }
            });
        }
    },

    async addComment({state, rootState}, {postid, body}) {
        const {apikey} = rootState.auth;
        // TODO: Integrate
    }
};
