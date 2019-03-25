<template>
    <div :class="{'popup-dialog': 1, open: popupDialog.open}">

        <div class="content">

            <div class="header">
                <i class="fas fa-fw fa-question-circle"></i>
                <h1> {{ popupDialog.title }}</h1>
            </div>

            <p v-if="popupDialog.text">{{ popupDialog.text }}</p>

            <div class="actions">
                <button v-for="(btn, index) of popupDialog.buttons"
                        :class="`button-${btn.class}`"
                        @click="close(index)">{{ btn.text }}
                </button>
            </div>
        </div>

    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            return {};
        },

        computed: {
            ...mapState(['popupDialog'])
        },

        methods: {
            close(index) {
                this.popupDialog.close(index);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .popup-dialog {
        position: fixed;
        @include position(0, 0, 0, 0);
        @include flex(column, center, center);
        background: rgba($palette-slate-gray, 0.05);
        opacity: 0;
        transition: all 0.3s;
        pointer-events: none;
        z-index: 1000;

        &.open {
            opacity: 1;
            pointer-events: all;

            .content {
                opacity: 1;
                transform: none;
            }
        }
    }

    .content {
        @include width(50vw, 5em, 25em);
        background: $palette-snow-white;
        color: $palette-slate-gray;
        padding: 0.75em 1.25em;
        border-radius: 0.15em;
        box-shadow: 0 0.4em 1.5em rgba($palette-slate-gray, 0.075);
        opacity: 0;
        transform-origin: top center;
        transform: translateY(-0.5em) rotateX(35deg);
        transition: all 0.3s;

        .header {
            @include flex(row, center);

            h1 {
                @include font(500, 1.075em);
            }

            i {
                font-size: 0.95em;
                margin-right: 0.5em;
            }
        }

        p {
            @include font(500, 0.96em);
            margin: 1.25em 0;
            line-height: 1.5em;
        }

        .actions {
            @include flex(row, center, flex-end);
            font-size: 0.95em;

            button {
                margin-left: 1.5em;
                text-transform: capitalize;
            }
        }
    }

    @include mobile {
        .content {
            max-width: 90vw;
            width: 90vw;
        }
    }

</style>
