import config from '../../../config/config';

export const posts = {

    namespaced: true,

    state: {},

    actions: {

        /**
         * Creates a new post.
         *
         * @param rootState
         * @param title Post title
         * @param body Actual post content
         * @param tags Optional post tags
         */
        async newPost({rootState}, {title, body, tags}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'post',
                    vars: {apikey, title, body, tags},
                    types: {tags: 'String'},
                    fields: ['id', 'timestamp']
                }
            }).then(({errors, data: {post}}) => {

                // Check for errors and, if present, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {
                    return post;
                }
            });
        },

        /**
         * Updates a exising Post
         *
         * @param rootState
         * @param id Post id
         * @param title New Title
         * @param body New Content
         * @param tags Optional post tags
         */
        async updatePost({rootState}, {id, title, body, tags}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'updatePost',
                    vars: {apikey, id, title, body, tags},
                    types: {tags: 'String'},
                    fields: ['id']
                }
            }).then(({errors}) => {

                // Check for errors and, if present, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                }
            });
        },

        /**
         * Increments claps for a specific post
         * @param rootState
         * @param newClaps
         * @returns {Promise<T | never>}
         */
        incrementClaps({rootState}, {newClaps, postId}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'incrementClaps',
                    vars: {apikey, postId, newClaps},
                    fields: ['claps']
                }
            }).then(({errors, data: {incrementClaps}}) => {

                // Check for errors and, if present, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                }

                return incrementClaps.claps;
            });
        },

        /**
         * Removes a particular post
         *
         * @param rootState
         * @param id Post id
         */
        async removePost({rootState}, {id}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'removePost',
                    vars: {apikey, id},
                    fields: ['id']
                }
            }).then(({errors}) => {

                // Check for errors and, if present, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                }
            });
        },

        /**
         * Creates a new comment
         *
         * @param rootState
         * @param postid Post id
         * @param body Comment content
         */
        async newComment({rootState}, {postid, body}) {
            const {apikey} = rootState.auth;

            return this.dispatch('graphql', {
                query: {
                    operation: 'comment',
                    vars: {postid, body, apikey},
                    fields: ['id']
                }
            }).then(({errors}) => {

                // Check for errors and, if present, return the message of the first one
                if (errors && errors.length) {
                    throw errors[0].message;
                }
            });
        },

        /**
         * Updates a existing comment
         *
         * @param rootState
         * @param postid Post id
         * @param id Comment id
         * @param body New content
         */
        async updateComment({rootState}, {postid, id, body}) {
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
                }
            });
        },

        /**
         * Removes a particular comment by id
         *
         * @param rootState
         * @param postid Post id
         * @param id Comment id
         */
        async removeComment({rootState}, {postid, id}) {
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
            });
        },

        /**
         * Tries to find a specific post by id,
         * first from the current state, and if this wasn't successfull
         * it tries to fetch all from the server and resolves it by this action.
         *
         * @param id Post id
         */
        async findPostById(_, {id}) {

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
                        tags,
                        claps,
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

                return getPost;
            });
        },

        /**
         * Loads the latest post from a specific offset
         * @param _
         * @param offset
         * @returns {Promise<void>}
         */
        async getPostInRange(_, {offset = 0} = {}) {
            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'getPostCountRange',
                    vars: {
                        start: offset,
                        end: offset + config.postsPreloadAmount
                    },
                    fields: `
                        id,
                        title,
                        body,
                        tags,
                        claps,
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
                    return {posts: getPostCountRange, newOffset: getPostCountRange.length + offset};
                }
            });
        },

        /**
         * Fetches all posts from a specific user
         * @param _
         * @param id User id
         * @param offset
         */
        async getPostsFromUser(_, {id, offset = 0}) {

            // Fetch posts from this user in particular
            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'getPostsBy',
                    vars: {
                        userid: id,
                        start: offset,
                        end: offset + config.postsPreloadAmount
                    },
                    fields: `
                        id,
                        title,
                        body,
                        tags,
                        claps,
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
                    return {posts: getPostsBy, newOffset: getPostsBy.length + offset};
                }
            });
        },

        /**
         * Searchs all posts with a query
         * @param _
         * @param query
         * @param offset
         * @returns {Promise<T | never>}
         */
        async searchPosts(_, {query, offset = 0}) {

            // Search posts
            return this.dispatch('graphql', {
                cache: true,
                query: {
                    operation: 'searchPosts',
                    vars: {
                        query,
                        start: offset,
                        end: offset + config.postsPreloadAmount
                    },
                    fields: `
                        id,
                        title,
                        body,
                        tags,
                        claps,
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
            }).then(({errors, data: {searchPosts}}) => {
                if (errors && errors.length) {
                    throw errors[0].message;
                } else {
                    return {posts: searchPosts, newOffset: searchPosts.length + offset};
                }
            });
        }
    }
};
