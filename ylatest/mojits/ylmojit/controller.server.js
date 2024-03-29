/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('ylmojit', function(Y, NAME) {

	var QUERY_FMT = "select * from yql.query.multi where queries=\""
		+ "select * from twitter.search(5) where q='{query}';"
		+ "select * from weather.bylocation(5) where location='{query}';"
		+ "select * from flickr.photos.search(5) where text='{query}' and api_key='eafe95efe443d72b1344b49f1f87ee99';"
		+ "select * from boss.search(5) where q='{query}' and ck='' and secret='' and service='news' and count=5"
		+ "\"";

    Y.namespace('mojito.controllers')[NAME] = {

        index: function(ac) {
			ac.assets.addCss('./index.css');
			ac.done({});
        },

		getAll: function(ac) {
			var city = ac.params.body('city'),
				q = {};

			if(city) {
				q.query = city;
				sql = Y.Lang.sub(QUERY_FMT, q);

				Y.log('final query: ' + sql, 'warn', NAME);
				Y.YQL(sql, function(e) {
					//Y.log('e: ' + Y.JSON.stringify(e), 'warn', NAME);
					var r = e.query.results.results,
						twitter = r[0].results,
						weather = r[1].weather.rss.channel,
						flickr = r[2].photo,
						boss = r[3].bossresponse;

					//Y.log('Twitter: ' + Y.JSON.stringify(twitter), 'warn', NAME);
					//Y.log('Photos: ' + Y.JSON.stringify(flickr), 'warn', NAME);
					//Y.log('Weather: ' + Y.JSON.stringify(weather), 'warn', NAME);
					//Y.log('BOSS: ' + Y.JSON.stringify(boss), 'warn', NAME);
					ac.done({photos: flickr, tweets: twitter, weather: weather, search: boss.news.results.result},
						'data');
				});
			} else {
				ac.done('Error - no city');
			}
		}
    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'mojito-params-addon', 'yql']});
