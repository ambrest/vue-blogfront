<template>
    <div class="confirmation">

        <svg class="check"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 50 50">
            <path d="M7,25L17.571,38,44,12"></path>
        </svg>

        <p class="msg">{{ msg }}</p>
        <p class="sub">{{ sub }}</p>

    </div>
</template>


<script>

    export default {
        props: {
            msg: {
                type: String,
                required: true
            },
            sub: {
                type: String,
                default: ''
            }
        }
    };

</script>


<style lang="scss" scoped>

    .confirmation {
        @include flex(column, center, center);
        height: 100%;
        flex-grow: 1;
        opacity: 0;

        @include animate('1s ease forwards') {
            to {
                opacity: 1;
            }
        }
    }

    .check {
        fill: none;
        @include size(10em);
        @include stroke($palette-slate-gray, 0.1em, round, 100, 100);

        @include animate('2s ease forwards') {
            to {
                stroke-dashoffset: 0;
            }
        }
    }

    .msg {
        position: relative;
        @include font(400, 1.5em, 0.05em);
        color: $palette-slate-gray;
    }

    .sub {
        margin-top: 1.5em;
        padding: 0.5em 0.8em 0.4em 0.8em;
        color: $palette-slate-gray;
    }

    @include MQPhones {
        .ok {
            font-size: 0.65em;
        }
    }
</style>
