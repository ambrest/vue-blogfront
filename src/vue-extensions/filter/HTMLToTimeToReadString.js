import Vue from 'vue';

Vue.filter('HTMLToTimeToReadString', html => {
    const {wordsPerMinute} = Vue.prototype.config;

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    const readTime = Math.round(tmp.innerText.match(/\w+/g).length / wordsPerMinute);
    return `${readTime < 1 ? '< 1' : readTime} min to read`;
});
