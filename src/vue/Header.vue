<template>
    <div class="header">

        <div class="bar">

            <!-- Page title grabbed from the config file -->
            <router-link class="h1" to="/">{{ config.pageTitle }}</router-link>

            <div class="links">

                <!-- Visible as not-logged-in user -->
                <router-link to="/">Home</router-link>
                <router-link v-if="!user" to="/login">Login</router-link>
                <router-link v-if="!user" to="/register">Register</router-link>

                <!-- Only visible with permission 'admin' -->
                <router-link v-if="user && user.permissions.includes('administrate')" to="/admin">Admin</router-link>

                <!-- Only visible with permission 'post' -->
                <router-link v-if="user && user.permissions.includes('post')" to="/new">New post</router-link>

                <!-- Visible if logged in -->
                <router-link v-if="user" to="/settings">Settings</router-link>
                <router-link v-if="user"
                             to="/login"
                             @click.native="logout">Logout
                </router-link>

            </div>
        </div>

    </div>
</template>

<script>

    export default {

        data() {
            return {};
        },

        computed: {
            user() {
                return this.$store.state.auth.user;
            }
        },

        methods: {
            logout() {

                // Remove credentials and go to login
                this.$store.dispatch('auth/logout').then(() => {
                    this.$router.push('/login');
                });
            }
        }

    };

</script>

<style lang="scss" scoped>

    .header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: $palette-sweet-red;
    }

    .bar {
        @include flex(row, center);
        @include width(70vw, 0, 1000px);
        margin: 1.5em auto;
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

                &.router-link-exact-active {
                    font-weight: 500;
                }
            }
        }
    }

</style>
