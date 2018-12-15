<template>
    <div :class="{'drop-area': 1, drop: dropActive}">
        <i class="fas fa-image"></i>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                dropActive: false
            };
        },

        mounted() {
            window.addEventListener('drag', e => e.preventDefault());
            window.addEventListener('dragend', e => e.preventDefault());
            window.addEventListener('dragover', e => e.preventDefault());

            window.addEventListener('dragenter', e => {
                e.preventDefault();
                this.dropActive = true;
            });

            window.addEventListener('dragleave', e => {
                e.preventDefault();

                if (e.target.id === 'app') {
                    this.dropActive = false;
                }
            });

            window.addEventListener('drop', e => {
                this.dropActive = false;
                const file = event.dataTransfer.files[0];

                // Validate type
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => this.$emit('drop', {file, base64: reader.result});
                    reader.readAsDataURL(file);
                }

                e.preventDefault();
            });
        }

    };

</script>

<style lang="scss" scoped>

    .drop-area {
        position: absolute;
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        background: $palette-snow-white;
        transition: all 0.3s;
        pointer-events: none;
        opacity: 0;

        i {
            font-size: 4em;
            transform-origin: center;
            color: white;
            transform: scale(0.5);
            transition: all 0.3s ease-in-out;
        }

        &.drop {
            opacity: 1;
            pointer-events: all;

            i {
                color: $palette-sweet-red;
                transform: none;
            }
        }
    }

</style>
