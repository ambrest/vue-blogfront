<template>
    <div class="new-post">

        <!-- Content input fields -->
        <text-input-field ref="title"
                          class="title"
                          placeholder="Title"
                          @update="saveDraft"/>

        <tag-editor ref="tags" class="tags"/>

        <tip-tap-editor ref="editor"
                        class="editor"
                        @update="saveDraft"/>

        <p class="error">{{ errorMsg }}</p>

        <!-- Actions -->
        <div class="actions">

            <button v-if="originalPost"
                    class="button-secondary icon"
                    @click="removePost">
                <i class="fas fa-fw fa-trash"></i> delete
            </button>

            <button v-if="isDraft"
                    class="restore-draft button-secondary icon"
                    @click="clearDraft">
                <i class="fas fa-fw fa-redo"></i> Reset draft
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
    import TagEditor    from './TagEditor';

    export default {

        components: {
            TextInputField,
            TipTapEditor,
            TagEditor
        },

        data() {
            return {
                errorMsg: '',
                originalPost: null,
                isDraft: false,
                postId: this.$route.params.id
            };
        },

        mounted() {

            // First check if draft is present, than if an id was used.
            if (this.loadDraft()) {
                this.isDraft = true;
            }

            if (!this.loadDraft() && this.postId) {
                this.loadPost(this.postId);
            }
        },

        destroyed() {

            // Reset page title
            document.title = this.config.pageTitle;
        },

        methods: {

            saveDraft() {
                this.isDraft = true;
                localStorage.setItem(`post-draft-${this.$route.params.id || 'new'}`, JSON.stringify({
                    title: this.$refs.title.value,
                    body: this.$refs.editor.html,
                    tags: this.$refs.tags.tags,
                    originalPost: this.originalPost
                }));
            },

            loadDraft() {

                // Check if there's a local draft
                const draft = localStorage.getItem(`post-draft-${this.$route.params.id || 'new'}`);
                if (draft) {
                    const {body, title, tags, originalPost} = JSON.parse(draft);
                    this.$refs.editor.setHTML(body);
                    this.$refs.title.setContent(title);
                    this.$refs.tags.setTags(tags || []);
                    this.originalPost = originalPost;
                    return true;
                }

                return false;
            },

            clearDraft() {
                this.isDraft = false;

                if (this.postId) {
                    this.loadPost(this.postId);
                } else {
                    this.$refs.editor.setHTML('');
                    this.$refs.title.setContent('');
                    this.$refs.tags.setTags([]);
                }

                // Clear draft
                localStorage.removeItem(`post-draft-${this.$route.params.id || 'new'}`);
            },

            loadPost(id) {
                this.$store.dispatch('posts/findPostById', {id}).then(post => {
                    this.$refs.editor.setHTML(post.body);
                    this.$refs.title.setContent(post.title);
                    this.$refs.tags.setTags(post.tags || []);
                    this.originalPost = post;

                    // Update page title
                    document.title = `${this.config.pageTitle} - Edit: ${post.title}`;
                }).catch(() => {
                    this.$router.replace('/');
                });
            },

            post() {
                this.errorMsg = '';

                this.$store.dispatch('posts/newPost', {
                    title: this.$refs.title.value,
                    body: this.$refs.editor.html,
                    tags: this.$refs.tags.tags
                }).then(post => {
                    this.$router.push(`/post/${post.id}`);
                    localStorage.removeItem(`post-draft-${this.$route.params.id || 'new'}`);
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            },

            update() {
                this.errorMsg = '';

                this.$store.dispatch('posts/updatePost', {
                    id: this.originalPost.id,
                    title: this.$refs.title.value,
                    body: this.$refs.editor.html,
                    tags: this.$refs.tags.tags
                }).then(() => {
                    this.$router.push(`/post/${this.originalPost.id}`);
                    localStorage.removeItem(`post-draft-${this.$route.params.id || 'new'}`);
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            },

            removePost() {

                // Warn user about deleting this post
                this.$store.commit('popupDialog/show', {
                    title: 'Please confirm',
                    text: `Do you really want to delete ${this.originalPost.title}?`,

                    buttons: [
                        {class: 'primary', text: 'Nah'},
                        {class: 'secondary', text: 'Yes Please'}
                    ],

                    onResolve: btn => {
                        if (btn) {
                            this.errorMsg = '';
                            this.$store.dispatch('posts/removePost', {
                                id: this.originalPost.id
                            }).then(() => {
                                this.$router.push('/');
                                localStorage.removeItem(`post-draft-${this.$route.params.id || 'new'}`);
                            }).catch(reason => {
                                this.errorMsg = reason;
                            });
                        }
                    }
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

    .tags {
        margin: 1em 0 0.25em;
    }

    .editor {
        width: 100%;
        margin-top: 1em;
    }

    .error {
        margin: 1em 0;
    }

    .actions {
        @include flex(row, center, flex-end);
        width: 100%;
        flex-shrink: 0;

        button {
            margin-left: 0.5em;
        }
    }

    @include mobile {
        .actions {
            flex-wrap: wrap;
            justify-content: center;

            button {
                margin: 0 0 0.5em 0.5em;
            }
        }
    }


</style>
