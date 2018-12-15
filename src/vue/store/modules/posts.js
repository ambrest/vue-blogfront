export const posts = {

    namespaced: true,

    state: [],

    actions: {

        async update({state}) {
            return this.dispatch('graphql', {
                operation: 'getAllPosts',
                fields: `
                       id,
                       title,
                       body,
                       timestamp,
                       
                       user {
                           id,
                           username,
                           fullname                                 
                       },
                       
                       comments {
                           id,
                           body,
                           timestamp,
                           user {
                               id,
                               fullname,
                               username
                           }
                       }
                `
            }).then(({errors, data: {getAllPosts}}) => {

                if (errors && errors.length) {
                    // TODO: Log?
                } else if (Array.isArray(getAllPosts)) {
                    state.splice(0, state.length, ...getAllPosts);
                }

            });
        },

        async newPost({state, rootState}, {title, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'post',
                vars: {apikey, title, body},
                fields: ['id', 'timestamp']
            }).then(({errors, data}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const {id, timestamp} = data.post;
                    state.unshift({
                        id,
                        timestamp,
                        title,
                        body,
                        user: {
                            ...rootState.auth.user
                        }
                    });
                }

            });
        },

        async updatePost({rootState}, {id, title, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'updatePost',
                vars: {apikey, id, title, body},
                fields: ['id']
            }).then(({errors}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    return this.dispatch('posts/update');
                }

            });
        },

        async removePost({state, rootState}, {id}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'removePost',
                vars: {apikey, id},
                fields: ['id']
            }).then(({errors}) => {

                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    const postIndex = state.findIndex(post => post.id === id);
                    state.splice(postIndex, 1);
                }

            });
        },

        async newComment({rootState}, {postid, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'comment',
                vars: {postid, body, apikey},
                fields: ['id', 'timestamp']
            }).then(({errors}) => {
                if (errors && errors.length) {
                    return Promise.reject(errors[0].message);
                } else {
                    return this.dispatch('posts/update');
                }
            });
        },

        async updateComment({state, rootState}, {postid, id, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'updateComment',
                vars: {postid, id, body, apikey},
                fields: ['id']
            }).then(({errors}) => {
                if (!errors) {
                    const post = state.find(post => post.id === postid);
                    post.comments.find(cmd => cmd.id === id && (cmd.body = body));
                }
            });
        },

        async removeComment({state, rootState}, {postid, id}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'removeComment',
                vars: {postid, id, apikey},
                fields: ['id']
            }).then(({errors}) => {
                if (!errors) {
                    const post = state.find(post => post.id === postid);
                    post.comments = post.comments.filter(cmd => cmd.id !== id);
                }
            });
        },

        async findPostById({state}, {id}) {
            const post = state.find(post => post.id === id);
            return new Promise((resolve, reject) => {

                if (!post) {
                    return this.dispatch('posts/update').then(() => {
                        const post = state.find(post => post.id === id);

                        // Redirect to homepage if not found
                        if (!post) {
                            reject();
                        } else {
                            resolve(post);
                        }
                    });
                } else {
                    resolve(post);
                }

            });
        }
    }
};
