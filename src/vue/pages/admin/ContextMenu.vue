<template>
    <div ref="menuRoot"
         :class="{menu: 1, open}"
         :style="style">

        <div class="option disable"
             @click="toggleDeactivated">
            <i :class="`fas fa-fw fa-${user.deactivated ? 'check' : 'times'}`"></i>
            <span class="name">{{ user.deactivated ? 'Enable' : 'Disable' }}</span>
        </div>

    </div>
</template>


<script>

    export default {

        data() {
            return {
                open: false,
                type: '',
                user: {},
                style: {}
            };
        },

        mounted() {
            this.utils.on(window, ['scroll', 'blur', 'keydown'], () => this.close());

            // Function to check, if menu is open, if the user has clicked
            // outside of the menu. Only active is menu is visible.
            const detectOutsideClick = evt => {
                if (!this.utils.eventPath(evt).includes(this.$refs.menuRoot)) {
                    this.close();
                }
            };

            /**
             *  Event to show the menu.
             *  Nodes is an array of currently selected nodes and
             *  evt the mouseevent (contextmenu)
             */
            this.$on('show', (evt, user) => {

                // Set listener for out-of-bounds clicks
                window.addEventListener('mousedown', detectOutsideClick);

                // Set postion
                this.style.left = `${evt.clientX + 5}px`;
                this.style.top = `${evt.clientY + 5}px`;
                this.user = user;
                this.open = true;
            });

            // Event to hide the menu
            this.$on('hide', () => {
                window.removeEventListener('mousedown', detectOutsideClick);
                this.close();
            });
        },

        methods: {

            toggleDeactivated() {

                this.$store.dispatch('users/setDeactivated', {
                    user: this.user,
                    deactivated: !this.user.deactivated
                });

                this.close();
            },

            close() {
                this.open = false;
                this.user = {};
                this.$emit('close');
            }
        }
    };

</script>


<style lang="scss" scoped>

    .menu {
        @include flex(column);
        position: fixed;
        opacity: 0;
        transition: opacity 0.1s;
        pointer-events: none;
        background: white;
        padding: 0.5em 0.25em;
        box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.1);
        border-radius: 0.15em;

        &:empty {
            display: none;
        }

        &.open {
            opacity: 1;
            pointer-events: all;
        }

        .option {
            @include flex(row, center);
            padding: 0.35em 1em;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.3s;
            color: $palette-slate-gray;
            margin: 0.25em 0;

            i {
                font-size: 1em;
            }

            .name {
                @include font(500, 1em);
                margin: 0 0.25em 0 0.75em;
            }

            &:hover {
                color: $palette-sweet-red;
            }
        }
    }

</style>
