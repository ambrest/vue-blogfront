<template>
    <div class="new-post">

        <text-input-field ref="title"
                          class="title"
                          placeholder="Title"></text-input-field>

        <tip-tap-editor ref="editor"
                        class="editor"></tip-tap-editor>

        <p class="error">{{ errorMsg }}</p>

        <button class="post-btn button-primary icon" @click="originalPost ? update() : post()">
            <i class="fas fa-fw fa-upload"></i>{{ originalPost ? 'Save changes' : 'Post' }}
        </button>

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
                originalPost: null
            };
        },

        beforeMount() {
            const {id} = this.$route.params;

            // Check if id was passed, if yes the user wants to edit the post
            if (id) {
                this.$store.dispatch('posts/findPostById', {id}).then(post => {
                    this.$refs.editor.setHTML(post.body);
                    this.$refs.title.setContent(post.title);
                    this.originalPost = post;
                }).catch(() => {
                    this.$router.replace('/');
                });
            }
        },

        methods: {

            post() {
                this.errorMsg = '';

                this.$store.dispatch('posts/newPost', {
                    title: this.$refs.title.value,
                    body: this.$refs.editor.html
                }).then(() => {
                    this.$router.push('/');
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            },

            update() {
                this.errorMsg = '';

                this.$store.dispatch('posts/updatePost', {
                    id: this.originalPost.id,
                    title: this.$refs.title.value,
                    body: this.$refs.editor.html
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
