import Vue from 'vue';

Vue.filter('HTMLToTimeToReadString', html => {
    const {wordsPerMinute} = Vue.prototype.config;

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    const wordCount = tmp.innerText.match(/\w+/g).length;
    const readTime = Math.round(wordCount / wordsPerMinute);

    return `${readTime < 1 ? '< 1' : readTime} minute${readTime > 1 ? 's' : ''} to read`;
});
