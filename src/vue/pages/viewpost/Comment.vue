<template>
    <div class="comment">

        <p class="author">{{ comment.user.fullname }}</p>

        <p class="date">{{ toDateString(comment.timestamp) }} • {{ comment.body | HTMLToTimeToReadString }}</p>

        <p class="body">{{ comment.body }}</p>

        <span class="delete" @click="removeComment">Delete comment</span>

    </div>
</template>

<script>


    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        props: {
            comment: {
                type: Object,
                required: true
            },
            post: {
                type: Object,
                required: true
            }
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['auth'])
        },

        methods: {

            toDateString(timestamp) {
                const date = new Date(timestamp);
                return `${date.toLocaleDateString('en-us', {month: 'short'})} ${String(date.getDate()).padStart(2, '0')}`;
            },

            removeComment() {
                const postid = this.post.id;
                const {id} = this.comment;

                this.$store.dispatch('posts/removeComment', {postid, id});
            }
        }
    };

</script>

<style lang="scss" scoped>

    .comment {
        color: $palette-slate-gray;

        .author {
            @include font(400, 0.95em);
            margin-bottom: 0.25em;
        }

        .date {
            @include font(400, 0.75em);
            opacity: 0.8;
            color: rgba(0, 0, 0, 0.5);
        }

        .body {
            @include font(400, 0.95em);
            margin-top: 0.5em;
        }

        .delete {

            @include font(500, 0.75em);
            margin-top: 0.25em;
            margin-right: 0.25em;
            transition: all 0.3s;
            cursor: pointer;
            text-decoration: underline;

            &:hover {
                color: $palette-sweet-red;
            }
        }
    }

</style>
