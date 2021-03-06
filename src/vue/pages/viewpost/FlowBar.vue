<template>
    <div class="flow-bar">
        <div :class="{visible: $store.state.page.lastScrollDirection === 'up'}">
            <a :href="share.twitter" target="_blank"><i class="share-btn fab fa-fw fa-twitter" style="color: #1da1f2"></i></a>
            <a :href="share.facebook" target="_blank"><i class="share-btn  fab fa-fw fa-facebook" style="color: #3a559f"></i></a>
            <a :href="share.telegram" target="_blank"><i class="share-btn  fab fa-fw fa-telegram" style="color: #269ed2"></i></a>
            <a :href="share.whatsapp" target="_blank"><i class="share-btn  fab fa-fw fa-whatsapp" style="color: #00e676"></i></a>

            <div class="divider"></div>

            <div class="clap-count">
                <clapper :post="post" :limit="50"/>
                <span class="claps">{{ post.totalClaps || '' }}</span>
            </div>
        </div>
    </div>
</template>

<script>

    import Clapper from '../../components/Clapper';

    export default {

        components: {Clapper},

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
            }
        }
    };

</script>

<style lang="scss" scoped>

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

    @include MQDesktop {

        .flow-bar {
            position: fixed;
            @include flex(row, center, center);
            @include position(auto, 0, 0, 0);
            z-index: 10;
            width: 100%;

            > div {
                @include flex(row, center, space-around);
                margin-bottom: 1vh;
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

                a,
                .clap-count {
                    margin: 0 1em;
                }

                .clap-count {
                    flex-direction: row;

                    .claps {
                        margin-bottom: -1px;
                    }
                }
            }
        }
    }

    @include MQPhones {
        .flow-bar > div {
            margin-bottom: 0;
            width: 100%;
        }
    }

</style>
