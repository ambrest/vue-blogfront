<template>
    <div class="comment">

        <div class="header">
            <profile-picture :user="comment.user"/>

            <div class="meta">
                <p class="author">{{ comment.user.fullname }}</p>
                <p class="date">{{ toDateString(comment.timestamp) }}</p>
            </div>
        </div>


        <p ref="body"
           :contenteditable="edit"
           :class="{body: 1, editable: edit}">{{ comment.body.replace(/^[\n\r\t ]+|[\n\r\t ]+$/g, '') }}</p>

        <div v-if="auth.user && ((auth.user.id === comment.user.id) || auth.user.permissions.includes('administrate'))" class="actions">

            <!-- Editor actions -->
            <i v-show="edit"
               class="delete fas fa-fw fa-ban"
               @click="cancelUpdateComment"></i>

            <i v-show="!edit"
               class="edit fas fa-fw fa-pencil-alt"
               @click="editComment()"></i>

            <i v-show="edit"
               class="fas fa-fw fa-save"
               @click="updateComment()"></i>

            <i class="delete fas fa-fw fa-trash-alt" @click="removeComment"></i>

            <span v-if="errorMsg" class="error"> - {{ errorMsg }}</span>
        </div>

    </div>
</template>

<script>

    // UI Components
    import TextAreaInputField from '../../ui/TextAreaInputField';
    import ProfilePicture     from '../../components/ProfilePicture';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {TextAreaInputField, ProfilePicture},

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
                this.$store.commit('popupDialog/show', {
                    title: 'Please confirm',
                    text: `Do you really want to delete this comment written by ${this.comment.user.fullname}?`,

                    buttons: [
                        {class: 'primary', text: 'Nah'},
                        {class: 'secondary', text: 'Yes Please'}
                    ],

                    onResolve: btn => {
                        if (btn) {

                            this.errorMsg = '';
                            const postid = this.post.id;
                            const {id} = this.comment;

                            this.$store.dispatch('posts/removeComment', {postid, id}).then(() => {
                                const cmdIndex = this.post.comments.findIndex(v => v.id === id);
                                this.post.comments.splice(cmdIndex, 1);
                            }).catch(error => {
                                this.errorMsg = error;
                            });
                        }
                    }
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
                requestAnimationFrame(() => this.$refs.body.focus());
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

        .header {
            @include flex(row, center);

            .profile-picture {
                margin-right: 0.25em;
            }

            .meta {
                margin-left: 0.75em;

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
            }
        }

        .body {
            @include font(400, 0.95em);
            margin: 1.3em 0 1.25em 0;
            line-height: 1.65em;
            word-break: break-all;
            word-break: break-word;
            font-family: $font-family-article-stack;
            white-space: pre-line;

            &.editable {
                border: 1px solid rgba($palette-slate-gray, 0.075);
                border-radius: 0.15em;
                padding: 0.5em;

                &:focus {
                    box-shadow: 0 0 0 1px rgba($palette-cloud-blue, 0.75);
                    border-color: rgba($palette-cloud-blue, 0.75);
                }
            }
        }

        .actions {
            @include flex(row, center);

            i {
                font-size: 0.8em;
                margin-top: 0.25em;
                margin-right: 0.75em;
                transition: all 0.3s;
                cursor: pointer;
                color: rgba($palette-slate-gray, 0.3);

                &.error {
                    text-decoration: none;
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
