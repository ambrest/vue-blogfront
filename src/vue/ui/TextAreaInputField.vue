<template>
    <div class="text-area-input-field">

        <textarea ref="input"
                  :autofocus="autofocus"
                  :class="{empty: !value}"
                  :type="password ? 'password' : 'text'"
                  :placeholder="placeholder"
                  v-model="value"
                  spellcheck="false"
                  cols="40"
                  rows="1"
                  @blur="focused = false"
                  @focus="focused = true"
                  @input="updateValue"
                  @keyup.enter="$emit('submit')"></textarea>

        <!-- Colored border to show focus -->
        <span :class="{border: 1, active: focused}"></span>

    </div>
</template>

<script>

    export default {
        props: {
            placeholder: {type: String, required: true},
            password: {type: Boolean, default: false},
            autofocus: {type: Boolean, default: false}
        },

        data() {
            return {
                value: '',
                focused: false
            };
        },

        updated() {
            this.$refs.input.style.height = 'auto';
            this.$refs.input.style.height = `${this.$refs.input.scrollHeight}px`;
        },

        methods: {

            updateValue() {

                // Emit event
                this.$emit('update', this.value);
            },

            clear() {
                this.value = '';
                this.updateValue();
                this.$refs.input.style.height = 'auto';
            },

            setContent(str) {
                this.value = str;
            }
        }
    };

</script>

<style lang="scss" scoped>


    .text-area-input-field {
        @include flex(column);
        position: relative;
        border-radius: 0.15em;
        transition: all 0.3s;
        font-size: 1.1em;
    }

    .border {
        position: absolute;
        @include position(auto, 0, 0, 0);
        @include size(100%, 1px);
        opacity: 0.75;

        &::before,
        &::after {
            @include pseudo();
            @include size(100%, 1px);
            background: $palette-decent-blue;
        }

        &::after {
            width: 0;
            transition: all 0.3s ease-in-out;
        }

        &.active::after {
            width: 100%;
            background: $palette-sweet-magenta;
        }
    }

    textarea {
        @include font(400, 0.85em);
        resize: none;
        padding: 0.75em 0;
        width: 100%;
        z-index: 2;
        flex-shrink: 1;
        color: $palette-slate-gray;

        &::placeholder {
            color: $palette-decent-blue;
        }
    }
</style>
