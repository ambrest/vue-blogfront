<template>
    <div id="app">
        <page-header></page-header>
        <router-view class="router"></router-view>
    </div>
</template>

<script>

    // Global filters
    import '../vue-extensions/filters';

    // Global directives
    import '../vue-extensions/directives';

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    // Components
    import PageHeader from './pages/PageHeader';

    export default {

        components: {PageHeader},

        data() {
            return {};
        },

        mounted() {

            // Update posts
            this.$store.dispatch('posts/update');
        }
    };
</script>


<style lang="scss">

    // Some resets
    button,
    textarea,
    input {
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
        position: fixed;
        background: $palette-snow-white;
        font-family: $font-family;
    }

    #app {
        @include width(70vw, 0, 1000px);
        margin: 0 auto;

        .router {
            margin-top: 10vh;
            background: $palette-snow-white;
            box-shadow: 0 5px 30px rgba(black, 0.075);
            border-radius: 0.25em;
            padding: 0.5em 0.75em;
            min-height: 50vh;
            max-height: 80vh;
            overflow: auto;

            @include animate('0.5s') {
                from {
                    opacity: 0;
                    transform: translateY(-0.5em);
                }
                to {
                    opacity: 1;
                    transform: none;
                }
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
