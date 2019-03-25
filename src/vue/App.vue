<template>
    <div id="app">

        <!-- Header -->
        <page-header class="page-header"/>

        <!-- Router -->
        <router-view :class="{router: 1, inactive: $store.state.requestsActive}" :key="$route.fullPath"/>

        <!-- Footer -->
        <page-footer v-show="!$store.state.requestsActive" class="footer"/>

        <!-- Loading screen, popupDialog box -->
        <loading-screen/>
        <popup-dialog/>

    </div>
</template>

<script>

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    // Normalize css to look (almost) equal on all browsers
    import 'normalize.css';

    // Components
    import PageHeader    from './Header';
    import PageFooter    from './Footer';
    import LoadingScreen from './overlays/LoadingScreen';
    import PopupDialog   from './overlays/PopupDialog';

    export default {

        components: {PageHeader, PageFooter, LoadingScreen, PopupDialog},

        data() {
            return {};
        },

        mounted() {

            // Scroll to top on route change
            this.$router.afterEach(() => window.scrollTo(0, 0));

            // Init page state
            this.$store.commit('page/_init');
        }
    };
</script>


<style lang="scss">

    // Some resets
    button,
    textarea,
    input,
    [contenteditable] {
        outline: none;
        border: none;
        background: transparent;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    button {
        cursor: pointer;
    }

    b {
        font-weight: 500;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    ::-webkit-scrollbar {
        width: 0.3em;
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: lighten($palette-grayish-blue, 10);
        border-radius: 0;
    }

    // Actual app layout
    body {
        background: $palette-snow-white;
        font-family: $font-family;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 0.75em;
            background: initial;
        }

        &::-webkit-scrollbar-thumb {
            background-color: lighten($palette-grayish-blue, 10);
            border-radius: 0;
        }
    }

    #app {
        @include flex(column, center);
        margin: 0 auto;
        min-height: 100vh;
        padding-bottom: 1em;

        &::before {
            @include pseudo();
            @include position(0, 0, auto, 0);
            @include size(100%, 30vh);
            background: $palette-sweet-red;
            z-index: -1;
        }
    }

    .page-header {
        width: 100%;
    }

    .router {
        @include inline-flex(column, center);
        margin-top: 10vh;
        transition: all 0.3s;
        transform-origin: center top;
        max-width: 100vw;

        &.inactive {
            pointer-events: none;
            filter: grayscale(1) blur(0.5px);
        }

        &.divided .tab,
        &:not(.divided) {
            position: relative;
            @include inline-flex(column, center);
            @include width(null, 0, 1000px);
            background: $palette-snow-white;
            border-radius: 0.25em;
            box-shadow: 0 5px 30px rgba(black, 0.075);
            padding: 3em 5em;

            &.small {
                padding: 3em 4em;
            }

            /**
             * H1 is for a single header text,
             * a header container is to add additional content like icons etc.
             */
            > h1,
            > .header {
                @include font(400, 1.25em);
                position: relative;
                margin-bottom: 3em;
                flex-shrink: 0;
                opacity: 0.85;
                text-align: center;
                width: 100%;

                &::after {
                    @include pseudo();
                    @include position(auto, 0, -1em, 0);
                    @include size(3em, 1px);
                    margin: 0 auto;
                    background: $palette-decent-blue;
                }

                @include animate('0.5s ease-in-out') {
                    from {
                        transform: translateY(-0.35em);
                        opacity: 0;
                    }
                    to {
                        transform: none;
                        opacity: 1;
                    }
                }
            }

            > .header {
                @include flex(row, center, center);

                .icon {
                    cursor: pointer;
                    color: $palette-sweet-red;
                    font-size: 0.7em;
                    margin-left: 0.5em;
                }
            }
        }

        @include animate('0.4s ease-in-out') {
            from {
                transform: translateY(-0.75em) scale(0.985);
                opacity: 0;
            }
        }
    }

    // Font awesome default size
    [class^='fa'] {
        font-size: 20px;
        line-height: 1;
        flex-shrink: 0;
    }

    @include tablet {
        .router {
            &:not(.small):not(.divided) {
                padding-left: 2em;
                padding-right: 2em;
            }
        }
    }

    @include mobile {
        .router {
            margin-top: 2.5vh;

            &.divided .tab {
                width: 100vw;
            }

            &.divided .tab,
            &:not(.small):not(.divided) {
                padding-left: 1em;
                padding-right: 1em;

                > h1 {
                    margin-bottom: 1.75em;
                }
            }
        }
    }

</style>
