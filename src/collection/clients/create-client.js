define(['streamhub-sdk/util', 'streamhub-sdk/jquery', 'base64'], function(util, $) {
    'use strict';

    /**
     * A Client for creating a Livefyre collection
     * @exports streamhub-sdk/collection/clients/create-client
     */
    var LivefyreCreateClient = function () {};

    /**
     * Fetches data from the livefyre bootstrap service with the arguments given.
     * @param opts {Object} The livefyre collection options.
     * @param opts.network {string} The name of the network in the livefyre platform
     * @param opts.siteId {string} The livefyre siteId for the conversation
     * @param opts.articleId {string} The livefyre articleId for the conversation
     * @param opts.environment {?string} Optional livefyre environment to use dev/prod environment
     * @param opts.signed {?boolean} Specified true when collectionMeta is a token string.
     * @param opts.checksum {?string} Required if collectionMeta is a token string.
     * @param opts.collectionMeta {Object|string} This is an object or a token string.
     *          (per https://github.com/Livefyre/livefyre-docs/wiki/StreamHub-Integration-Guide)
     *          that contains data required for creating a collection.
     * @param opts.collectionMeta.url {?string} Required when not signed. URL of the page creating the collection.
     * @param opts.collectionMeta.title {?string} Optional title for the new collection.
     * @param opts.collectionMeta.tags {?string} Optional comma separated tag names.
     * @param callback {function(?Object, Object=)} A callback that is called upon success/failure of the
     *     bootstrap request. Callback signature is "function(error, data)".
     */
    LivefyreCreateClient.prototype.createCollection = function(opts, callback) {
        callback = callback || function() {};

        var url = [
        //api/v3.0/site/<siteId>/collection/create
            'http://quill.',
            (opts.network === 'livefyre.com') ? opts.environment || 'livefyre.com' : opts.network,
            '/api/v3.0/site/',
            opts.siteId,
            '/collection/create'
        ].join("");
        
        var collectionMeta = opts.collectionMeta;
        if (!collectionMeta) {
            callback({'responseText': 'User error: Missing collectionMeta.'});
            return;
        }
        
        var postData = {
                'collectionMeta': collectionMeta,
            };
        (typeof(opts.signed) == 'boolean') && (postData.signed = opts.signed);
        !postData.signed && (postData.collectionMeta.articleId = opts.articleId);
        opts.checksum && (postData.checksum = opts.checksum);
        postData = JSON.stringify(postData);
        
        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            success: function(data, status, jqXhr) {
                // todo: (genehallman) check livefyre stream status in data.status
//                debugger
                callback(null, data);
            },
            error: function(jqXhr, status, err) {
//                debugger
                callback(err);
            }
        });
    };

    return LivefyreCreateClient;

});