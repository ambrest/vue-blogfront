<template>
    <section class="admin">
        <h1>Admin panel</h1>

        <user-list class="userlist"/>

    </section>
</template>

<script>

    // Components
    import UserList from './UserList';

    export default {
        components: {UserList},

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
