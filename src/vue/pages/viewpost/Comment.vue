<template>
    <div class="comment">

        <p class="author">{{ comment.user.fullname }}</p>

        <p class="date">{{ toDateString(comment.timestamp) }} • {{ comment.body | HTMLToTimeToReadString }}</p>

        <p ref="body"
           :contenteditable="edit"
           class="body">
            {{ comment.body }}
        </p>

        <div v-if="auth.user && ((auth.user.id === comment.user.id) || auth.user.permissions.includes('administrate'))" class="actions">

            <!-- Editor actions -->
            <span v-show="!edit"
                  class="edit"
                  @click="editComment()">Edit</span>

            <span v-show="edit"
                  @click=" updateComment()">Save</span>

            <span v-show="edit"
                  class="delete"
                  @click="cancelUpdateComment">Cancel</span>

            <span class="delete" @click="removeComment">Delete comment</span>

            <span v-if="errorMsg" class="error"> - {{ errorMsg }}</span>
        </div>

    </div>
</template>

<script>

    // UI Components
    import TextAreaInputField from '../../ui/TextAreaInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {TextAreaInputField},

        props: {
            comment: {
                type: Object,
                required: true
            },
            post: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                edit: false,
                errorMsg: ''
            };
        },

        computed: {
            ...mapState(['auth'])
        },

        mounted() {

            // Prevent pasting with formatted content
            this.$refs.body.addEventListener('paste', e => {
                e.preventDefault();
                document.execCommand('insertHTML', false, (e.originalEvent || e).clipboardData.getData('text/plain'));
            });
        },

        methods: {

            toDateString(timestamp) {
                const date = new Date(timestamp);
                return `${date.toLocaleDateString('en-us', {month: 'short'})} ${String(date.getDate()).padStart(2, '0')}`;
            },

            removeComment() {
                this.errorMsg = '';
                const postid = this.post.id;
                const {id} = this.comment;

                this.$store.dispatch('posts/removeComment', {postid, id}).then(() => {
                    const cmdIndex = this.post.comments.findIndex(v => v.id === id);
                    this.post.comments.splice(cmdIndex, 1);
                }).catch(error => {
                    this.errorMsg = error;
                });
            },

            updateComment() {
                this.errorMsg = '';
                const postid = this.post.id;
                const {id} = this.comment;

                this.$store.dispatch('posts/updateComment', {
                    postid, id,
                    body: this.$refs.body.innerText
                }).catch(error => {
                    this.errorMsg = error;
                });

                this.edit = false;
            },

            editComment() {
                this.edit = true;
                this.$refs.body.click();
            },

            cancelUpdateComment() {
                this.edit = false;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .comment {
        color: $palette-slate-gray;

        .author {
            @include font(400, 0.95em);
            margin-bottom: 0.25em;
        }

        .date {
            @include font(400, 0.75em);
            color: rgba(black, 0.5);
            margin-top: 0.5em;
            opacity: 0.8;
        }

        .body {
            @include font(400, 0.95em);
            margin: 1.25em 0 0.5em 0;
            line-height: 1.65em;
            word-break: break-all;
            word-break: break-word;
        }

        .actions {

            span {
                @include font(400, 0.8em);
                margin-top: 0.25em;
                margin-right: 0.25em;
                transition: all 0.3s;
                cursor: pointer;
                color: rgba($palette-slate-gray, 0.45);

                &.error {
                    text-decoration: none;
                }

                &:not(:last-child)::after {
                    content: ' •';
                }
            }

            .delete:hover {
                color: $palette-sweet-red;
            }

            .edit:hover {
                color: $palette-sweet-magenta;
            }
        }
    }

</style>
