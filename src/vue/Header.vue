<template>
    <div class="header">

        <div class="bar">

            <!-- Page title grabbed from the config file -->
            <router-link class="title" to="/">{{ config.pageTitle }}</router-link>

            <!-- Menu button on mobile devices -->
            <i class="menu fas fa-fw fa-bars" @click="menuOpen = true"></i>

            <!-- Menu -->
            <div :class="{links: 1, open: menuOpen}">

                <!-- Visible as not-logged-in user -->
                <router-link to="/" @click.native="menuOpen = false">Home</router-link>
                <router-link v-if="!user"
                             to="/login"
                             @click.native="menuOpen = false">Login
                </router-link>
                <router-link v-if="!user"
                             to="/register"
                             @click.native="menuOpen = false">Register
                </router-link>

                <!-- Only visible with permission 'admin' -->
                <router-link v-if="user && user.permissions.includes('administrate')"
                             to="/admin"
                             @click.native="menuOpen = false">Admin
                </router-link>

                <!-- Only visible with permission 'post' -->
                <router-link v-if="user && user.permissions.includes('post')"
                             to="/new"
                             @click.native="menuOpen = false">New post
                </router-link>

                <!-- Visible if logged in -->
                <router-link v-if="user"
                             to="/settings"
                             @click.native="menuOpen = false">Settings
                </router-link>
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
            return {
                menuOpen: false
            };
        },

        computed: {
            user() {
                return this.$store.state.auth.user;
            }
        },

        methods: {
            logout() {
                this.menuOpen = false;

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

        .title {
            @include font(300, 1.75em);
            @include animate('0.75s ease-in-out') {
                from {
                    transform: translateX(-0.25em);
                    opacity: 0;
                }
                to {
                    transform: none;
                    opacity: 1;
                }
            }
        }

        .menu {
            display: none;
            margin-left: auto;
        }

        .links {
            margin-left: auto;
            text-transform: uppercase;
            @include font(400, 0.8em);

            a {
                display: inline-block;
                position: relative;
                margin-left: 1em;
                transform: translateY(-0.25em);
                opacity: 0;

                @include sequentialAnimationDelay(10, 0.15s);
                @include animate('0.3s ease-in-out forwards') {
                    to {
                        transform: none;
                        opacity: 1;
                    }
                }

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

    @include tablet {
        .bar {
            width: 95vw;
        }
    }

    @include mobile {
        .bar {

            .title {
                @include font(300, 1.75em);
            }

            .menu {
                display: block;
            }

            .links {
                position: fixed;
                @include position(0, 0, 0, 0);
                @include flex(column, center, center);
                background: rgba(black, 0.75);
                opacity: 0;
                transform: translateY(-0.5em);
                pointer-events: none;
                transition: all 0.3s;

                &.open {
                    opacity: 1;
                    transform: none;
                    pointer-events: all;

                    a {
                        @include sequentialAnimationDelay(10, 0.075s);
                        @include animate('0.3s ease-in-out forwards') {
                            to {
                                transform: none;
                                opacity: 1;
                            }
                        }
                    }
                }

                a {
                    transition: all 0.3s;
                    margin: 1em 0;
                    background: $palette-sweet-red;
                    padding: 1.5em 0;
                    width: 50%;
                    text-align: center;
                    animation: none;

                    &::before {
                        content: none;
                    }

                    &.router-link-exact-active {
                        font-weight: 500;
                    }
                }
            }
        }
    }

</style>
