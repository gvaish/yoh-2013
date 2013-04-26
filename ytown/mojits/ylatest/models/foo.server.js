/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('ylatestModelFoo', function(Y, NAME) {

	var SQL_FMT = "select * from flickr.photos.search(5) where text='{query}' and api_key='eafe95efe443d72b1344b49f1f87ee99'";

    Y.namespace('mojito.models')[NAME] = {

        init: function(config) {
            this.config = config;
        },

		fetchAll: function(city, callback) {
			var sql = Y.Lang.sub(SQL_FMT, { query: city });
			Y.YQL(sql, function(response) {
				Y.log('response:' + Y.JSON.stringify(response));
				callback(null, response.query.results);
			});
		}
    };

}, '0.0.1', {requires: [ 'yql', 'json' ]});
