<template>
    <div :class="{'loader': 1, open: $store.state.requestsActive}">

        <div class="box-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
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
        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    $big-border-radius: 2em;
    $small-border-radius: 0.15em;
    $jump-height: 0.25em;

    .loader {
        position: fixed;
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        @include size(20em, 20em);
        margin: 12vh auto auto auto;
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

    .box-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 2px;

        > div {
            @include size(7px);
            background: $palette-sweet-red;
            animation-play-state: paused;

            @include animate('6s infinite') {
                0%, 60%, 100% {
                    opacity: 1;
                    transform: none;
                }
                10%, 49.999% {
                    opacity: 0;
                    transform: translateY(0.5em);
                }
            }

            @for $i from 0 through 9 {
                &:nth-child(#{$i}) {
                    animation-delay: #{$i * 300ms};
                }
            }
        }

        &.open {
            animation-play-state: running;
        }
    }

</style>
