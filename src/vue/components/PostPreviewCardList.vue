<template>
    <div class="post-preview-card-list">

        <!-- Posts -->
        <post-preview-card v-for="post of posts" :post="post"/>

        <!-- Placeholder / error display -->
        <div v-if="!posts.length" class="placeholder">
            {{ $store.state.requestsActive ? 'Loading...' : errorMsg || defaultErrorMessage }}
        </div>

    </div>
</template>

<script>

    // Components
    import PostPreviewCard from './PostPreviewCard';

    export default {

        components: {PostPreviewCard},

        props: {
            fetchNext: {type: Function, required: true},
            defaultErrorMessage: {type: String, required: true}
        },

        data() {
            return {
                errorMsg: '',
                posts: [],
                offset: 0,
                endReached: false
            };
        },

        beforeMount() {
            this.load();
            this.utils.on(window, 'scroll', this.onScroll);
        },

        destroyed() {
            this.utils.off(window, 'scroll', this.onScroll);
        },

        methods: {

            onScroll() {

                // Check if the user has reached to bottom of the page
                if (!this.endReached && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    this.load();
                }
            },

            load() {
                this.fetchNext(this.offset).then(({posts, newOffset}) => {

                    if ((this.endReached = this.offset === newOffset)) {
                        return;
                    }

                    this.offset = newOffset;
                    this.posts.push(...posts);
                }).catch(err => {
                    this.errorMsg = err;
                });
            },

            setOffset(newOffset) {
                this.offset = newOffset;
                this.load();
            }
        }
    };

</script>

<style lang="scss" scoped>

    .post-preview-card-list {
        @include flex(column, center, center);
        width: 100%;
    }

</style>
