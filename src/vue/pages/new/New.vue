<template>
    <div class="new-post">

        <text-input-field class="title" placeholder="Title"></text-input-field>

        <div class="editor">
            <div id="ql-editor"></div>
        </div>

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
                quill: null
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
                theme: 'snow'
            });
        },

        methods: {
            post() {
                const hmtl = this.quill.root.innerHTML;
                // TODO: Do something
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
        overflow: visible;
        margin: 1em 0;
        min-height: 0;

        #ql-editor {
            overflow: auto;
            min-height: 0;
        }
    }

    .post-btn {
        flex-shrink: 0;
        align-self: flex-end;
    }

</style>
