<template>
    <div class="post">

        <h1>{{ post.title }}</h1>

        <!-- Author and user description -->
        <p class="by">By <b>{{ post.author.fullname }}</b> aka. <b>{{ post.author.username }}</b></p>

        <article class="ql-editor" v-html="post.body"></article>

    </div>
</template>

<script>

    export default {

        data() {
            return {
                post: {}
            };
        },

        beforeMount() {
            const id = this.$route.params.pathMatch;
            this.post = this.$store.state.posts.find(post => post.id === id);
        }

    };

</script>

<style lang="scss" scoped>

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
            padding: 0;
            font-size: 0.95em;
        }
    }

</style>
