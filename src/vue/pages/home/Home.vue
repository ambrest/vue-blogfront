<template>
    <section class="home">

        <!-- Header -->
        <h1>Latest Posts</h1>
        <div class="divider"></div>

        <!-- Posts listing -->
        <div class="posts">

            <!-- List -->
            <div v-for="post of posts" class="post">

                <!-- Date info -->
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

                    <!-- Post header and general information -->
                    <h2>{{ post.title }}</h2>

                    <div class="info">
                        <span class="name">By {{ post.user.fullname }}</span>
                        <span class="name"> / {{ post.body | HTMLToTimeToReadString }}</span>
                    </div>

                    <!-- Preview -->
                    <article class="preview blog-content" v-html="post.body"></article>

                    <!-- Action buttons -->
                    <div class="buttons">

                        <router-link :to="`post/${post.id}`">
                            <button class="button-primary icon"><i class="fas fa-fw fa-book"></i>Read more</button>
                        </router-link>

                        <router-link :to="`edit/${post.id}`">
                            <button v-if="auth.user && (auth.user.id === post.user.id) || auth.user.permissions.includes('administrate')"
                                    class="button-secondary icon">
                                <i class="fas fa-fw fa-pen"></i>EDIT
                            </button>
                        </router-link>

                    </div>
                </div>
            </div>

            <!-- Placeholder -->
            <div v-if="!posts.length" class="placeholder">Nothing posted yet...</div>

            <!-- TODO: Error or new badge? -->
        </div>

    </section>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            return {};
        },

        computed: {

            posts() {
                return this.$store.state.posts.map(v => {

                    // Convert timestamp to date
                    v.timestamp = new Date(v.timestamp);

                    return v;
                }).sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);
            },

            ...mapState(['auth'])
        },

        mounted() {

            // Update posts
            this.$store.dispatch('posts/update');
        }
    };

</script>

<style lang="scss" scoped>

    .home {
        overflow: auto;
        width: 100%;
    }

    .placeholder {
        opacity: 0.8;
    }

    .posts {
        @include flex(column, center);
        flex-shrink: 0;
        width: 80%;

        .post {
            @include flex(row);
            @include fixed-width(70%);
            margin-bottom: 9em;

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
                word-break: break-all;
                word-break: break-word;
                flex-shrink: 1;

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
                    position: relative;
                    flex-grow: 0;
                    @include font(400, 0.9em);
                    white-space: pre-line;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin: 1.5em 0;
                    opacity: 0.9;
                    max-height: 16em;

                    &::after {
                        @include pseudo();
                        @include position(0, 0, 0, 0);
                        background: linear-gradient(to top, $palette-snow-white, transparent 15%);
                    }
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
