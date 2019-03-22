<template>
    <div class="view-user">

        <!-- Header -->
        <div class="header">
            <span>This is <b>{{ user.fullname }}</b></span>
        </div>

        <!-- Profile picture -->
        <img v-if="user.profilePicture"
             :src="`data:image/png;base64,${user.profilePicture}`"
             :alt="user.fullname">

        <profile-picture-placeholder v-else/>


        <div class="sub-header">
            <p>{{ user.about }}</p>
            <div>
                <span>aka. <b>{{ user.username }}</b></span>
                <span v-if="user.email"> / <b>{{ user.email }}</b> </span>
            </div>
        </div>

        <!-- Posts listing -->
        <div class="posts">

            <!-- List -->
            <post-preview-card-list :fetch-next="loadNext" default-error-message="This user has nothing posted yet..."/>
        </div>

    </div>
</template>

<script>

    // Components
    import PostPreviewCardList from '../../components/PostPreviewCardList';

    // UI Components
    import ProfilePicturePlaceholder from '../../ui/ProfilePicturePlaceholder';

    export default {
        components: {PostPreviewCardList, ProfilePicturePlaceholder},

        data() {
            return {
                user: {}
            };
        },

        created() {
            const {id} = this.$route.params;

            // Find user
            this.user = this.$store.dispatch('users/findUserById', {id}).catch(() => {
                this.$router.replace('/');
            });
        },

        methods: {

            async loadNext(offset) {

                if (this.user instanceof Promise) {
                    this.user = await Promise.race([this.user]);
                }

                // Fetch next "page"
                return this.$store.dispatch('posts/getPostsFromUser', {
                    id: this.user.id,
                    offset
                }).then(({posts, newOffset}) => {
                    return {
                        newOffset,
                        posts: posts.map(v => {
                            v.user = this.user;
                            return v;
                        })
                    };
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .view-user {
        width: 100%;
    }

    img,
    .profile-picture-placeholder {
        @include size(5em);
        border-radius: 100%;
        margin: -0.5em 0 1.5em;
        background: $palette-slate-gray;

        &img {
            background: transparent;
        }
    }

    .sub-header {
        @include flex(column, center, center);
        @include font(400, 0.9em);
        margin: 0 0 1.5em;
        color: $palette-slate-gray;
        flex-shrink: 0;
        text-align: center;

        > p {
            font-family: $font-family-article-stack;
            margin-bottom: 0.75em;
            max-width: 60%;
            min-width: 25vw;
            line-height: 1.35em;
        }
    }

    .posts {
        @include flex(column, center);
        flex-shrink: 0;
        margin-top: 1em;
        width: 80%;

        .tab-buttons {
            margin-bottom: 2.5em;
        }
    }

    @include tablet {
        .posts {
            width: 100%;
        }

        .sub-header > p {
            min-width: 100%;
        }
    }

    @include mobile {
        .sub-header {
            margin-top: 0;
        }
    }

</style>
