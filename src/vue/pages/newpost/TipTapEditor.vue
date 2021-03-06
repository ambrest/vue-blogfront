<template>
    <div class="tip-tap-editor">

        <editor-menu-bubble :editor="editor" class="menububble link">
            <div slot-scope="{ commands, isActive, getMarkAttrs, menu }"
                 :class="{'menububble': 1, 'active': menu.isActive }"
                 :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`">

                <form v-if="linkMenuIsActive" @submit.prevent="setLinkUrl(commands.link, linkUrl)">
                    <input ref="linkInput"
                           v-model="linkUrl"
                           type="text"
                           placeholder="https://"
                           spellcheck="false"
                           @keydown.esc="hideLinkMenu"
                           @keydown.enter.prevent.stop="setLinkUrl(commands.link, linkUrl)">

                    <i class="fas fa-fw fa-times" @click="setLinkUrl(commands.link, null)"></i>
                </form>
            </div>
        </editor-menu-bubble>

        <editor-menu-bar :editor="editor" class="editor-bar">
            <div slot-scope="{ commands, getMarkAttrs, isActive }">

                <!-- History -->
                <button @click="commands.undo"><i class="fas fa-fw fa-undo"></i></button>
                <button @click="commands.redo"><i class="fas fa-fw fa-redo"></i></button>

                <!-- Basic text actions -->
                <button :class="{'active': isActive.bold() }" @click="commands.bold"><i class="fas fa-fw fa-bold"></i></button>
                <button :class="{'active': isActive.strike() }" @click="commands.strike"><i class="fas fa-fw fa-strikethrough"></i></button>
                <button :class="{'active': isActive.italic() }" @click="commands.italic"><i class="fas fa-fw fa-italic"></i></button>
                <button :class="{'active': isActive.underline() }" @click="commands.underline"><i class="fas fa-fw fa-underline"></i></button>
                <button :class="{'active': isActive.blockquote() }" @click="commands.blockquote"><i class="fas fa-fw fa-quote-left"></i></button>
                <button :class="{'active': isActive.code() }" @click="commands.code"><i class="fas fa-fw fa-code"></i></button>
                <button :class="{'active': isActive.code_block() }" @click="commands.code_block"><i class="fas fa-fw fa-file-code"></i></button>
                <button :class="{'active': isActive.link && isActive.link() }" @click="showLinkMenu(getMarkAttrs('link'))"><i class="fas fa-fw fa-link"></i>
                </button>

                <!-- Lists -->
                <button :class="{'active': isActive.bullet_list() }" @click="commands.bullet_list"><i class="fas fa-fw fa-list-ul"></i></button>
                <button :class="{'active': isActive.ordered_list() }" @click="commands.ordered_list"><i class="fas fa-fw fa-list-ol"></i></button>

                <!-- Headers -->
                <button :class="{'active': isActive.heading({level: 1}) }" @click="commands.heading({level: 1})"><span>H1</span></button>
                <button :class="{'active': isActive.heading({level: 2}) }" @click="commands.heading({level: 2})"><span>H2</span></button>
                <button :class="{'active': isActive.heading({level: 3}) }" @click="commands.heading({level: 3})"><span>H3</span></button>

                <!-- Alignment -->
                <button :class="{'active': isActive.align({alignment: 'left'}) }" @click="commands.align({align: 'left'})"><i
                    class="fas fa-fw fa-align-left"></i></button>
                <button :class="{'active': isActive.align({alignment: 'center'}) }" @click="commands.align({align: 'center'})"><i
                    class="fas fa-fw fa-align-center"></i></button>
                <button :class="{'active': isActive.align({alignment: 'right'}) }" @click="commands.align({align: 'right'})"><i
                    class="fas fa-fw fa-align-right"></i></button>
            </div>
        </editor-menu-bar>

        <editor-content ref="editor"
                        :editor="editor"
                        :class="{'editor blog-content': 1, empty: !html}"/>

    </div>
</template>

<script>

    // TipTap editor
    import {Editor, EditorContent, EditorMenuBar, EditorMenuBubble} from 'tiptap';
    import {
        Blockquote,
        CodeBlock,
        Heading,
        OrderedList,
        BulletList,
        ListItem,
        Bold,
        Code,
        Italic,
        Link,
        Strike,
        Underline,
        History
    }                                                               from 'tiptap-extensions';

    // Custom tip-tap extensions
    import Image     from '../../../js/tip-tap-extensions/Image';
    import TextAlign from '../../../js/tip-tap-extensions/TextAlign';

    export default {

        components: {
            EditorMenuBar,
            EditorContent,
            EditorMenuBubble
        },

        data() {
            return {

                // Editor stuff
                editor: null,
                html: '',
                linkUrl: null,
                linkMenuIsActive: false
            };
        },

        mounted() {
            this.editor = new Editor({
                content: '',
                onUpdate: ({getHTML}) => {
                    let html = getHTML();

                    if (html === '<p></p>') {
                        html = '';
                    }

                    this.$emit('update', html);
                    this.html = html;
                },
                extensions: [
                    new TextAlign(),
                    new Blockquote(),
                    new Heading({levels: [1, 2, 3]}),
                    new BulletList(),
                    new OrderedList(),
                    new ListItem(),
                    new Bold(),
                    new Code(),
                    new CodeBlock(),
                    new Italic(),
                    new History(),
                    new Strike(),
                    new Underline(),
                    new Link(),
                    new Image()
                ]
            });
        },

        beforeDestroy() {
            this.editor.destroy();
        },

        methods: {
            showLinkMenu(attrs) {
                this.linkUrl = attrs.href;
                this.linkMenuIsActive = true;
                this.$nextTick(() => this.$refs.linkInput.focus());
            },

            hideLinkMenu() {
                this.linkUrl = null;
                this.linkMenuIsActive = false;
            },

            setLinkUrl(command, url) {
                command({href: url});
                this.hideLinkMenu();
                this.editor.focus();
            },

            setHTML(html) {
                this.html = html;
                this.editor.setContent(html);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .tip-tap-editor {
        position: relative;
        @include flex(column, flex-start);
        font-size: 0.9em;

        .editor-bar {
            @include flex(row, flex-start);
            flex-wrap: wrap;
            margin: 0 -0.25em;

            button {
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
            }
        }

        .editor {
            position: relative;
            width: 100%;
            margin-top: 0.5em;
            padding: 0.5em;

            &.empty::before {
                position: absolute;
                content: "Write something...";
                opacity: 0.5;
                font-style: italic;
                pointer-events: none;
            }
        }

        .menububble {
            position: absolute;

            form {
                @include flex(row, center);
                background: $palette-snow-white;
                box-shadow: 0 3px 10px 0 rgba(black, 0.07);
                padding: 0.5em 0.75em;
                border-radius: 0.15em;

                i {
                    font-size: 1.05em;
                    color: $palette-decent-blue;
                    transition: all 0.3s;
                    cursor: pointer;

                    &:hover {
                        color: $palette-sweet-red;
                    }
                }

                input::placeholder {
                    color: $palette-decent-blue;
                }
            }
        }
    }


</style>
