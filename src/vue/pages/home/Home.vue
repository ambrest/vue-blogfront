<template>
    <section class="home">

        <!-- Header -->
        <h1>Latest Posts</h1>
        <div class="divider"></div>

        <!-- Posts listing -->
        <div class="posts">
            <div v-for="post of posts" class="post">

                <!-- Left side -->
                <div class="date">
                    <span class="day">{{ String(post.timestamp.getDate()).padStart(2, '0') }}</span>
                    <div>
                        <span class="month">{{ post.timestamp.toLocaleString('en-us', {month: 'short'}) }}</span>
                        <span class="diff">-</span>
                        <span class="year">{{ post.timestamp.getFullYear() }}</span>
                    </div>
                </div>

                <!-- Right side -->
                <div class="content">
                    <h2>{{ post.title }}</h2>

                    <div class="info">
                        <span class="name">By {{ post.author.fullname }}</span>
                        <span class="name"> / {{ post.readTime }}</span>
                    </div>

                    <article class="preview">{{ post.body }}</article>

                    <div class="buttons">
                        <button class="button-primary">Read More</button>
                        <button class="button-secondary">Share</button>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script>

    export default {

        data() {
            return {};
        },

        computed: {

            posts() {
                const {maxPostPreviewLength, wordsPerMinute} = this.config;

                return this.$store.state.posts.map(v => {
                    v.timestamp = new Date(v.timestamp);

                    // Calculate time to read it
                    v.readTime = Math.round(v.body.match(/\w+/g).length / wordsPerMinute);
                    v.readTime = `${v.readTime < 1 ? '< 1' : v.readTime} minute Read`;

                    // Crop body
                    if (v.body.length > maxPostPreviewLength) {
                        v.body = v.body.substring(0, maxPostPreviewLength) + '...';
                    }

                    return v;
                });
            }
        },

        mounted() {

            // Update posts
            this.$store.dispatch('posts/update');
        }
    };

</script>

<style lang="scss" scoped>

    .home {
    }

    .posts {
        @include flex(column, center);
        flex-shrink: 0;

        .post {
            @include flex(row);
            margin-bottom: 9em;
            width: 70%;

            .date {
                position: relative;
                @include flex(column, center);
                padding-right: 2em;
                padding-bottom: 4em;
                margin-bottom: 3em;
                width: 5em;

                .day {
                    @include font(300, 3.5em, 0.04em);
                    color: $palette-sweet-red;
                }

                .month,
                .year {
                    @include font(500, 0.9em);
                    opacity: 0.95;
                }

                .diff {
                    color: rgba(black, 0.15);
                    margin: 0 0.15em;
                }

                &::before,
                &::after {
                    @include pseudo();
                }

                &::before {
                    @include position(2.5em, 0, 0, auto);
                    @include size(1px, 100%);
                    background: rgba(black, 0.05);
                }

                &::after {
                    @include position(2.5em, -4px, auto, auto);
                    @include size(9px);
                    border-radius: 100%;
                    background: $palette-sweet-red;
                }
            }

            .content {
                @include flex(column, flex-start);
                padding-left: 2em;

                h2 {
                    @include font(400);
                    margin-bottom: 0.4em;
                    opacity: 0.8;
                }

                .info {
                    @include font(500, 0.8em);
                    color: rgba(black, 0.3);
                }

                .preview {
                    flex-grow: 0;
                    @include font(500, 0.9em);
                    line-height: 1.6em;
                    white-space: pre-line;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin: 1.5em 0;
                    opacity: 0.9;
                }

                .buttons {
                    margin-top: auto;

                    button {
                        margin-right: 0.3em;
                    }
                }
            }
        }
    }

</style>
