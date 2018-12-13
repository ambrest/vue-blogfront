<template>
    <div v-if="post" class="post divided">

        <div class="tab">
            <h1>{{ post.title }}</h1>

            <!-- Author and user description -->
            <p class="by">By <b>{{ post.user.fullname }}</b> aka. <b>{{ post.user.username }}</b></p>

            <!-- Comment body as HTML -->
            <article ref="postBodyElement"
                     class="blog-content"
                     v-html="post.body"></article>
        </div>

        <div v-if="$store.state.auth.user"
             class="tab">

            <create-comment :postid="post.id"
                            class="create-comment"
                            @submitted="fetch"></create-comment>

            <!-- Comment list -->
            <div class="comments">

                <div v-if="post.comments.length">
                    <h1>Responses</h1>
                    <comment v-for="comment of post.comments"
                             :comment="comment"></comment>
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

    export default {
        components: {CreateComment, Comment},

        data() {
            return {
                post: null
            };
        },

        beforeMount() {
            this.fetch();
        },

        methods: {

            fetch() {
                const {id} = this.$route.params;

                // Try to fetch from store
                let post = this.$store.state.posts.find(post => post.id === id);

                new Promise(resolve => {

                    if (!post) {
                        return this.$store.dispatch('posts/update').then(() => {
                            const post = this.$store.state.posts.find(post => post.id === id);

                            // Redirect to homepage if not found
                            if (!post) {
                                this.$router.replace('/');
                            } else {
                                resolve(this.post = post);
                            }
                        });
                    } else {
                        resolve(this.post = post);
                    }

                }).then(post => {

                    // Sort comments
                    post.comments.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);

                    // Update meta tags
                    const tmpBody = document.createElement('body');
                    tmpBody.innerHTML = post.body;

                    const description = tmpBody.innerText.substring(0, 150) + '...';
                    const {title, user: {fullname}} = this.post;

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
                });
            }

        }

    };

</script>

<style lang="scss" scoped>

    .tab {
        width: 100%;
        margin-bottom: 3em;
    }

    .post {

        .by {
            @include font(400, 0.9em);
            margin: -1.5em 0 1.5em;
            color: $palette-slate-gray;

            b {
                color: $palette-sweet-red;
            }
        }

        article {
            font-size: 0.9em;
            flex-shrink: 1;
            width: 100%;
        }
    }

    .create-comment {
        width: 100%;
        flex-shrink: 0;
        margin-top: 0.5em;
    }

    .comments {
        @include flex(column, stretch);
        color: $palette-slate-gray;
        margin-top: 2em;
        width: 100%;

        div > h1 {
            @include font(500, 0.9em);
            text-align: left;
            opacity: 0.9;
        }

        .comment {
            margin-top: 1em;

            &::after {
                display: block;
                content: '';
                @include size(100%, 1px);
                background: $palette-decent-blue;
                opacity: 0.5;
                margin-top: 1em;
            }

            &:last-child::after {
                content: none;
            }
        }

        .placeholder {
            @include font(500, 0.9em);
            text-align: center;
        }
    }

</style>
