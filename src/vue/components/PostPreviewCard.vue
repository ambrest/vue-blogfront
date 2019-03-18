<template>
    <div class="post-preview-card">

        <!-- Date info, not visible on mobile devices -->
        <div class="lefty">
            <span class="day">{{ preparedPost.date.day }}</span>

            <div>
                <span class="month">{{ preparedPost.date.month }}</span>
                <span class="diff">-</span>
                <span class="year">{{ preparedPost.date.year }}</span>
            </div>

            <div class="claps">
                <clapper :post="post" :limit="50"/>
                <span>{{ post.totalClaps | ReadableNumber }}</span>
            </div>
        </div>

        <!-- Right side -->
        <div class="content">

            <!-- Post header and general information -->
            <h2>{{ preparedPost.title }}</h2>

            <div class="sub-area">

                <!-- Profile picture -->
                <router-link :to="`/user/${preparedPost.user.id}`" class="profile-pic">
                    <img v-if="post.user.profilePicture"
                         :src="`data:img/png;base64,${post.user.profilePicture}`"
                         :alt="post.user.fullname">
                    <profile-picture-placeholder v-else/>
                </router-link>

                <!-- General post info -->
                <div class="info">
                    <router-link :to="`/user/${preparedPost.user.id}`" class="name">By {{ preparedPost.user.fullname }}</router-link>

                    <p class="sub">
                        {{ preparedPost.date.day }} {{ preparedPost.date.month }} {{ preparedPost.date.year }}
                        • {{ preparedPost.body | HTMLToTimeToReadString }}</p>
                </div>
            </div>

            <!-- Preview -->
            <article class="preview blog-content" v-html="preparedPost.body"></article>

            <!-- Action buttons -->
            <div class="buttons">

                <router-link :to="`post/${preparedPost.id}`">
                    <button class="button-primary icon"><i class="fas fa-fw fa-book"></i>Read more</button>
                </router-link>

                <router-link v-if="auth.user && ((auth.user.id === preparedPost.user.id) || auth.user.permissions.includes('administrate'))"
                             :to="`edit/${preparedPost.id}`">
                    <button class="button-secondary icon">
                        <i class="fas fa-fw fa-pen"></i>EDIT
                    </button>
                </router-link>

            </div>
        </div>
    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    import ProfilePicturePlaceholder from '../ui/ProfilePicturePlaceholder';
    import Clapper                   from './Clapper';

    export default {

        components: {ProfilePicturePlaceholder, Clapper},

        props: {
            post: {
                type: Object,
                required: true
            }
        },

        data() {
            return {};
        },

        computed: {

            preparedPost() {
                const {post} = this;

                // Convert timestamp to date
                const date = new Date(post.timestamp);
                post.date = {
                    day: String(date.getDate()).padStart(2, '0'),
                    month: date.toLocaleString('en-us', {month: 'short'}),
                    year: date.getFullYear()
                };

                return post;
            },

            ...mapState(['auth'])
        }
    };

</script>


<style lang="scss" scoped>

    .post-preview-card {
        @include flex(row);
        @include fixed-width(70%);
        margin-bottom: 9em;

        @include animate('0.5s ease-in-out') {
            from {
                transform: translateY(-0.5em) scale(0.97);
                opacity: 0;
            }
            to {
                transform: none;
                opacity: 1;
            }
        }

        > .lefty {
            position: relative;
            @include flex(column, center);
            padding-right: 2em;
            padding-bottom: 4em;
            margin-bottom: 3em;
            color: $palette-slate-gray;
            width: 5em;

            @include animate('0.5s ease-in-out') {
                from {
                    transform: translateX(0.75em);
                    opacity: 0;
                }
                to {
                    transform: none;
                    opacity: 1;
                }
            }

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

            .claps {
                @include flex(row, center);
                margin-top: 1.5em;
                user-select: none;

                span {
                    @include font(500, 0.85em);
                    margin-left: 0.5em;
                    margin-bottom: -2px;
                }
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
            min-width: 0;

            h2 {
                @include font(400);
                margin-bottom: 0.4em;
                line-height: 1.37em;
                opacity: 0.8;
            }

            .sub-area {
                @include flex(row, center);

                .profile-pic {
                    @include flex(row, center, center);
                    @include size(2.5em);
                    margin-right: 0.5em;
                    border-radius: 0.15em;
                    background: $palette-slate-gray;
                    overflow: hidden;

                    img {
                        @include size(100%);
                    }

                    .profile-picture-placeholder {
                        transform: scale(0.6);
                    }
                }

                .info {
                    @include font(500, 0.8em);
                    color: rgba(black, 0.3);

                    a {
                        color: rgba($palette-slate-gray, 0.8);
                    }

                    .sub {
                        margin-top: 0.45em;
                        font-size: 0.9em;
                    }
                }
            }

            .preview {
                position: relative;
                flex-grow: 0;
                @include font(400, 0.9em);
                white-space: pre-line;
                text-overflow: ellipsis;
                overflow: hidden;
                opacity: 0.9;
                max-height: 16em;
                min-width: 0;
                max-width: 100%;

                &::after {
                    @include pseudo();
                    @include position(0, 0, 0, 0);

                    // See https://stackoverflow.com/questions/11829410/css3-gradient-rendering-issues-from-transparent-to-white
                    background: linear-gradient(to top, $palette-snow-white, rgba(255, 255, 255, 0.000001) 15%);
                }

                /deep/ > * {
                    text-align: left !important;
                }
            }

            .buttons {
                margin-top: 0.5em;

                button {
                    margin-right: 0.5em;
                }
            }
        }
    }

    @include tablet {
        .post-preview-card {
            @include fixed-width(90%);
        }
    }

    @include mobile {
        .post-preview-card {
            @include fixed-width(100%);
            position: relative;
            padding: 3.5em 0 3em;
            margin: 0;

            > .lefty {
                display: none;
            }

            .content {
                padding: 0;
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

</style>
