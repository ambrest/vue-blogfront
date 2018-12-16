export const posts = {

    namespaced: true,

    // Holds a list of loaded posts
    state: [],

    actions: {

        /**
         * Loads and overrides all currently
         * available posts into this store module.
         * TODO: Load part-wise
         *
         * @param state
         */
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

        /**
         * Creates a new post.
         *
         * @param title Post title
         * @param body Actual post content
         */
        async newPost({state, rootState}, {title, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'post',
                vars: {apikey, title, body},
                fields: ['id', 'timestamp']
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
                        user: {
                            ...rootState.auth.user
                        }
                    };

                    /**
                     * Request was successful, save post locally to
                     * prevent unnecessary api calls.
                     */
                    state.unshift();
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
                operation: 'updatePost',
                vars: {apikey, id, title, body},
                fields: ['id']
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    /**
                     * Request was successful, update post locally to
                     * prevent unnecessary api calls.
                     */
                    const post = state.find(post => post.id = id);
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
                operation: 'removePost',
                vars: {apikey, id},
                fields: ['id']
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {

                    /**
                     * Request was successful, remove post locally to
                     * prevent unnecessary api calls.
                     */
                    state.splice(state.findIndex(post => post.id === id), 1);
                }

            });
        },

        /**
         * Creates a new comment
         *
         * @param postid Post id
         * @param body Comment content
         */
        async newComment({rootState}, {postid, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                operation: 'comment',
                vars: {postid, body, apikey},
                fields: ['id', 'timestamp']
            }).then(({errors}) => {

                // Check for errors and, if presend, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {
                    return this.dispatch('posts/update');
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
                operation: 'updateComment',
                vars: {postid, id, body, apikey},
                fields: ['id']
            }).then(({errors}) => {
                if (!errors) {

                    /**
                     * Request was successful, update comment locally to
                     * prevent unnecessary api calls.
                     */
                    const post = state.find(post => post.id === postid);
                    post.comments.find(cmd => cmd.id === id && (cmd.body = body));
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
                operation: 'removeComment',
                vars: {postid, id, apikey},
                fields: ['id']
            }).then(({errors}) => {
                if (!errors) {

                    /**
                     * Request was successful, remove comment locally to
                     * prevent unnecessary api calls.
                     */
                    const post = state.find(post => post.id === postid);
                    post.comments = post.comments.filter(cmd => cmd.id !== id);
                }
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
            const post = state.find(post => post.id === id);

            if (post) {
                return post;
            }

            // Make specific request for this post by his id
            return this.dispatch('graphql', {
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
            }).then(({errors, data: {getPost}}) => {
                if (errors && errors.length) {
                    throw '';
                }
                return getPost;
            });

        }
    }
};
