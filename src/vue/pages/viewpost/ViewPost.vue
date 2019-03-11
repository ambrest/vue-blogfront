<template>
    <div v-if="post" class="post divided">

        <div class="flow-bar">
            <div :class="{visible: lastScrollDirection === 'up'}">
                <a :href="share.twitter"><i class="share-btn fab fa-fw fa-twitter" style="color: #1da1f2"></i></a>
                <a :href="share.facebook"><i class="share-btn  fab fa-fw fa-facebook" style="color: #3a559f"></i></a>
                <a :href="share.telegram"><i class="share-btn  fab fa-fw fa-telegram" style="color: #269ed2"></i></a>
                <a :href="share.whatsapp"><i class="share-btn  fab fa-fw fa-whatsapp" style="color: #00e676"></i></a>

                <div class="divider"></div>

                <div class="clap-count">
                    <clapper :post="post" :limit="50"/>
                    <span class="claps">{{ post.totalClaps }}</span>
                </div>
            </div>
        </div>

        <div class="tab">
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
                <span v-for="tag of post.tags">{{ tag }}</span>
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
    import Clapper       from '../../components/Clapper';

    // Vuex
    import {mapState} from 'vuex';

    export default {
        components: {CreateComment, Comment, Clapper},

        data() {
            return {
                post: null,
                lastScrollDirection: 'down'
            };
        },

        computed: {

            canComment() {
                const {user} = this.$store.state.auth;
                return user && user.permissions.includes('comment');
            },

            share() {
                const text = encodeURIComponent(`${this.post.title} by ${this.post.user.fullname} at ${location.href}`);
                const url = encodeURIComponent(location.href);

                return {
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                    twitter: `https://twitter.com/intent/tweet?text=${text}`,
                    linkedin: `https://www.linkedin.com/shareArticle?url=${url}&title=${encodeURIComponent(this.post.title)}`,
                    xing: `https://www.xing.com/spi/shares/new?url=${url}`,
                    whatsapp: `https://wa.me/?text=${text}`,
                    telegramm: `https://telegram.me/share/url?url=${url}&text=${text}`
                };
            },

            ...mapState(['auth'])
        },

        beforeMount() {
            this.fetch();

            let lastScrollY = window.scrollY;
            this.utils.on(window, 'scroll', () => {
                this.lastScrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
                lastScrollY = window.scrollY;
            });
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
            }
        }
    };

</script>

<style lang="scss" scoped>

    .tab {
        width: 100vw;
        margin-bottom: 3em;
    }

    .post {
        position: relative;

        .flow-bar {
            @include position(0, 0, 0, -4em);
            position: absolute;
            width: 3em;

            > div {
                @include flex(column, center);
                position: sticky;
                top: 7.5em;
                background: $palette-snow-white;
                padding: 0.5em 0;
                border-radius: 0.25em;
                box-shadow: 0 0.05em 1.5em rgba($palette-slate-gray, 0.15);
                font-size: 0.85em;

                a {
                    margin: 0.6em 0;
                }

                .divider {
                    @include size(50%, 1px);
                    background: $palette-decent-blue;
                    margin: 0.5em 0;
                }

                .clap-count {
                    @include flex(column, center, center);

                    .clapper {
                        font-size: 1.25em;
                    }

                    .claps {
                        @include font(500, 0.95em);
                        color: $palette-slate-gray;
                        margin: 0.35em 0;
                    }
                }
            }
        }

        .share-btn {
            color: $palette-slate-gray;
            font-size: 1.85em;
            margin: 0 0.15em;
            filter: grayscale(1);
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                filter: none;
            }
        }

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
                padding-top: 0.75em;
            }

            > span {
                font-size: 0.8em;
                font-weight: 500;
                background: rgba($palette-slate-gray, 0.07);
                color: rgba($palette-slate-gray, 0.75);
                margin: 0 0.5em 0.5em 0;
                border-radius: 0.15em;
                padding: 0.55em 0.85em 0.5em;
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

    // TODO: Add tablet style
    @include mobile {
        .post {
            font-size: 0.9em;

            .flow-bar {

                > div {
                    @include flex(row, center, space-around);
                    @include position(auto, 0, 0, 0);
                    position: fixed;
                    width: 100%;
                    z-index: 10;
                    transform: translateY(100%);
                    transition: all 0.3s;
                    opacity: 0;

                    &.visible {
                        opacity: 1;
                        transform: none;
                    }

                    .divider {
                        display: none;
                    }

                    .clap-count {
                        flex-direction: row;

                        .claps {
                            margin-bottom: -1px;
                        }
                    }
                }
            }

            .by {
                margin-top: 0;
            }
        }
    }

</style>
