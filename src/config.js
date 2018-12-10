export default {

    // GraphQL API Endpoint
    apiEndPoint: 'http://localhost:4000/api',

    // Maximum length of an Article in the Homepage
    maxPostPreviewLength: 300,

    // Used to calculate the time to read an Article
    wordsPerMinute: 250,

    /**
     * Array of available permission. Can be toggled and therefore send to the server.
     * @type Array
     */
    availableUserPermissions: ['administrate', 'post', 'comment']
};
