<template>
    <section class="login small">

        <h1 v-if="!send">Reset Your Password!</h1>

        <div v-if="!send" class="input">

            <!-- Text fields -->
            <text-input-field ref="inEmail"
                              :error="errorEmail"
                              placeholder="Your email"
                              @submit="submit"/>

            <!-- Error message -->
            <p class="error">{{ errorMsg }}</p>

            <!-- Submit button -->
            <button class="button-primary" @click="submit()">Request password reset!</button>
        </div>

        <!-- Confirmation box -->
        <confirmation v-if="send"
                      msg="We've sent you an reset link!"
                      sub="Please check your E-Mails"/>

    </section>
</template>

<script>

    // Confirmation
    import Confirmation from '../../components/Confirmation';

    // UI Components
    import TextInputField from '../../ui/TextInputField';

    export default {
        components: {TextInputField, Confirmation},

        data() {
            return {
                errorMsg: '',
                errorEmail: false,
                send: false
            };
        },

        methods: {

            submit() {
                const {inEmail} = this.$refs;
                this.errorEmail = false;
                this.errorMsg = '';

                // Validate Email
                if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inEmail.value)) {
                    this.errorEmail = true;
                    this.errorMsg = 'Invalid Email.';
                    return;
                }

                // Fire auth
                this.$store.dispatch('auth/resetPassword', {
                    email: inEmail.value
                }).then(() => {
                    this.send = true;
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
