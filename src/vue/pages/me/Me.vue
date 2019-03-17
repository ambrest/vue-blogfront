<template>
    <div class="me">

        <h1>{{ auth.user.fullname }} aka. {{ auth.user.username }}</h1>

        <div :class="{'profile-picture': 1, empty: !auth.user.profilePicture}" @click="changePicture">
            <img v-if="auth.user.profilePicture"
                 :src="auth.user.profilePicture"
                 :alt="auth.user.fullname">
            <i class="fas fa-fw fa-pencil-alt"></i>
        </div>

        <!-- Edit about text -->
        <text-area-input-field ref="inAbout"
                               :no-border="true"
                               placeholder="Enter a short bio..."/>

        <p class="error">{{ errorMsg }}</p>

        <button class="button-primary" @click="submit">Update</button>
    </div>
</template>

<script>

    // UI Components
    import TextInputField     from '../../ui/TextInputField';
    import TextAreaInputField from '../../ui/TextAreaInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {TextInputField, TextAreaInputField},

        data() {
            return {
                errorMsg: ''
            };
        },

        computed: {
            ...mapState(['auth'])
        },

        mounted() {
            this.$refs.inAbout.value = this.auth.user.about || '';
        },

        methods: {

            submit() {
                const {inAbout} = this.$refs;
                this.errorMsg = '';

                // Fire auth
                this.$store.dispatch('auth/updateProfileData', {
                    about: inAbout.value || null
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            },

            changePicture() {
                this.utils.selectFile(file => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        const {result} = reader;
                        this.errorMsg = '';

                        // Fire auth
                        this.$store.dispatch('auth/updateProfileData', {
                            profilePicture: result
                        }).catch(reason => {
                            this.errorMsg = reason;
                        });
                    };

                    reader.readAsDataURL(file);
                }, ['jpg', 'jpeg', 'png', 'webp']);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .me {
        @include flex(column);

        > button {
            width: 100%;
            margin-top: 0.25em;
        }

        .profile-picture {
            @include size(5em);
            @include flex(row, center, center);
            position: relative;
            margin: 0.5em 0;
            border-radius: 100%;
            background: rgba($palette-slate-gray, 0.1);
            border: 1px solid rgba($palette-slate-gray, 0.05);
            overflow: hidden;
            cursor: pointer;

            img {
                @include size(100%);
                transition: all 0.3s;
            }

            i {
                position: absolute;
                margin: auto;
                color: $palette-snow-white;
                opacity: 0;
                transition: all 0.3s;
            }

            &:not(.empty):hover {

                img {
                    filter: grayscale(1) brightness(0.5);
                }

                i {
                    opacity: 1;
                }
            }

            &.empty {
                &::before,
                &::after {
                    @include pseudo();
                    @include position(0, 0, 0, 0);
                    border: 2px solid $palette-slate-gray;
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
        }

        .text-area-input-field {
            font-family: $font-family-article-stack;
        }
    }

</style>