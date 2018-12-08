<template>
    <div class="new-post">

        <text-input-field ref="title"
                          class="title"
                          placeholder="Title"></text-input-field>

        <div class="editor">
            <div id="ql-editor"></div>
        </div>

        <p class="error">{{ errorMsg }}</p>

        <button class="post-btn button-primary icon" @click="post"><i class="fas fa-fw fa-upload"></i>Post!</button>

    </div>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    // Import quill stuff
    import Quill from 'quill';

    export default {

        components: {TextInputField},

        data() {
            return {
                quill: null,
                errorMsg: ''
            };
        },

        mounted() {
            this.quill = new Quill('#ql-editor', {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                        ['link', 'image'],

                        [{'header': 1}, {'header': 2}],               // custom button values
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                        [{'direction': 'rtl'}],                         // text direction

                        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                        [{'align': []}],

                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'font': []}]
                    ]
                },
                bounds: '#ql-editor',
                theme: 'snow'
            });
        },

        methods: {
            post() {
                this.errorMsg = '';

                this.$store.dispatch('posts/newPost', {
                    title: this.$refs.title.value,
                    body: this.quill.root.innerHTML
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
        @include flex(column);
        width: 100%;
    }

    .title {
        width: 100%;
        flex-shrink: 0;
    }

    .editor {
        @include flex(column);
        width: 100%;
        margin: 1em 0;
        min-height: 0;

        #ql-editor {
            overflow-y: auto;
            min-height: 6em;
        }
    }

    .post-btn {
        flex-shrink: 0;
        align-self: flex-end;
    }

</style>
