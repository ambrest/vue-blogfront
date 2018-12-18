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

            .error {
                margin-top: 2em;
            }
        }
    }

</style>
