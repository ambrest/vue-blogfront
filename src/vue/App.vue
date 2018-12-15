<template>
    <div id="app">

        <!-- Header -->
        <page-header class="header"></page-header>

        <!-- Router and loading screen -->
        <router-view :class="{router: 1, inactive: $store.state.requestActive}"></router-view>
        <loading-screen class="loader"></loading-screen>

        <!-- Footer -->
        <page-footer :class="{footer: 1, inactive: $store.state.requestActive}"></page-footer>

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
    import LoadingScreen from './screens/LoadingScreen';

    export default {

        components: {PageHeader, PageFooter, LoadingScreen},

        data() {
            return {};
        }
    };
</script>


<style lang="scss">

    // Some resets
    button,
    textarea,
    input,
    [contenteditable] {
        font-family: $font-family;
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
    html,
    body {
        height: 100%;
        width: 100%;
    }

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

    .header {
        width: 100%;
    }

    .footer {
        transition: all 0.3s;
        opacity: 1;

        &.inactive {
            opacity: 0;
        }
    }

    .router {
        @include inline-flex(column, center);
        margin-top: 10vh;
        transition: all 0.3s;

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

            > h1 {
                position: relative;
                @include font(500, 1.25em);
                margin-bottom: 3em;
                flex-shrink: 0;
                opacity: 0.85;
                width: 100%;
                text-align: center;

                &::after {
                    @include pseudo();
                    @include position(auto, 0, -1em, 0);
                    @include size(3em, 1px);
                    margin: 0 auto;
                    background: $palette-decent-blue;
                }
            }
        }

        @include animate('0.4s ease-in-out') {
            from {
                transform: translateY(-0.5em);
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

</style>
