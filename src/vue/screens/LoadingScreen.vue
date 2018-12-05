<template>
    <div :class="{'loader': 1, open}">
        <div class="box"></div>
        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                open: false,
                message: ''
            };
        },

        mounted() {

            /**
             * Currently vuex does not support before and after
             * callbacks on actions.
             * See issue https://github.com/vuejs/vuex/issues/1098 and related PR: https://github.com/vuejs/vuex/pull/1115
             *
             * To implement a reasonable loader which appears on each action (and closes
             * if it's getting resolved) I need to override the dispatch function.
             *
             * @type {Dispatch}
             */
            const dispatch = this.$store.dispatch;
            this.$store.dispatch = (type, payload) => new Promise((resolve, reject) => {

                /**
                 * VueJs's watchers have some delay and I
                 * currently don't know a better solution as
                 * appending the class directly.
                 */
                this.open = true;
                this.message = this.randomMessage();

                // Wait untile browser repaints
                requestAnimationFrame(() => {

                    // Wait until class has been appendet and element has been drawn
                    requestAnimationFrame(() => {

                        // Dispatch original data and hide loading screen after execution
                        dispatch(type, payload).then(value => {
                            resolve(value);
                            this.open = false;
                        }).catch(reason => {
                            reject(reason);
                            this.open = false;
                        });
                    });
                });
            });
        },

        methods: {
            randomMessage() {
                const msgs = this.config.loadingScreenMessages;

                if (Array.isArray(msgs)) {
                    return msgs[Math.floor(Math.random() * msgs.length)] + '...';
                } else {
                    return msgs ? msgs + '...' : '';
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    $big-border-radius: 2em;
    $small-border-radius: 0.15em;
    $jump-height: 0.25em;

    .loader {
        position: absolute;
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        background: $palette-snow-white;
        z-index: 100;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;

        &.open {
            opacity: 1;
            pointer-events: all;

            // Play animation only if visible
            .box {
                animation-play-state: running;
            }
        }
    }

    .box {
        position: relative;
        @include size(2.5em);
        background: $palette-sweet-magenta;
        animation-play-state: paused;

        $perspective: 5em;
        @include animate('3s ease-in-out infinite') {
            0% {
                transform: perspective($perspective);
            }
            25% {
                transform: perspective($perspective) rotateX(180deg) rotateY(0);
            }
            50% {
                transform: perspective($perspective) rotateX(180deg) rotateY(180deg);
            }
            75% {
                transform: perspective($perspective) rotateX(0) rotateY(180deg);
            }
            100% {
                transform: perspective($perspective) rotateX(0) rotateY(0);
            }
        }
    }

    .message {
        @include font(500, 0.85em);
        margin-top: 1.75em;
        font-style: italic;
        color: $palette-sweet-magenta;
        transform: translateY(-0.5em);
    }

</style>
