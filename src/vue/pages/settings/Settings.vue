<template>
    <div class="settings">

        <h1>Settings</h1>

        <text-input-field ref="inFullName"
                          :placeholder="$store.state.auth.user.fullname"
                          :error="errorFullname"
                          @submit="submit"></text-input-field>

        <text-input-field ref="inEmail"
                          :placeholder="$store.state.auth.user.email"
                          :error="errorEmail"
                          @submit="submit"></text-input-field>

        <text-input-field ref="inPassword"
                          :error="errorPassword"
                          :password="true"
                          placeholder="New password"
                          @submit="submit"></text-input-field>

        <text-input-field ref="inPasswordRepeat"
                          :error="errorPassword"
                          :password="true"
                          placeholder="Repeat new password"
                          @submit="submit"></text-input-field>

        <p class="error">{{ errorMsg }}</p>

        <button class="button-primary" @click="submit">Update</button>

    </div>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    export default {
        components: {TextInputField},

        data() {
            return {
                errorFullname: false,
                errorPassword: false,
                errorEmail: false,
                errorMsg: ''
            };
        },

        methods: {

            submit() {
                const {inFullName, inEmail, inPassword, inPasswordRepeat} = this.$refs;
                this.errorFullname = this.errorEmail = this.errorPassword = false;
                this.errorMsg = '';

                // Validate passwords
                if (inPassword.value !== inPasswordRepeat.value) {
                    this.errorPassword = true;
                    this.errorMsg = 'Password\'s are not indentical.';
                    return;
                }

                // Fire auth
                this.$store.dispatch('auth/updateCredentials', {
                    fullname: inFullName.value,
                    email: inEmail.value,
                    password: inPassword.value
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
            margin-top: 2em;
        }

        > button {
            width: 100%;
            margin-top: 0.25em;
        }

        .text-input-field {
            margin-top: 0.75em;
        }

    }

</style>
