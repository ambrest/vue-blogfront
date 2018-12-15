<template>
    <div class="footer">
        <span>Made with <i class="fas fa-heart"></i> by Ambrest Designs</span>
    </div>
</template>

<script>

    export default {
        data() {
            return {};
        }
    };

</script>


<style lang="scss" scoped>

    .footer {
        @include font(500, 0.9em);
        color: $palette-slate-gray;
        margin-top: 1.5em;
        opacity: 0.6;

        i {
            font-size: 1em;
            margin: 0 0.25em;
            color: $palette-sweet-red;
        }
    }

</style>
