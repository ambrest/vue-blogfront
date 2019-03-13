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
            <div v-if="!posts.length" class="placeholder">{{ $store.state.requestsActive ? 'Loading...' : errorMsg || 'Nothing found' }}</div>
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
                errorMsg: '',
                posts: [],
                offset: 0
            };
        },

        beforeMount() {
            this.loadNext();
            this.utils.on(window, 'scroll', this.onScroll);
        },

        destroyed() {
            this.utils.off(window, 'scroll', this.onScroll);
        },

        methods: {

            loadNext() {

                // Fetch next "page"
                this.$store.dispatch('posts/searchPosts', {
                    query: this.$route.query.query,
                    offset: this.offset
                }).then(({posts, newOffset}) => {
                    this.offset = newOffset;
                    this.posts.push(...posts);
                }).catch(error => {
                    this.errorMsg = error;
                });
            },

            onScroll() {

                // Check if the user has reached to bottom of the page
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    this.loadNext();
                }
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
