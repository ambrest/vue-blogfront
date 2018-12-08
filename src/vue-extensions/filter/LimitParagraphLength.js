import Vue from 'vue';

Vue.filter('LimitParagraphLength', text => {
    const {maxPostPreviewLength} = Vue.prototype.config;

    if (text.length > maxPostPreviewLength) {
        text = text.substring(0, maxPostPreviewLength) + '...';
    }

    return text;
});
