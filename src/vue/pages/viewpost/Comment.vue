<template>
    <div class="comment">

        <p class="author">{{ comment.user.fullname }}</p>

        <p class="date">{{ toDateString(comment.timestamp) }} • {{ comment.body | HTMLToTimeToReadString }}</p>

        <p class="body">{{ comment.body }}</p>

    </div>
</template>

<script>

    export default {
        props: {
            comment: {
                type: Object,
                required: true
            }
        },

        data() {
            return {};
        },

        methods: {

            toDateString(timestamp) {
                const date = new Date(timestamp);
                return `${date.toLocaleDateString('en-us', {month: 'short'})} ${String(date.getDate()).padStart(2, '0')}`;
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
    }

</style>
