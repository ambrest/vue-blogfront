<template>
    <section class="login">
        <h1>Join our community!</h1>

        <div class="input">

            <!-- Text fields -->
            <text-input-field ref="inEmail"
                              :error="errorEmail"
                              placeholder="Your email"></text-input-field>
            <text-input-field ref="inUsername"
                              :error="errorUsername"
                              placeholder="Username"></text-input-field>
            <text-input-field ref="inPassword"
                              :error="errorPassword"
                              :password="true"
                              placeholder="Password"></text-input-field>
            <text-input-field ref="inPasswordRepeat"
                              :error="errorPassword"
                              :password="true"
                              placeholder="Repeat Password"></text-input-field>

            <!-- Error message -->
            <p class="error">{{ errorMsg }}</p>

            <!-- Submit button -->
            <button class="button-primary" @click="submit()">Sign Up!</button>
        </div>

    </section>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    export default {

        components: {TextInputField},

        data() {
            return {
                errorMsg: '',
                errorPassword: false,
                errorEmail: false,
                errorUsername: false
            };
        },

        methods: {

            submit() {
                const {inEmail, inUsername, inPassword, inPasswordRepeat} = this.$refs;
                this.errorUsername = this.errorEmail = this.errorPassword = false;
                this.errorMsg = '';

                // Validate passwords
                if (inPassword.value !== inPasswordRepeat.value) {
                    this.errorPassword = true;
                    this.errorMsg = 'Password\'s are not indentical.';
                    return;
                }

                // Validate Email
                if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inEmail.value)) {
                    this.errorEmail = true;
                    this.errorMsg = 'Invalid Email.';
                    return;
                }

                // Fire auth
                this.$store.dispatch('auth/login', {
                    email: inEmail.value,
                    username: inUsername.value,
                    password: inPassword.value
                }).catch(reason => {
                    // TODO: Display error msg
                });
            }

        }

    };

</script>

<style lang="scss" scoped>

    .login {
        .input {
            @include flex(column);

            .text-input-field {
                margin: 0.75em 0 0.25em;
            }

            .error {
                @include font(500, 0.7em);
                color: $palette-sweet-red;
                margin-top: 4em;
                height: 1.5em;
            }
        }
    }

</style>
