<template>
    <div class="new-post">
        <text-input-field ref="title"
                          class="title"
                          placeholder="Title"></text-input-field>

        <tip-tap-editor class="editor" @change="updateHTML"></tip-tap-editor>

        <p class="error">{{ errorMsg }}</p>

        <button class="post-btn button-primary icon" @click="post"><i class="fas fa-fw fa-upload"></i>Post!</button>
    </div>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    // Tip tap editor
    import TipTapEditor from './TipTapEditor';

    export default {

        components: {
            TextInputField,
            TipTapEditor
        },

        data() {
            return {
                errorMsg: '',
                html: ''
            };
        },

        methods: {

            updateHTML(html) {
                this.html = html;
            },

            post() {
                this.errorMsg = '';

                this.$store.dispatch('posts/newPost', {
                    title: this.$refs.title.value,
                    body: this.html
                }).then(() => {
                    this.$router.push('/');
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            }
        }

    };

</script>

<style lang="scss" scoped>

    .new-post {
        @include flex(column, flex-start);
        width: 100%;
    }

    .title {
        width: 100%;
        flex-shrink: 0;
    }

    .editor {
        width: 100%;
        margin-top: 1em;
    }

    .error {
        margin: 1em;
    }

    .post-btn {
        flex-shrink: 0;
        align-self: flex-end;
    }

</style>
