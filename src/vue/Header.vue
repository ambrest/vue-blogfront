<template>
    <div :class="{header: 1, visible: $store.state.page.lastScrollDirection !== 'down'}">

        <div class="bar">

            <!-- Page title grabbed from the config file -->
            <router-link :class="{'title': 1, 'open-search-bar': showSearchBar}"
                         to="/">{{ config.pageTitle }}
            </router-link>

            <div class="search-bar">
                <i class="fas fa-fw fa-search" @click="toggleSearchBar"></i>
                <input ref="searchBarInput"
                       :class="{open: showSearchBar}"
                       type="text"
                       placeholder="Search..."
                       spellcheck="false"
                       @keyup="search">
            </div>

            <!-- Menu button on mobile devices -->
            <i class="menu fas fa-fw fa-bars" @click="menuOpen = true"></i>

            <!-- Menu -->
            <div :class="{links: 1, open: menuOpen}" @click="menuOpen = false">

                <!-- Visible as not-logged-in user -->
                <router-link v-if="!user" to="/login">Login</router-link>
                <router-link v-if="!user" to="/register">Register</router-link>

                <!-- Only visible with permission 'admin' -->
                <router-link v-if="user && user.permissions.includes('administrate')"
                             to="/admin">Admin</router-link>

                <!-- Only visible with permission 'post' -->
                <router-link v-if="user && user.permissions.includes('post')"
                             to="/new">New post</router-link>

                <!-- Visible if logged in -->
                <router-link v-if="user"
                             to="/settings">Settings</router-link>

                <router-link v-if="user"
                             to="/login"
                             @click.native="logout">Login </router-link>

                <router-link v-if="user"
                             to="me">Me </router-link>
            </div>
        </div>

    </div>
</template>

<script>

    export default {

        data() {
            return {
                menuOpen: false,
                showSearchBar: false
            };
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
            },

            toggleSearchBar() {
                this.showSearchBar = !this.showSearchBar;

                if (this.showSearchBar) {
                    this.$refs.searchBarInput.focus();
                }
            },

            search(e) {
                const query = e.target.value;

                if (e.key === 'Enter') {
                    this.$router.replace(query ? `/search?query=${query}` : '/');
                }
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

        .search-bar {
            @include flex(row, center);
            margin-left: auto;
            border-radius: 0.25em;
            align-self: stretch;
            min-height: 2em;

            i {
                font-size: 0.75em;
                margin: 0 0.5em;
                cursor: pointer;
            }

            input {
                color: white;
                width: 0;
                transition: all 0.3s;
                font-size: 0.9em;
                font-weight: 200;
                opacity: 0;

                &::placeholder {
                    color: rgba(white, 0.5);
                }

                &.open {
                    margin-left: 0.25em;
                    opacity: 1;
                    width: 10em;
                }
            }
        }

        .menu {
            display: none;
        }

        .links {
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
                    @include position(auto, auto, -5px, 0);
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

                i {
                    font-size: 1.15em;
                }
            }
        }
    }

    @include tablet {
        .header {
            opacity: 0;
            transform: translateY(-100%) rotateX(45deg);
            transition: all 0.3s;

            &.visible {
                opacity: 1;
                transform: none;
            }
        }

        .bar {
            width: 90vw;
        }
    }

    @include mobile {
        .bar {

            > i {
                font-size: 1.1em;
            }

            .title {
                @include font(300, 1.75em);
                position: absolute;
                transition: all 0.3s;

                &.open-search-bar {
                    pointer-events: none;
                    opacity: 0;
                }
            }

            .search-bar {
                flex-grow: 1;

                i {
                    margin: 0 0.75em 0 auto;
                    font-size: 1.1em;
                }

                input {
                    text-align: center;
                    font-size: 1.05em;

                    &.open {
                        width: 100%;
                    }
                }
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
