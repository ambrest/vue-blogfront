<template>
    <div class="new-post">

        <text-input-field ref="title"
                          class="title"
                          placeholder="Title"></text-input-field>

        <tip-tap-editor ref="editor"
                        class="editor"></tip-tap-editor>

        <p class="error">{{ errorMsg }}</p>

        <div class="actions">

            <button v-if="originalPost"
                    class="button-secondary icon"
                    @click="removePost">
                <i class="fas fa-fw fa-trash"></i> {{ proceedDelete ? 'Are you sure?' : 'delete' }}
            </button>

            <button class="post-btn button-primary icon" @click="originalPost ? update() : post()">
                <i class="fas fa-fw fa-upload"></i>{{ originalPost ? 'Save changes' : 'Post' }}
            </button>

        </div>


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

                proceedDelete: false,
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
            },

            removePost() {
                this.errorMsg = '';

                if (!this.proceedDelete) {
                    this.proceedDelete = true;
                } else {
                    this.$store.dispatch('posts/removePost', {
                        id: this.originalPost.id
                    }).then(() => {
                        this.$router.push('/');
                    }).catch(reason => {
                        this.errorMsg = reason;
                    });
                }
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

    .actions {
        @include flex(row, center, flex-end);
        width: 100%;
        flex-shrink: 0;

        button {
            margin-left: 0.5em;
        }
    }

</style>
