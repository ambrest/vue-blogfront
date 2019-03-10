<template>
    <div class="clapper"
         @click="clap">

        <div :class="{claps: 1, active: !updateDone}">
            <span>+ {{ claps }}</span>
        </div>

        <svg :class="{active: clickActive, 'limit-reached': limitReached}"
             viewBox="0 0 27 27"
             xmlns="http://www.w3.org/2000/svg"
             @animationend="clickActive = limitReached = false">

            <path d="M13.738 1l.762 2.966L15.262 1z"></path>
            <path d="M18.634 2.224l-1.432-.47-.408 3.022z"></path>
            <path d="M11.79 1.754l-1.431.47 1.84 2.552z"></path>
            <path
                d="M24.472 14.307l-3.023-5.32c-.287-.426-.689-.705-1.123-.776a1.16 1.16 0 0 0-.911.221c-.297.231-.474.515-.535.84.017.022.036.04.053.063l2.843 5.001c1.95 3.564 1.328 6.973-1.843 10.144a8.46 8.46 0 0 1-.549.501c1.205-.156 2.328-.737 3.351-1.76 3.268-3.268 3.041-6.749 1.737-8.914"></path>
            <path d="M14.58 10.887c-.156-.83.096-1.569.692-2.142L12.78 6.252c-.5-.504-1.378-.504-1.879 0-.178.18-.273.4-.329.63l4.008 4.005z"></path>
            <path
                d="M17.812 10.04c-.218-.323-.539-.55-.88-.606a.814.814 0 0 0-.644.153c-.176.137-.713.553-.24 1.566l1.43 3.025a.539.539 0 1 1-.868.612L9.2 7.378a.986.986 0 1 0-1.395 1.395l4.401 4.403a.538.538 0 1 1-.762.762L7.046 9.54 5.802 8.295a.99.99 0 0 0-1.396 0 .981.981 0 0 0 0 1.394l1.241 1.241 4.402 4.403a.537.537 0 0 1 0 .761.535.535 0 0 1-.762 0L4.89 11.696a.992.992 0 0 0-1.399-.003.983.983 0 0 0 0 1.395l1.855 1.854 2.763 2.765a.538.538 0 0 1-.76.761l-2.765-2.764a.982.982 0 0 0-1.395 0 .989.989 0 0 0 0 1.395l5.32 5.32c3.371 3.372 6.64 4.977 10.49 1.126C21.74 20.8 22.271 18 20.62 14.982l-2.809-4.942z"></path>
        </svg>

        <!-- TODO: Remove elements after a specific time -->
        <div v-for="transform of transforms"
             :style="{transform}"
             class="frame">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>

    </div>
</template>

<script>

    export default {

        props: {
            startValue: {
                type: Number,
                default: 0
            },
            limit: {
                type: Number,
                required: true
            }
        },

        data() {
            return {
                claps: this.startValue,
                lastUpdateClaps: 0,
                transforms: [],
                clickActive: false,
                updateTimer: null,
                updateDone: true,
                limitReached: false
            };
        },

        methods: {

            clap() {

                // Stop / replay animation if user clicked multiple times
                if (this.clickActive) {
                    this.clickActive = false;
                    requestAnimationFrame(() => this.clickActive = true);
                } else {
                    this.clickActive = true;
                }

                // Validate clap limit
                if (this.claps < this.limit) {
                    this.claps++;

                    // Emit clap event
                    this.$emit('clap');

                    // Add new transformation
                    this.transforms.push(`rotate(${Math.random() * 360}deg)`);

                    // Reset and re-create timer to sync clapps with server
                    clearTimeout(this.updateTimer);
                    this.updateDone = false;
                    this.updateTimer = setTimeout(() => {

                        // Update is done (for now)
                        this.updateDone = true;

                        // Fire update event with clap diff
                        this.$emit('update', this.claps - this.lastUpdateClaps);

                        // Remember last claps
                        this.lastUpdateClaps = this.claps;

                        // Clear transform array
                        this.transforms = [];
                    }, 1000);
                } else {
                    this.limitReached = true;
                }
            },

            removeTransform(i) {
                this.transforms.splice(i, 1);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .clapper {
        position: relative;
        @include flex(row, center, center);
        @include size(38px);
        border-radius: 100%;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {

            svg {
                fill: $palette-sweet-red;
            }
        }

        svg {
            @include size(25px);
            fill: $palette-slate-gray;
            transition: fill 0.3s, transform 0.15s;
            z-index: 1;

            &.active {
                @include animate('0.3s') {
                    from {
                        transform: none;
                    }
                    50% {
                        transform: scale(1.25) translateY(-1px);
                    }
                    to {
                        transform: none;
                    }
                }
            }

            &.limit-reached {
                @include animate('1s linear') {
                    10%, 90% {
                        transform: translate3d(-1px, 0, 0);
                    }
                    20%, 80% {
                        transform: translate3d(2px, 0, 0);
                    }
                    30%, 50%, 70% {
                        filter: grayscale(1);
                        transform: translate3d(-4px, 0, 0);
                    }
                    40%, 60% {
                        transform: translate3d(4px, 0, 0);
                    }
                }
            }
        }

        .claps {
            position: absolute;
            @include flex(row, center, center);
            @include position(-30px, 0, auto, 0);
            @include size(30px);
            @include font(500, 0.75em);
            margin: 0 auto;
            background: $palette-sweet-red;
            border-radius: 100%;
            color: white;
            opacity: 0;
            transform: translateY(0.5em);
            transition: all 0.2s ease-in-out;
            box-shadow: 0 1px 4px rgba($palette-slate-gray, 0.25);

            span {
                margin-top: 0.1em;

                &:first-letter {
                    margin-right: -0.2em;
                }
            }

            &.active {
                opacity: 1;
                transform: none;
            }
        }

        .frame {
            position: absolute;
            @include position(0, 0, 0, 0);
            margin: auto;

            div {
                position: absolute;
                @include position(0, 0, 0, 0);
                @include size(5px);
                margin: auto;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 8px solid $palette-sweet-red;
                border-bottom: 4px solid transparent;
                opacity: 0.4;

                &::after {
                    @include pseudo();
                    @include position(0, 0, 0, 0);
                    @include size(4px);
                    background: $palette-sweet-magenta;

                    @include animate('1.5s forwards') {
                        to {
                            transform: scale(1.05) rotate(45deg) translate(-10px, -25px);
                        }
                    }
                }

                &:nth-child(1) {
                    @include animate('1.5s forwards') {
                        from {
                            transform: translate(0, 0) rotate(0);
                        }
                        to {
                            transform: translate(0, -50px) rotate(90deg) scale(0.96);
                            opacity: 0;
                        }
                    }
                }

                &:nth-child(2) {
                    @include animate('1.5s forwards') {
                        from {
                            transform: translate(0, 0) rotate(-55deg);
                        }
                        to {
                            transform: translate(-50px, -25px) rotate(-145deg) scale(1.1);
                            opacity: 0;
                        }
                    }
                }

                &:nth-child(3) {
                    @include animate('1.5s forwards') {
                        from {
                            transform: translate(0, 0) rotate(55deg);
                        }
                        to {
                            transform: translate(50px, -25px) rotate(145deg) scale(1.07);
                            opacity: 0;
                        }
                    }
                }

                &:nth-child(4) {
                    @include animate('1.5s forwards') {
                        from {
                            transform: translate(0, 0) rotate(135deg);
                        }
                        to {
                            transform: translate(35px, 40px) rotate(225deg) scale(0.93);
                            opacity: 0;
                        }
                    }
                }

                &:nth-child(5) {
                    @include animate('1.5s forwards') {
                        from {
                            transform: translate(0, 0) rotate(-135deg);
                        }
                        to {
                            transform: translate(-35px, 40px) rotate(-225deg) scale(1.02);
                            opacity: 0;
                        }
                    }
                }
            }
        }
    }

</style>
