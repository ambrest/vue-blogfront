<template>
    <router-link :to="`/user/${user.id}`" class="profile-picture">

        <img v-if="user.profilePicture"
             :src="`data:img/png;base64,${user.profilePicture}`"
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
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .profile-picture {
        @include flex(row, center, center);
        @include size(2.5em);
        border-radius: 0.15em;
        background: $palette-slate-gray;
        overflow: hidden;

        img {
            @include size(100%);
        }

        .profile-picture-placeholder {
            @include size(70%);
        }
    }

</style>
