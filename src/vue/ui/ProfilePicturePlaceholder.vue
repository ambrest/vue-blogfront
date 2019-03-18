<template>
    <div class="profile-picture-placeholder"></div>
</template>

<style lang="scss" scoped>

    .profile-picture-placeholder {
        position: relative;
        @include size(5em);

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
            @include size(1em);
            bottom: 20%;
            opacity: 1;
        }

        &::before {
            @include size(1.8em);
            bottom: -42%;
            border-bottom-color: transparent;
            border-right-color: transparent;
            transform: rotate(45deg);
            opacity: 1;
        }
    }

</style>
