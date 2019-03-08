<template>
    <div class="tag-editor">

        <!-- Tag list -->
        <div v-for="tag of tags" class="tag">
            <span>{{ tag }}</span>
            <div @click="removeTag(tag)"></div>
        </div>

        <!-- New tag input -->
        <input v-model="newTag" 
               type="text" 
               placeholder="Add tag..." 
               @keydown.enter="addTag">

    </div>
</template>

<script>

    export default {

        props: {
            preAdded: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                tags: [],
                newTag: ''
            };
        },

        mounted() {
            this.tags.push(...this.preAdded);
        },

        methods: {

            addTag() {

                // Check if tag isn't empty and does not already exist
                if (this.newTag.length) {
                    const idx = this.tags.indexOf(this.newTag);

                    if (!~idx) {
                        this.tags.push(this.newTag);
                        this.newTag = '';
                    }
                }
            },

            removeTag(tag) {
                const idx = this.tags.indexOf(tag);
                if (~idx) {
                    this.tags.splice(idx, 1);
                }
            },

            setTags(tags) {
                this.tags = tags;
            }
        }
    };

</script>


<style lang="scss" scoped>

    .tag-editor {
        @include flex(row, center);
        flex-wrap: wrap;
    }

    .tag {
        @include flex(row, center);
        border-radius: 0.2em;
        font-size: 0.75em;
        padding: 0.35em 1em 0.35em 0.75em;
        margin: 0 0.5em 0.5em 0;
        background: $palette-sweet-red;
        color: white;

        @include animate('0.5s ease-in-out') {
            from {
                opacity: 0;
            }
        }

        > span {
            font-weight: 500;
            margin-right: 7px;
            margin-top: 2px;
        }

        > div {
            @include size(1em);
            position: relative;
            cursor: pointer;
            padding-left: 10px;
            border-left: 1px solid white;

            &::before,
            &::after {
                @include pseudo();
                @include position(0, 0, 0, 10px);
                @include size(2px, 100%);
                background: white;
                margin: auto;
                border-radius: 100em;
                transition: all 0.3s;
            }

            &::before {
                transform: rotate(45deg);
            }

            &::after {
                transform: rotate(-45deg);
            }

            &:hover {

                &::before {
                    transform: rotate(90deg);
                }

                &::after {
                    transform: rotate(-90deg);
                }
            }
        }
    }

    input {
        @include font(400, 0.75em);
        font-size: 0.8em;
        height: 1.5em;
        margin: 0 0.65em 0.65em 0.25em;

        &::placeholder {
            color: $palette-decent-blue;
        }
    }


</style>
