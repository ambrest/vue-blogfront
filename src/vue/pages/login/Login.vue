<template>
    <section class="login small">

        <h1>Welcome back!</h1>

        <div class="input">

            <!-- Text fields -->
            <text-input-field ref="inUsername"
                              placeholder="Username"
                              @submit="submit"/>

            <text-input-field ref="inPassword"
                              :password="true"
                              placeholder="Password"
                              @submit="submit"/>

            <router-link class="forgotpassword" to="/forgotpassword">Forgot password?</router-link>

            <!-- Error message -->
            <p class="error">{{ errorMsg }}</p>

            <!-- Submit button -->
            <button class="button-primary" @click="submit()">Login!</button>
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
                errorMsg: ''
            };
        },

        methods: {

            submit() {
                const {inUsername, inPassword} = this.$refs;

                // Fire auth
                this.$store.dispatch('auth/login', {
                    username: inUsername.value,
                    password: inPassword.value
                }).then(() => {
                    this.$router.push('/');
                }).catch(reason => {
                    this.errorMsg = reason;
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

            .forgotpassword {
                @include font(500, 0.75em);
                color: $palette-grayish-blue;
                margin-top: 0.25em;
                transition: all 0.3s;

                &:hover {
                    color: $palette-sweet-magenta;
                }
            }

            .error {
                margin-top: 2em;
            }
        }
    }

</style>
