<template>
    <section class="home">

        <!-- Header -->
        <h1>Latest Posts</h1>
        <div class="divider"></div>

        <!-- Posts listing -->
        <div class="posts">

            <!-- List -->
            <div v-for="post of posts" class="post">

                <!-- Date info, not visible on mobile devices -->
                <div class="date">
                    <span class="day">{{ post.date.day }}</span>
                    <div>
                        <span class="month">{{ post.date.month }}</span>
                        <span class="diff">-</span>
                        <span class="year">{{ post.date.year }}</span>
                    </div>
                </div>

                <!-- Right side -->
                <div class="content">

                    <!-- Post header and general information -->
                    <h2>{{ post.title }}</h2>

                    <div class="info">
                        <span class="date">{{ post.date.day }} {{ post.date.month }} - {{ post.date.year }} / </span>
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

                        <router-link v-if="auth.user && ((auth.user.id === post.user.id) || auth.user.permissions.includes('administrate'))"
                                     :to="`edit/${post.id}`">
                            <button class="button-secondary icon">
                                <i class="fas fa-fw fa-pen"></i>EDIT
                            </button>
                        </router-link>

                    </div>
                </div>
            </div>

            <!-- Placeholder -->
            <div v-if="!posts.length" class="placeholder">{{ errorMsg || 'Nothing posted yet...' }}</div>
        </div>

    </section>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            return {
                errorMsg: null
            };
        },

        computed: {

            posts() {
                return this.$store.state.posts.list.map(v => {

                    // Convert timestamp to date
                    const date = new Date(v.timestamp);
                    v.date = {
                        day: String(date.getDate()).padStart(2, '0'),
                        month: date.toLocaleString('en-us', {month: 'short'}),
                        year: date.getFullYear()
                    };

                    return v;
                }).sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);
            },

            ...mapState(['auth'])
        },

        mounted() {

            window.addEventListener('scroll', () => {

                // Check if the user has reached to bottom of the page
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    this.$store.dispatch('posts/fetchNext').then(() => {
                        this.errorMsg = '';
                    }).catch(err => {
                        this.errorMsg = err;
                    });
                }

            });

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

            > .date {
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
                word-break: break-all; // Edge fallback
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

                    .date {
                        display: none;
                    }
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

    @include tablet {
        .posts {
            width: 100%;

            .post {
                @include fixed-width(90%);
            }
        }
    }

    @include mobile {
        .posts {
            .post {
                position: relative;
                @include fixed-width(95%);
                padding: 3.5em 0 3em;
                margin: 0;

                > .date {
                    display: none;
                }

                .content {
                    padding: 0;

                    .info {
                        width: 100%;

                        .date {
                            display: inline;
                        }
                    }
                }

                &::after {
                    @include pseudo();
                    @include position(auto, 0, 0, 0);
                    @include size(60%, 1px);
                    background: $palette-decent-blue;
                    margin: auto;
                    opacity: 0.5;
                }

                &:last-child::after {
                    content: none;
                }
            }
        }
    }

</style>
