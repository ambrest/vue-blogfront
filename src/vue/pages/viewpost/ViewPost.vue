<template>
    <div v-if="post" class="view-post divided">

        <div class="tab">

            <flow-bar :post="post"/>

            <div class="header">
                <span>{{ post.title }}</span>

                <router-link v-if="auth.user && ((auth.user.id === post.user.id) || auth.user.permissions.includes('administrate'))"
                             :to="`/edit/${post.id}`"
                             class="icon fas fa-fw fa-pen"/>
            </div>


            <!-- Author and user description -->
            <p class="by">
                By
                <router-link :to="`/user/${post.user.id}`" class="name">{{ post.user.fullname }}</router-link>
                aka. <b>{{ post.user.username }}</b>
            </p>

            <!-- Comment body as HTML -->
            <article ref="postBodyElement"
                     class="blog-content"
                     v-html="post.body"></article>

            <!-- Tags -->
            <div class="tags">
                <span v-for="tag of post.tags" @click="searchWithTag(tag)">{{ tag }}</span>
            </div>
        </div>

        <div class="tab">
            <create-comment v-if="canComment"
                            :postid="post.id"
                            @submitted="fetch"/>

            <!-- Comment list -->
            <div class="comments">

                <div>
                    <h1>Responses</h1>
                    <comment v-for="comment of post.comments"
                             :comment="comment"
                             :post="post"
                             :key="comment.id"/>
                </div>

                <!-- Placeholder -->
                <p v-if="!post.comments.length" class="placeholder">No comments yet</p>
            </div>
        </div>

    </div>
</template>

<script>

    // Components
    import CreateComment from './CreateComment';
    import Comment       from './Comment';
    import FlowBar       from './FlowBar';

    // Vuex
    import {mapState} from 'vuex';

    export default {
        components: {CreateComment, Comment, FlowBar},

        data() {
            return {
                post: null
            };
        },

        computed: {

            canComment() {
                const {user} = this.$store.state.auth;
                return user && user.permissions.includes('comment');
            },

            ...mapState(['auth'])
        },

        beforeMount() {
            this.fetch();
        },

        destroyed() {

            // Reset page title
            document.title = this.config.pageTitle;
        },

        methods: {

            fetch() {
                const {id} = this.$route.params;

                // Find post by id
                this.$store.dispatch('posts/findPostById', {id}).then(post => {
                    this.post = post;

                    // Sort comments
                    post.comments.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);

                    // Update meta tags
                    const tmpBody = document.createElement('body');
                    tmpBody.innerHTML = post.body;

                    const description = tmpBody.innerText.substring(0, 150) + '...';
                    const {title, user: {fullname}} = this.post;

                    // Set meta tags
                    this.utils.setMetaTags([
                        {name: 'twitter:card', content: 'product'},
                        {name: 'twitter:site', content: '@publisher_handle'},
                        {name: 'twitter:title', content: title},
                        {name: 'twitter:description', content: description},
                        {name: 'twitter:creator', content: fullname},
                        {property: 'og:title', content: title},
                        {property: 'og:type', content: 'article'},
                        {property: 'og:url', content: 'http://www.example.com/'},
                        {property: 'og:image', content: 'http://example.com/image.jpg'},
                        {property: 'og:description', content: description},
                        {property: 'og:site_name:', content: 'Site name:, i.e. Moz'}
                    ]);

                    // Update page title
                    document.title = `${this.config.pageTitle} - ${post.title}`;
                }).catch(() => {
                    this.$router.replace('/');
                });
            },

            searchWithTag(tag) {
                this.$router.push(`/search?query=${tag}`);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .view-post {
        width: 100%;
    }

    .tab {
        width: 100%;
        margin-bottom: 3em;
    }

    .view-post {
        position: relative;

        .by {
            @include font(400, 0.9em);
            margin: -1.5em 0 1.5em;
            color: $palette-slate-gray;
            flex-shrink: 0;

            b {
                font-weight: 500;
                color: $palette-sweet-red;
            }

            a {
                font-weight: 500;
                color: $palette-sweet-red;
                text-decoration: underline;
            }
        }

        .tags {
            @include flex(row, center, center);
            flex-wrap: wrap;
            width: 100%;

            &:not(:empty) {
                padding-top: 1.5em;
            }

            > span {
                font-size: 0.8em;
                font-weight: 500;
                background: rgba($palette-slate-gray, 0.05);
                color: rgba($palette-slate-gray, 0.75);
                margin: 0 0.5em 0.5em 0;
                border-radius: 0.15em;
                padding: 0.55em 0.85em 0.5em;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    background: rgba($palette-slate-gray, 0.1);
                    color: rgba($palette-slate-gray, 0.85);
                }
            }
        }

        article {
            flex-shrink: 1;
            width: 100%;
        }
    }

    .create-comment {
        width: 100%;
        flex-shrink: 0;
        margin: 0.5em 0 2em;
    }

    .comments {
        @include flex(column, stretch);
        color: $palette-slate-gray;
        width: 100%;

        div > h1 {
            @include font(500, 0.9em);
            text-align: left;
            opacity: 0.9;
        }

        .comment {
            margin: 1em auto 0 auto;
            padding: 1em;
            border-radius: 0.25em;
            border: 1px solid rgba($palette-slate-gray, 0.075);
            box-shadow: 0 1px 4px rgba($palette-slate-gray, 0.045);
        }

        .placeholder {
            @include font(500, 0.9em);
            text-align: center;
        }
    }

    @include MQTablets {
        .view-post {
            font-size: 0.9em;

            .by {
                margin-top: 0;
            }
        }
    }

</style>
