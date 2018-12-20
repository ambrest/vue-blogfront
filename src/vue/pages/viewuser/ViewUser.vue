<template>
    <div class="view-user">

        <!-- Header -->
        <div class="header">
            <span>{{ user.fullname }}</span>
            <i class="icon fas fa-fw fa-sync-alt" @click="refresh"></i>
        </div>

        <div class="sub-header">
            <span>aka. {{ user.username }}</span>
            <span v-if="user.email"> / {{ user.email }} </span>
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
                posts: [],
                user: {},

                errorMsg: ''
            };
        },

        beforeMount() {
            this.refresh();
        },

        methods: {
            async refresh() {
                const {id} = this.$route.params;

                // Find user
                const user = await this.$store.dispatch('users/findUserById', {id});

                // Redirect to home if not found
                if (!user) {
                    this.$router.replace('/');
                }

                // Apply
                this.user = user;
                this.posts = await this.$store.dispatch('posts/getPostsFromUser', {id}).then(posts => {
                    return posts.map(v => {
                        v.user = user;
                        return v;
                    });
                }).catch(error => {
                    this.errorMsg = error;
                });
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
