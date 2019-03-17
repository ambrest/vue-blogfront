<template>
    <div class="me">

        <h1>{{ auth.user.fullname }} aka. {{ auth.user.username }}</h1>

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

        .text-area-input-field {
            font-family: $font-family-article-stack;
        }
    }

</style>
