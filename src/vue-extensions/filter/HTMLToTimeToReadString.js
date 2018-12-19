import Vue from 'vue';

Vue.filter('HTMLToTimeToReadString', html => {
    const {wordsPerMinute} = Vue.prototype.config;

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    const words = tmp.innerText.match(/\w+/g);

    if (words) {
        const readTime = Math.round(words.length / wordsPerMinute);
        return `${readTime < 1 ? '< 1' : readTime} min to read`;
    } else {
        return '< 1 min to read';
    }
});
