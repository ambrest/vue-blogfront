import config from '../../../config/config';

export const posts = {

    namespaced: true,

    // Holds a list of loaded posts
    state: {
        list: [],
        offset: 0
    },

    actions: {

        /**
         * Load posts section wise.
         * @param reset Clear posts
         */
        async fetchNext({state}, {reset = false} = {}) {

            if (reset) {
                state.list.splice(0, state.list.length);
                state.offset = 0;
            }

            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'getPostCountRange',
                    vars: {
                        start: state.offset,
                        end: state.offset + config.postsPreloadAmount
                    },
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
                }
            }).then(({errors, data: {getPostCountRange}}) => {
                if (errors && errors.length) {
                    throw 'Please go online.';
                } else if (Array.isArray(getPostCountRange)) {
                    state.offset += getPostCountRange.length;
                    state.list.push(...getPostCountRange);
                }
            });
        },

        /**
         * Creates a new post.
         *
         * @param title Post title
         * @param body Actual post content
         */
        async newPost({state, rootState}, {title, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'post',
                    vars: {apikey, title, body},
                    fields: ['id', 'timestamp']
                }
            }).then(({errors, data}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {
                    const {id, timestamp} = data.post;
                    const post = {
                        id,
                        timestamp,
                        title,
                        body,
                        comments: [],
                        user: {
                            ...rootState.auth.user
                        }
                    };

                    /**
                     * Request was successful, save post locally to
                     * prevent unnecessary api calls.
                     */
                    state.list.unshift(post);
                    return post;
                }

            });
        },

        /**
         * Updates a exising Post
         *
         * @param id Post id
         * @param title New Title
         * @param body New Content
         */
        async updatePost({state, rootState}, {id, title, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'updatePost',
                    vars: {apikey, id, title, body},
                    fields: ['id']
                }
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    // Update post in place
                    const post = state.list.find(post => post.id === id);
                    post.title = title;
                    post.body = body;

                    return post;
                }
            });
        },

        /**
         * Removes a particular post
         *
         * @param id Post id
         */
        async removePost({state, rootState}, {id}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'removePost',
                    vars: {apikey, id},
                    fields: ['id']
                }
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    /**
                     * Request was successful, remove post locally to
                     * prevent unnecessary api calls.
                     */
                    state.list.splice(state.list.findIndex(post => post.id === id), 1);
                }
            });
        },

        /**
         * Creates a new comment
         *
         * @param postid Post id
         * @param body Comment content
         */
        async newComment({state, rootState}, {postid, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'comment',
                    vars: {postid, body, apikey},
                    fields: `
                        id,
                        body,
                        timestamp,

                        user {
                            id,
                            username,
                            fullname                                 
                        }
                    `
                }
            }).then(({errors, data: {comment}}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    // Update comment in place
                    const post = state.list.find(post => post.id === postid);
                    post.comments.push(comment);
                }
            });
        },

        /**
         * Updates a existing comment
         *
         * @param postid Post id
         * @param id Comment id
         * @param body New content
         */
        async updateComment({state, rootState}, {postid, id, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'updateComment',
                    vars: {postid, id, body, apikey},
                    fields: ['id']
                }
            }).then(({errors}) => {
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    // Update comment in place
                    const post = state.list.find(post => post.id === postid);
                    const comment = post.comments.find(v => v.id === id);
                    comment.body = body;
                }
            });
        },

        /**
         * Removes a particular comment by id
         *
         * @param postid Post id
         * @param id Comment id
         */
        async removeComment({state, rootState}, {postid, id}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'removeComment',
                    vars: {postid, id, apikey},
                    fields: ['id']
                }
            }).then(({errors}) => {
                if (errors && errors.length) {
                    throw errors[0].message;
                }

                // Remove comment
                const post = state.list.find(post => post.id === postid);
                const commentIndex = post.comments.findIndex(cmd => cmd.id === id);
                post.comments.splice(commentIndex, 1);
            });
        },

        /**
         * Tries to find a specific post by id,
         * first from the current state, and if this wasn't successfull
         * it tries to fetch all from the server and resolves it by this action.
         *
         * @param id Post id
         */
        async findPostById({state}, {id}) {

            // First try to fetch post from cache
            const post = state.list.find(post => post.id === id);

            if (post) {
                return post;
            }

            // Make specific request for this post by his id
            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'getPost',
                    vars: {id},
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
                }
            }).then(({errors, data: {getPost}}) => {

                if (errors && errors.length) {
                    throw 'Cannot fetch post';
                }

                if (!state.list.find(v => v.id === getPost.id)) {
                    state.list.push(getPost);
                }

                return getPost;
            });
        },

        /**
         * Fetches all posts from a specific user
         * @param id User id
         */
        async getPostsFromUser(_, {id}) {

            // Fetch posts from this user in particular
            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'getPostsBy',
                    vars: {userid: id},
                    fields: `
                        id,
                        title,
                        body,
                        timestamp,
                        
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
                }
            }).then(({errors, data: {getPostsBy}}) => {
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {
                    return getPostsBy;
                }
            });
        }
    }
};
