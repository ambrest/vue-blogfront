<template>
    <router-link :to="`/user/${user.id}`" class="profile-picture">

        <img v-if="image"
             :src="image"
             :alt="user.fullname">

        <profile-picture-placeholder v-else/>
    </router-link>
</template>

<script>

    import ProfilePicturePlaceholder from '../ui/ProfilePicturePlaceholder';

    export default {
        components: {ProfilePicturePlaceholder},

        props: {
            user: {type: Object, required: true}
        },

        data() {
            return {
                image: null
            };
        },

        async beforeMount() {
            this.image = await this.$store.dispatch('users/getProfilePictureByUserID', {id: this.user.id}).catch(() => null);
        }
    };

</script>

<style lang="scss" scoped>

    .profile-picture {
        @include flex(row, center, center);
        @include size(2.75em);
        border-radius: 0.15em;
        background: $palette-slate-gray;
        overflow: hidden;

        img {
            @include size(100%);
        }

        .profile-picture-placeholder {
            @include size(60%);
        }
    }

</style>
