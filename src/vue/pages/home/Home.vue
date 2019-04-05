<template>
    <section class="home">

        <!-- Header -->
        <div class="header">
            <span>Latest Posts</span>
            <i class="icon fas fa-fw fa-sync-alt" @click="reset"></i>
        </div>

        <div class="divider"></div>

        <!-- Posts listing -->
        <div class="posts">

            <!-- List -->
            <post-preview-card-list ref="postPreviewCardList"
                                    :fetch-next="loadNext"
                                    default-error-message="Nothing posted yet..."/>
        </div>

    </section>
</template>

<script>

    // Components
    import PostPreviewCardList from '../../components/PostPreviewCardList';

    export default {
        components: {PostPreviewCardList},

        data() {
            return {};
        },

        methods: {
            reset() {
                this.$refs.postPreviewCardList.setOffset(0);
                this.loadNext();
            },

            async loadNext(offset) {

                // Fetch next "page"
                return this.$store.dispatch('posts/getPostInRange', {offset});
            }
        }
    };

</script>

<style lang="scss" scoped>

    .home {
        overflow: auto;
        width: 100%;
    }

    .placeholder {
        opacity: 0.8;
    }

    .posts {
        @include flex(column, center);
        flex-shrink: 0;
        width: 80%;
    }

    @include MQTablets {
        .posts {
            width: 100%;
        }
    }

</style>
