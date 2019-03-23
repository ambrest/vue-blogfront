<template>
    <div class="tab-buttons">

        <button v-for="(label, index) of labels"
                :class="{selected: index === active}"
                @click="select(label, index)">{{ label }}
        </button>

    </div>
</template>

<script>

    export default {
        props: {
            labels: {type: Array, required: true},
            selected: {type: Number, default: 0}
        },

        data() {
            return {
                active: this.selected
            };
        },

        methods: {

            select(label, index) {
                this.$emit('select', {label, index});
                this.active = index;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .tab-buttons {
        border-radius: 0.1em;
        overflow: hidden;

        button {
            @include font(500, 0.85em);
            position: relative;
            background: rgba($palette-slate-gray, 0.075);
            padding: 0.75em 1.25em;
            color: rgba($palette-slate-gray, 0.75);
            transition: all 0.3s;

            &.selected {
                color: white;
                background: $palette-slate-gray;
            }

            &:not(:last-child)::after {
                @include pseudo();
                @include position(18%, -1px, 18%, auto);
                background: rgba(black, 0.1);
                width: 2px;
            }
        }
    }

</style>
