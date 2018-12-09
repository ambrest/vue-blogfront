<template>
    <div class="new-post">

        <text-input-field ref="title"
                          class="title"
                          placeholder="Title"></text-input-field>

        <editor-menu-bar :editor="editor" class="editor-bar">
            <div slot-scope="{ commands, isActive }">
                <button :class="{'active': isActive.bold() }" @click="commands.bold"><i class="fas fa-fw fa-bold"></i></button>
                <button :class="{'active': isActive.strike() }" @click="commands.strike"><i class="fas fa-fw fa-strikethrough"></i></button>
                <button :class="{'active': isActive.italic() }" @click="commands.italic"><i class="fas fa-fw fa-italic"></i></button>
                <button :class="{'active': isActive.underline() }" @click="commands.underline"><i class="fas fa-fw fa-underline"></i></button>
                <button :class="{'active': isActive.blockquote() }" @click="commands.blockquote"><i class="fas fa-fw fa-quote-left"></i></button>
                <button :class="{'active': isActive.code() }" @click="commands.code"><i class="fas fa-fw fa-code"></i></button>

                <button :class="{'active': isActive.bullet_list() }" @click="commands.bullet_list"><i class="fas fa-fw fa-list-ul"></i></button>
                <button :class="{'active': isActive.ordered_list() }" @click="commands.ordered_list"><i class="fas fa-fw fa-list-ol"></i></button>


                <button :class="{'active': isActive.heading({level: 1}) }" @click="commands.heading({level: 1})"><span>H1</span></button>
                <button :class="{'active': isActive.heading({level: 2}) }" @click="commands.heading({level: 2})"><span>H2</span></button>
                <button :class="{'active': isActive.heading({level: 3}) }" @click="commands.heading({level: 3})"><span>H3</span></button>
            </div>
        </editor-menu-bar>

        <editor-content :editor="editor" class="editor blog-content"></editor-content>

        <p class="error">{{ errorMsg }}</p>

        <button class="post-btn button-primary icon" @click="post"><i class="fas fa-fw fa-upload"></i>Post!</button>

    </div>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    // TipTap editor
    import {Editor, EditorContent, EditorMenuBar} from 'tiptap';
    import {
        Blockquote,
        CodeBlock,
        HardBreak,
        Heading,
        OrderedList,
        BulletList,
        ListItem,
        TodoItem,
        TodoList,
        Bold,
        Code,
        Italic,
        Link,
        Strike,
        Underline,
        History
    }                                             from 'tiptap-extensions';

    export default {

        components: {
            TextInputField,
            EditorMenuBar,
            EditorContent
        },

        data() {
            return {
                errorMsg: '',
                html: '',
                editor: null
            };
        },

        mounted() {
            this.editor = new Editor({
                content: '',
                onUpdate: ({ getHTML }) => {
                    this.html = getHTML()
                },
                extensions: [
                    new Blockquote(),
                    new Heading({levels: [1, 2, 3]}),
                    new BulletList(),
                    new OrderedList(),
                    new ListItem(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Link(),
                    new Strike(),
                    new Underline()
                ]
            });
        },

        beforeDestroy() {
            this.editor.destroy();
        },

        methods: {
            post() {
                this.errorMsg = '';

                // TODO: Move styles to external scss file?
                this.$store.dispatch('posts/newPost', {
                    title: this.$refs.title.value,
                    body: this.html
                }).then(() => {
                    this.$router.push('/');
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            }
        },

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

    .editor-bar {
        @include flex(row, flex-start);
        border: 1px solid $palette-decent-blue;
        flex-wrap: wrap;
        margin: 1em 0 0.5em;

        button {
            border-left: 1px solid $palette-decent-blue;
            color: $palette-decent-blue;
            padding: 0.25em 0.5em;
            transition: all 0.3s;
            font-size: 0.9em;

            i {
                font-size: 1em;
            }

            span {
                font-weight: 500;
            }

            &:hover {
                color: $palette-sweet-red;
            }

            &.active {
                color: $palette-sweet-magenta;
            }

            &:first-child {
                border-left: none;
            }
        }
    }

    .editor {
        width: 100%;
        border: 1px solid $palette-decent-blue;
        padding: 0.5em;
        font-size: 0.9em;
    }

    .post-btn {
        flex-shrink: 0;
        align-self: flex-end;
    }

</style>
