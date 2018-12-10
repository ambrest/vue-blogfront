<template>
    <div class="post extendet">

        <h1>{{ post.title }}</h1>

        <!-- Author and user description -->
        <p class="by">By <b>{{ post.user.fullname }}</b> aka. <b>{{ post.user.username }}</b></p>

        <!-- Comment body as HTML -->
        <article class="blog-content" v-html="post.body"></article>

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
                post: {}
            };
        },

        beforeMount() {
            const {id} = this.$route.params;
            this.post = this.$store.state.posts.find(post => post.id === id);
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
            font-size: 0.95em;
            flex-shrink: 1;
            width: 100%;
        }

        .create-comment {
            width: 100%;
            flex-shrink: 0;
        }
    }

</style>
