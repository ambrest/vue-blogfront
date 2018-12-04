<template>
    <div class="header">

        <div class="bar">
            <router-link class="h1" to="/">Vue Blogfront</router-link>

            <div class="links">
                <router-link to="/">Home</router-link>
                <router-link to="/posts">Posts</router-link>
                <router-link to="/archieve">Archives</router-link>
                <router-link to="/login">Login</router-link>
                <router-link to="/register">Register</router-link>
            </div>
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

    .header {
        background: $palette-sweet-red;

        &::before {
            @include pseudo();
            @include position(0, 0, auto, 0);
            @include size(100%, 30vh);
            background: $palette-sweet-red;
            z-index: -1;
        }
    }

    .bar {
        @include flex(row, center);
        margin-top: 1.5em;
        color: white;

        .h1 {
            @include font(300, 1.75em);
        }

        .links {
            margin-left: auto;
            text-transform: uppercase;
            @include font(400, 0.8em);

            a {
                position: relative;
                margin-left: 1em;

                &::before {
                    @include pseudo();
                    @include position(auto, auto, -2px, 0);
                    @include size(100%, 2px);
                    transition: all 0.3s;
                    background: $palette-snow-white;
                    transform: translateY(0.25em);
                    opacity: 0;
                }

                &:hover::before {
                    transform: none;
                    opacity: 1;
                }
            }
        }
    }

</style>
