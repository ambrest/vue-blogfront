<template>
    <section class="home">

        <!-- Header -->
        <div class="header">
            <span>Latest Posts</span>
            <i class="icon fas fa-fw fa-sync-alt" @click="refresh"></i>
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
                errorMsg: null
            };
        },

        computed: {
            posts() {

                /* eslint-disable vue/no-side-effects-in-computed-properties */
                return this.$store.state.posts.list.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);
            }
        },

        mounted() {
            window.addEventListener('scroll', this.onScroll);
        },

        destroyed() {
            window.removeEventListener('scroll', this.onScroll);
        },

        methods: {
            refresh() {

                // Reloads posts and resets offset
                this.$store.dispatch('posts/fetchNext', {reset: true}).catch(err => {
                    this.errorMsg = err;
                });
            },

            onScroll() {

                // Check if the user has reached to bottom of the page
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    this.$store.dispatch('posts/fetchNext').then(() => {
                        this.errorMsg = '';
                    }).catch(err => {
                        this.errorMsg = err;
                    });
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
