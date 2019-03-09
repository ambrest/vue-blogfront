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
            <post-preview-card v-for="post of posts" :post="post"/>

            <!-- Placeholder -->
            <div v-if="!posts.length" class="placeholder">{{ errorMsg || 'Nothing posted yet...' }}</div>
        </div>

    </section>
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
            reset() {
                this.offset = 0;
                this.loadNext();
            },

            loadNext() {

                // Fetch next "page"
                this.$store.dispatch('posts/getPostInRange', {
                    offset: this.offset
                }).then(({posts, newOffset}) => {
                    this.posts.push(...posts);
                    this.offset = newOffset;
                }).catch(err => {
                    this.errorMsg = err;
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

    @include tablet {
        .posts {
            width: 100%;
        }
    }

</style>
