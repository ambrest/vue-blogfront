<template>
    <div id="app">

        <!-- Actual app -->
        <page-header class="header"></page-header>

        <div class="view">
            <loading-screen class="loader"></loading-screen>
            <router-view class="router"></router-view>
        </div>

    </div>
</template>

<script>

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    // Components
    import PageHeader    from './pages/PageHeader';
    import LoadingScreen from './screens/LoadingScreen';

    export default {

        components: {PageHeader, LoadingScreen},

        data() {
            return {};
        },

        mounted() {
            const apikey = localStorage.getItem('apikey');

            if (apikey) {
                this.$store.dispatch('auth/key', {apikey}).catch(() => 0);
            }
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

        .header {
            width: 100%;
        }

        .view {
            @include flex(column, center);
            position: relative;
            margin-top: 10vh;
            width: inherit;
            max-width: inherit;
            height: inherit;
            max-height: initial;
            @include width(70vw, 0, 1000px);
        }

        .loader {
            border-radius: 0.25em;
        }
    }


    .router {
        @include inline-flex(column, center);
        @include width(auto, 0, 1000px);
        background: $palette-snow-white;
        border-radius: 0.25em;
        box-shadow: 0 5px 30px rgba(black, 0.075);
        padding: 3em 5em;

        @include animate('0.75s') {
            from {
                opacity: 0;
                transform: translateY(-0.75em);
            }
            to {
                opacity: 1;
                transform: none;
            }
        }

        > h1 {
            position: relative;
            @include font(500, 1.15em);
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

    // Font awesome default size
    [class^='fa'] {
        font-size: 20px;
        line-height: 1;
        flex-shrink: 0;
    }
</style>
