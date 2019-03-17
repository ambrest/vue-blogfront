<template>
    <div class="settings small">

        <h1>Settings</h1>

        <text-input-field ref="inFullName"
                          placeholder="Change full name"
                          @submit="submit"/>

        <text-input-field ref="inEmail"
                          :error="errorEmail"
                          placeholder="Change E-Mail"
                          @submit="submit"/>

        <text-input-field ref="inPassword"
                          :error="errorPassword"
                          :password="true"
                          placeholder="Change password"
                          @submit="submit"/>

        <text-input-field ref="inPasswordRepeat"
                          :error="errorPassword"
                          :password="true"
                          placeholder="Repeat new password"
                          @submit="submit"/>

        <p class="error">{{ errorMsg }}</p>

        <button class="button-primary" @click="submit">Update</button>

    </div>
</template>

<script>

    // UI Components
    import TextInputField     from '../../ui/TextInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {TextInputField},

        data() {
            return {
                errorPassword: false,
                errorEmail: false,
                errorMsg: ''
            };
        },

        computed: {
            ...mapState(['auth'])
        },

        methods: {

            submit() {
                const {inFullName, inEmail, inPassword, inPasswordRepeat} = this.$refs;
                this.errorEmail = this.errorPassword = false;
                this.errorMsg = '';

                // Validate passwords
                if ((inPassword.value.length || inPasswordRepeat.value.length) && inPassword.value !== inPasswordRepeat.value) {
                    this.errorPassword = true;
                    this.errorMsg = 'Password\'s are not indentical.';
                    return;
                }

                // Validate Email
                if (inEmail.value.length > 0 && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inEmail.value)) {
                    this.errorEmail = true;
                    this.errorMsg = 'Invalid Email.';
                    return;
                }

                // Fire auth
                this.$store.dispatch('auth/updateProfileData', {
                    fullname: inFullName.value || null,
                    email: inEmail.value || null,
                    password: inPassword.value || null
                }).then(() => {
                    inFullName.clear();
                    inEmail.clear();
                    inPassword.clear();
                    inPasswordRepeat.clear();
                }).catch(reason => {
                    this.errorMsg = reason;
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .settings {

        .error {
            margin-top: 1em;
        }

        > button {
            width: 100%;
        }

        .text-input-field {
            margin-top: 0.75em;
            @include width(13em, 0, 100vw)
        }
    }

</style>
