import {fetchGraphQL} from '../../../js/utils';
import config         from '../../../config';

export const posts = {

    namespaced: true,

    state: [],

    actions: {

        async update({state}) {
            return fetchGraphQL(config.apiEndPoint, {
                query: `
                       query {
                           getAllPosts {
                               title,
                               body,
                               timestamp,
                               user {
                                   id,
                                   username,
                                   fullname                                 
                               }
                           }
                       }
                `
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    // TODO: Log?
                } else {
                    state.splice(0, state.length, ...data.getAllPosts);
                }

            });
        },

        async newPost({state, rootState}, {title, body}) {
            const {apikey} = rootState.auth;

            return fetchGraphQL(config.apiEndPoint, {
                query: `
                       query Post($apikey: String!, $title: String!, $body: String!) {
                           post(apikey: $apikey, title: $title, body: $body) {
                               id,
                               timestamp
                           }
                       }
                `,
                variables: {title, body, apikey}
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {id, timestamp} = data.post;
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
