<template>
    <div class="me">

        <h1>{{ auth.user.fullname }} aka. {{ auth.user.username }}</h1>

        <div :class="{'profile-picture': 1, empty: !auth.user.profilePicture}" @click="changePicture">
            <profile-picture ref="profilePicture"
                             :user="auth.user"
                             :disable-link="true"/>
            <i class="fas fa-fw fa-pencil-alt"></i>
        </div>

        <!-- Edit about text -->
        <text-area-input-field ref="inAbout"
                               :no-border="true"
                               placeholder="Enter a short bio..."
                               @update="updateRequired = true"/>

        <p class="error">{{ errorMsg }}</p>

        <button :class="{'button-primary': 1, visible: updateRequired}" @click="submit">Update</button>
    </div>
</template>

<script>

    // UI Components
    import TextInputField     from '../../ui/TextInputField';
    import TextAreaInputField from '../../ui/TextAreaInputField';
    import ProfilePicture     from '../../components/ProfilePicture';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {TextInputField, TextAreaInputField, ProfilePicture},

        data() {
            return {
                errorMsg: '',
                updateRequired: false
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
                }).then(() => {
                    inAbout.setContent(this.auth.user.about);
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
                        }).then(() => {
                            this.$refs.profilePicture.loadImg();
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
        }

        .profile-picture {
            @include size(5em);
            @include flex(row, center, center);
            position: relative;
            margin: 0.5em 0;
            border-radius: 100%;
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

            &:hover {
                &:not(.empty) img {
                    filter: grayscale(1) brightness(0.5);
                }

                &.empty {
                    .profile-picture-placeholder {
                        opacity: 0;
                    }
                }

                i {
                    opacity: 1;
                }
            }
        }

        .text-area-input-field {
            font-family: $font-family-article-stack;
            margin-top: 1.25em;
        }
    }

</style>
