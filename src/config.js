export default {

    // Maximum length of an Article in the Homepage
    maxPostPreviewLength: 300,

    // Used to calculate the time to read an Article
    wordsPerMinute: 250,

    /**
     * Messages which are show during loading.
     * If the type is an Array a random element will be picked on every
     * re-appear.
     *
     * @type String | Array | null
     */
    loadingScreenMessages: [
        'Smoothing buttons',
        'Procentually generating icons',
        'Dropping shadows',
        'Eliminating errors',
        'Wiping UI clean',
        'Reading discette',
        'Baking cookies',
        'Serving cookies',
        'Polishing input fields',
        'Organizing folders',
        'Writing expense reports',
        'Hiding errors under the rug',
        'Designing icons',
        'The cake is a lie!',
        'Calculating the meaning of life, the universe and everything',
        'Polarizing matrices',
        'Good Morning, Mr. Freeman.',
        'Todo: remove arrow from knee',
        'Baaaaaa!',
        'Remembering to bring a towel',
        'Excuse me, it\'s called a "feature'
    ],

    /**
     * Array of available permission. Can be toggled and therefore send to the server.
     * @type Array
     */
    availableUserPermissions: ['admin', 'post', 'comment']
};
