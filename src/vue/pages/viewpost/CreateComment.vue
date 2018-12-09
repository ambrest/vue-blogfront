<template>
    <div class="create-comment">

        <text-area-input-field ref="input" placeholder="Add a public comment..."></text-area-input-field>

        <p class="error">{{ errorMsg }}</p>

        <div class="action-bar">
            <button class="button-secondary icon" @click="cancel"><i class="fas fa-fw fa-times"></i>Cancel</button>
            <button class="button-primary icon" @click="submit"><i class="fas fa-fw fa-comment"></i>Comment</button>
        </div>

    </div>
</template>

<script>

    // UI Components
    import TextAreaInputField from '../../ui/TextAreaInputField';

    export default {

        components: {TextAreaInputField},

        props: {
            postid: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                errorMsg: ''
            };
        },

        methods: {

            cancel() {
                this.$refs.input.clear();
            },

            submit() {
                this.errorMsg = '';
                const content = this.$refs.input.value;
                // TODO Do smth
            }

        }

    };

</script>

<style lang="scss" scoped>

    .create-comment {
        @include flex(column);
    }

    .text-area-input-field {
        flex-grow: 1;
        max-height: 8em;
    }

    // TODO Remove on merge
    .error {
        @include font(500, 0.7em);
        color: $palette-sweet-red;
        margin-top: 0.3em;
        height: 1.5em;
    }

    .action-bar {
        margin-top: 0.5em;
        @include flex(row, center, flex-end);
        flex-shrink: 0;

        button {
            margin-left: 0.25em;
        }
    }
</style>
