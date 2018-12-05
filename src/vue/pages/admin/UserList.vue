<template>
    <div class="userlist">

        <text-input-field class="search-bar"
                          placeholder="Search users"
                          @update="updateSearchQuery"></text-input-field>


        <!-- Table header -->
        <div v-if="users.length" class="user header">
            <span class="index">Nr</span>
            <span class="fullname">Full Name <small>(click to disable account)</small></span>
            <span class="username">Username</span>
            <span class="email">E-Mail Address</span>

            <div class="permissions">Permissions</div>
        </div>

        <div class="scroll-wrapper">
            <div class="users">

                <!-- Actual user list -->
                <div v-for="(user, index) of users" :class="{user: 1, disabled: user.disabled}">

                    <span class="index">#{{ String(index).padStart(3, '0') }}</span>

                    <span class="fullname">{{ user.fullname }}</span>
                    <span class="username">{{ user.username }}</span>
                    <span class="email">{{ user.email }}</span>

                    <div class="permissions">
                        <span v-for="per of config.availableUserPermissions"
                              :class="{active: user.permissions.includes(per)}"
                              @click="setPermissions(user, per)">{{ per }}</span>
                    </div>
                </div>

                <!-- Nothing here message if search failed -->
                <p v-if="!users.length" class="empty-msg">Nothing found</p>
            </div>
        </div>

    </div>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    export default {

        components: {TextInputField},

        data() {
            return {
                searchQuery: '',
                selectedUser: null
            };
        },

        computed: {

            users() {
                const {searchQuery} = this;
                const {users} = this.$store.state;

                if (searchQuery) {

                    // Apply search query
                    return users.filter(v =>
                        v.fullname.includes(searchQuery) ||
                        v.username.includes(searchQuery) ||
                        v.email.includes(searchQuery)
                    );
                } else {
                    return users;
                }
            }

        },

        mounted() {
            this.$store.dispatch('users/update');
        },

        methods: {

            updateSearchQuery(query) {
                this.searchQuery = query;
            },

            setPermissions(user, permission) {
                if (user.permissions.includes(permission)) {
                    this.$store.dispatch('users/setPermissions', {user, remove: [permission]});
                } else {
                    this.$store.dispatch('users/setPermissions', {user, add: [permission]});
                }
            },

            setDisabled(user) {
                this.$store.dispatch('users/setDisabled', {user, disabled: !user.disabled});
            }
        }

    };

</script>

<style lang="scss" scoped>

    .userlist {
        @include flex(column);
    }

    .search-bar {
        flex-shrink: 0;
        margin-bottom: 1em;
    }

    .scroll-wrapper {
        overflow: auto;
    }

    .users {
        @include flex(column, center);
        flex-shrink: 0;

        .empty-msg {
            @include inline-flex(row, center);
            color: $palette-slate-gray;
            font-size: 1em;
            margin-top: 1em;

            i {
                font-size: 1.2em;
                margin-top: 0.1em;
                margin-left: 0.25em;
            }
        }
    }


    .user {
        @include flex(row, center);
        @include font(400, 13px);
        width: 100%;
        margin-bottom: 0.3em;
        padding-bottom: 0.3em;
        border-bottom: 1px solid rgba($palette-slate-gray, 0.05);
        flex-shrink: 0;

        & > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 0.75em;
            transition: all 0.3s;
        }

        .index {
            opacity: 0.95;
            flex-shrink: 0;
            width: 3em;
        }

        .fullname {
            cursor: pointer;
            position: relative;
            opacity: 1;
            width: 25%;
        }

        .username {
            opacity: 0.8;
            width: 20%;
        }

        .email {
            opacity: 0.8;
            width: 25%;
        }

        .permissions {
            @include flex(row, center);
            margin-left: auto;
            margin-right: 0.5em;

            span {
                @include font(500, 0.85em);
                border: 1px solid $palette-decent-blue;
                border-radius: 0.15em;
                padding: 0.15em 0.35em 0.15em 0.35em;
                margin-left: 0.25em;
                margin-right: 0;
                color: $palette-decent-blue;
                cursor: pointer;
                transition: all 0.3s;

                &.active {
                    color: white;
                    background: $palette-sweet-magenta;
                    border-color: $palette-sweet-magenta;
                }
            }
        }

        &.disabled {
            color: $palette-sweet-red;
        }

        &:nth-last-child(1) {
            border-bottom: none;
        }

        &.header {
            font-weight: 500;
            margin-bottom: 1em;
        }
    }

</style>
