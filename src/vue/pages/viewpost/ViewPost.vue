<template>
    <div v-if="post" class="post">

        <h1>{{ post.title }}</h1>

        <!-- Author and user description -->
        <p class="by">By <b>{{ post.user.fullname }}</b> aka. <b>{{ post.user.username }}</b></p>

        <!-- Comment body as HTML -->
        <article ref="postBodyElement"
                 class="blog-content"
                 v-html="post.body"></article>

        <create-comment :postid="post.id" class="create-comment"></create-comment>

    </div>
</template>

<script>

    // Components
    import CreateComment from './CreateComment';

    export default {
        components: {CreateComment},

        data() {
            return {
                post: null
            };
        },

        beforeMount() {
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

    };

</script>

<style lang="scss" scoped>

    .post {
        width: 100%;

        .by {
            @include font(400, 0.9em);
            margin: -1.5em 0 1.5em;
            color: $palette-slate-gray;

            b {
                color: $palette-sweet-red;
            }
        }

        article {
            padding: 0;
            font-size: 0.9em;
            flex-shrink: 1;
            line-height: 1.5em;
            width: 100%;
        }

        .create-comment {
            width: 100%;
            flex-shrink: 0;
        }
    }

</style>
