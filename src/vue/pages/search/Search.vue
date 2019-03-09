<template>
    <div class="search">

        <!-- Header -->
        <div class="header">
            <span>Results for "{{ $route.query.query }}"</span>
        </div>

        <!-- Posts listing -->
        <div class="posts">

            <!-- List -->
            <post-preview-card v-for="post of posts" :post="post"/>

            <!-- Placeholder -->
            <div v-if="!posts.length" class="placeholder">{{ errorMsg || 'Nothing found' }}</div>
        </div>

    </div>
</template>

<script>

    // Components
    import PostPreviewCard from '../../components/PostPreviewCard';

    export default {
        components: {PostPreviewCard},

        data() {
            return {
                posts: [],
                errorMsg: ''
            };
        },

        mounted() {
            const {query} = this.$route.query;

            this.$store.dispatch('posts/searchPosts', {query}).then(posts => {
                this.posts.push(...posts);
            }).catch(error => {
                this.errorMsg = error;
            });
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
