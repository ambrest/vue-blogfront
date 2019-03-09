<template>
    <div class="view-user">

        <!-- Header -->
        <div class="header">
            <span>This is <b>{{ user.fullname }}</b></span>
        </div>

        <div class="sub-header">
            <span>aka. <b>{{ user.username }}</b></span>
            <span v-if="user.email"> / <b>{{ user.email }}</b> </span>
        </div>

        <!-- Posts listing -->
        <div class="posts">

            <!-- List -->
            <post-preview-card v-for="post of posts" :post="post"/>

            <!-- Placeholder -->
            <div v-if="!posts.length" class="placeholder">{{ errorMsg || 'This user has nothing posted yet...' }}</div>
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
                offset: 0,
                user: {}
            };
        },

        beforeMount() {
            const {id} = this.$route.params;

            // Find user
            this.$store.dispatch('users/findUserById', {id}).then(user => {
                this.user = user;
                this.loadNext();
            }).catch(() => {
                this.$router.replace('/');
            });

            this.utils.on(window, 'scroll', this.onScroll);
        },

        destroyed() {
            this.utils.off(window, 'scroll', this.onScroll);
        },

        methods: {

            loadNext() {

                // Fetch next "page"
                this.$store.dispatch('posts/getPostsFromUser', {
                    id: this.user.id,
                    offset: this.offset
                }).then(({posts, newOffset}) => {
                    this.offset = newOffset;
                    this.posts.push(...posts.map(v => {
                        v.user = this.user;
                        return v;
                    }));
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

    .sub-header {
        @include font(400, 0.9em);
        margin: -1.5em 0 1.5em;
        color: $palette-slate-gray;
        flex-shrink: 0;
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

    @include mobile {
        .sub-header {
            margin-top: 0;
        }
    }

</style>
