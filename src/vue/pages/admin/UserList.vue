<template>
    <div class="userlist" @contextmenu.prevent="">

        <text-input-field class="search-bar"
                          placeholder="Search users"
                          @update="updateSearchQuery"/>

        <!-- Table header -->
        <div v-if="filteredUsers.length" class="user header">
            <span class="index">Nr</span>
            <span class="fullname">Full Name</span>
            <span class="username">Username</span>
            <span class="email">E-Mail Address</span>

            <div class="permissions">Permissions</div>
        </div>

        <div class="users">

            <!-- Actual user list -->
            <div v-for="user of filteredUsers"
                 :class="{user: 1, deactivated: user.deactivated, selected: user === selectedUser}"
                 @click.right="openMenu($event, user)">

                <!-- General info -->
                <span class="index">#{{ String(users.indexOf(user)).padStart(3, '0') }}</span>
                <span class="fullname">{{ user.fullname }}</span>
                <span class="username">{{ user.username }}</span>
                <span class="email">{{ user.email }}</span>

                <!-- Permission tags -->
                <div class="permissions">
                    <span v-for="per of ['administrate', 'post','comment']"
                          :class="{active: user.permissions.includes(per)}"
                          @click="setPermission(user, per)">{{ per }}</span>
                </div>
            </div>

            <!-- Nothing here message if search failed -->
            <p v-if="!filteredUsers.length" class="empty-msg">Nothing found</p>
        </div>

        <p class="error">{{ errorMsg }}</p>

        <button class="download-btn button-primary icon" @click="downloadAsCSV">
            <i class="fas fa-fw fa-download"></i>
            <span>Download as CSV</span>
        </button>

        <context-menu ref="contextMenu" @close="selectedUser = null"/>

    </div>
</template>

<script>

    // Components
    import ContextMenu from './ContextMenu';

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {TextInputField, ContextMenu},

        data() {
            return {
                searchQuery: '',
                selectedUser: null,
                selectedUserIndex: -1,
                errorMsg: ''
            };
        },

        computed: {

            filteredUsers() {
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
            },

            ...mapState(['users'])

        },

        mounted() {
            this.errorMsg = '';
            this.$store.dispatch('users/update').catch(error => {
                this.errorMsg = error;
            });
        },

        methods: {

            openMenu(evt, user) {
                this.selectedUser = user;
                this.$refs.contextMenu.$emit('show', evt, user);
            },

            updateSearchQuery(query) {
                this.searchQuery = query;
            },

            setPermission(user, permission) {
                this.errorMsg = '';
                this.$store.dispatch('users/setPermission', {
                    user,
                    permission,
                    type: user.permissions.includes(permission) ? 'remove' : 'add'
                }).catch(error => {
                    this.errorMsg = error;
                });
            },

            downloadAsCSV() {
                let content = [];

                this.filteredUsers.forEach((usr, index) => {
                    const line = `${index};${usr.fullname};${usr.username};${usr.email};${usr.permissions.join('.')}`;
                    content.push(!index ? 'data:text/csv;charset=utf-8,' + line : line);
                });

                this.utils.download(encodeURI(content.join('\n')), 'userlist.csv');
            }
        }

    };

</script>

<style lang="scss" scoped>

    .userlist {
        @include flex(column);
        overflow: hidden;
    }

    .search-bar {
        flex-shrink: 0;
        margin-bottom: 1em;
    }


    .users {
        @include flex(column, center);
        flex-shrink: 0;
        cursor: default;

        .empty-msg {
            @include inline-flex(row, center);
            color: $palette-slate-gray;
            font-size: 1em;
            margin-top: 1em;
            flex-shrink: 0;

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
        padding: 0.35em 0;
        flex-shrink: 0;

        & > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 0.75em;
            transition: all 0.3s;
            padding-bottom: 0.25em;
        }

        .index {
            opacity: 0.95;
            flex-shrink: 0;
            width: 3em;
        }

        .fullname {
            position: relative;
            opacity: 1;
            width: 15%;
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
                padding: 0.3em 0.35em 0.15em;
                margin-left: 0.25em;
                margin-right: 0;
                color: $palette-decent-blue;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: capitalize;

                &.active {
                    color: white;
                    background: $palette-sweet-magenta;
                    border-color: $palette-sweet-magenta;
                }
            }
        }

        &.deactivated > span {
            color: $palette-sweet-red;
        }

        &.selected > span {
            color: $palette-cloud-blue;
        }

        &:nth-child(even):not(.header) {
            background: rgba($palette-slate-gray, 0.025);
        }

        &.header {
            font-weight: 500;
            margin-bottom: 1em;
        }
    }

    .download-btn {
        flex-shrink: 0;
        align-self: flex-end;
        margin-top: 1em;
        font-size: 0.7em;
    }

    @include mobile {
        .user {

            .index,
            .fullname,
            .email {
                display: none;
            }

            .username {
                flex-grow: 1;
            }
        }
    }

</style>
