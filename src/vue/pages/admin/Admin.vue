<template>
    <section class="admin">

        <h1>Admin panel</h1>

        <userlist class="userlist"></userlist>

    </section>
</template>

<script>

    // Components
    import Userlist from './Userlist';

    export default {
        components: {Userlist},

        data() {
            return {};
        }

    };

</script>

<style lang="scss" scoped>

    .admin {
        @include flex(column);
        width: 100%;

        .userlist {
            width: 100%;
        }

    }

</style>
