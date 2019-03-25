<template>
    <div class="view-user">

        <!-- Header -->
        <div class="header">
            <span>This is <b>{{ user.fullname }}</b></span>
        </div>

        <!-- Profile picture -->
        <profile-picture v-if="userLoaded" :user="user"/>

        <div class="sub-header">
            <p>{{ user.about }}</p>
            <div>
                <span>aka. <b>{{ user.username }}</b></span>
                <span v-if="user.email"> / <b>{{ user.email }}</b> </span>
            </div>
        </div>

        <!-- Posts listing -->
        <div class="posts">

            <tab-buttons :labels="['His writings', 'Where he clapped']" @select="selectTab"/>

            <!-- List -->
            <post-preview-card-list v-show="tab === 0"
                                    :fetch-next="loadNextByOffset"
                                    default-error-message="This user has nothing posted yet..."/>
            <post-preview-card-list v-show="tab === 1"
                                    :fetch-next="loadNextByClapps"
                                    default-error-message="User hasn't clapped so far"/>
        </div>

    </div>
</template>

<script>

    // Components
    import PostPreviewCardList       from '../../components/PostPreviewCardList';
    import ProfilePicture from '../../components/ProfilePicture';

    // UI Components
    import TabButtons from '../../ui/TabButtons';

    export default {
        components: {ProfilePicture, PostPreviewCardList, TabButtons},

        data() {
            return {
                user: {},
                userLoaded: false,
                tab: 0
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

            selectTab({index}) {
                this.tab = index;
            },

            async loadNextByOffset(offset) {

                // Resolve user first
                if (this.user instanceof Promise) {
                    this.user = await Promise.race([this.user]);
                    this.userLoaded = true;
                }

                // Fetch next "page"
                return this.$store.dispatch('posts/getPostsFromUser', {
                    userid: this.user.id,
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
            },

            async loadNextByClapps(offset) {

                // Resolve user first
                if (this.user instanceof Promise) {
                    this.user = await Promise.race([this.user]);
                    this.userLoaded = true;
                }

                // Fetch next "page"
                return this.$store.dispatch('posts/getPostsWhereClapped', {
                    userid: this.user.id,
                    offset
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .view-user {
        width: 100%;
    }

    .profile-picture {
        @include size(5em);
        border-radius: 100%;
        margin: -0.5em 0 1.5em;
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
