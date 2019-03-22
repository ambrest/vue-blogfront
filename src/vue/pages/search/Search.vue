<template>
    <div class="search">

        <!-- Header -->
        <div class="header">
            <span>Results for "{{ $route.query.query }}"</span>
        </div>

        <!-- Posts listing -->
        <div class="posts">
            <post-preview-card-list :fetch-next="loadNext" default-error-message="Nothing found"/>
        </div>

    </div>
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

            async loadNext(offset) {

                // Fetch next "page"
                return this.$store.dispatch('posts/searchPosts', {
                    query: this.$route.query.query,
                    offset
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .search {
        width: 100vw;
    }

    .posts {
        @include flex(column, center);
        flex-shrink: 0;
        margin-top: 1em;
        width: 80%;
    }

    @include tablet {
        .posts {
            width: 100%;
        }
    }


</style>
