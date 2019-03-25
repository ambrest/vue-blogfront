<template>
    <div class="profile-picture-placeholder"></div>
</template>

<style lang="scss" scoped>

    .profile-picture-placeholder {
        position: relative;

        &::before,
        &::after {
            @include pseudo();
            @include position(0, 0, 0, 0);
            border: 2px solid $palette-snow-white;
            border-radius: 100%;
            margin: auto;
            opacity: 0;
            transition: all 0.3s;
        }

        &::after {
            @include size(30%);
            bottom: 35%;
            opacity: 1;
        }

        &::before {
            @include size(55%);
            bottom: -62%;
            border-bottom-color: transparent;
            border-right-color: transparent;
            transform: rotate(45deg);
            opacity: 1;
        }
    }

</style>
