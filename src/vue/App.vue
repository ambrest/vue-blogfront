<template>
    <div id="app">
        Hello World
    </div>
</template>

<script>

    // Global filters
    import '../vue-extensions/filters';

    // Global directives
    import '../vue-extensions/directives';

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    export default {

        components: {},

        data() {
            return {};
        }
    };
</script>


<style lang="scss">

    // Some resets
    button,
    textarea,
    input {
        font-family: $font-family-open-sans;
        outline: none;
        border: none;
        background: transparent;
    }

    a {
        color: inherit;
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
        background: $palette-snow-white;
    }

    // Font awesome default size
    [class^='fa'] {
        font-size: 20px;
        line-height: 1;
        flex-shrink: 0;
    }
</style>
