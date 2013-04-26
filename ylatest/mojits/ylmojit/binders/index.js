/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('ylmojitBinderIndex', function(Y, NAME) {

	var QUERY_FMT = "select * from query.multi where queries=\""
		+ "select * from upcoming.events(5) where tags='{query}';"
		+ "select * from twitter.search(5) where q='{query}';"
		+ "select * from weather.bylocation(5) where location='{query}' and unit='metric';"
		+ "select * from flickr.photos.search(5) where text='{query}' and api_key='eafe95efe443d72b1344b49f1f87ee99'"
		+ "\"",

	FLICKR_FMT = "<img src='http://farm{farm}.staticflickr.com/{server}/{id}_{secret}.jpg' width='200'>",
	TWITTER_FMT = "<div class='item'><div><a href='http://twitter.com/{from_user}/status/{id_str}'>{text}</a><div><div>by <span class='b'><a href='http://twitter.com/{from_user}' target='_blank'>{from_user}</a></span></div></div>",
	WEATHER_FMT = "<div>Temperature: <b>{temp} &deg;F</b></div><div>Condition: <b>{text}</b></div>",
	EVENT_FMT = "<div class='item'><div><a href='{ticket_url}' target='_blank'>{name}</a></div><div>at <span class='b'>{venue_address}</span></div></div>";

    Y.namespace('mojito.binders')[NAME] = {

        init: function(mojitProxy) {
            this.mojitProxy = mojitProxy;
        },

        bind: function(node) {
            var me = this;
            this.node = node;
			this.city = node.one('#city');
			this.events = node.one('#events');
			this.flickr = node.one('#flickr');
			this.weather = node.one('#weather');
			this.twitter = node.one('#twitter');

			this.city.on('keypress', function(e) {
				//Y.log('Keys: ' + Y.Object.keys(e));
				if(e.charCode == 13)
				{
					e.preventDefault();
					e.stopPropagation();
					me.fireAndRenderServer(e);
				}
			});
        },

		fireAndRenderServer: function(e) {
			var me = this,
				city;

			this.city.setAttribute('disabled', 'disabled');
			city = this.city.get("value");
			this.mojitProxy.invoke('getAll', { params: { body: { city: city }}}, function(err, response) {
				if(!err) {
					me.node.one('#results').set('innerHTML', response);
				}
				me.city.removeAttribute('disabled');
			});
		},

		fireAndRender: function(e) {
			var me = this,
				q = {},
				sql;

			me.city.setAttribute('disabled', 'disabled');
			q.query = me.city.get("value");
			sql = Y.Lang.sub(QUERY_FMT, q);
			Y.log('final sql: "' + sql + '"');

			Y.YQL(sql, function(e) {
				var r = e.query.results.results,
					events = r[0] ? r[0].event : [],
					twitter = r[1].results,
					weather = r[2].weather.rss.channel,
					flickr = r[3].photo;

				try {
					if(me.flickr) {
						me.processFlickr(flickr);
					}
					if(me.events) {
						me.processEvents(events);
					}
					if(me.twitter) {
						me.processTwitter(twitter);
					}
					if(me.weather) {
						me.processWeather(weather);
					}
				} catch(e) {
					Y.log('Error: ' + e);
				} finally {
					me.city.removeAttribute('disabled');
				}
			});
		},

		processFlickr: function(data) {
			var msg = [];
			for(var idx = 0; idx < data.length; idx++) {
				msg.push(Y.Lang.sub(FLICKR_FMT, data[idx]));
			}
			this.flickr.set('innerHTML', '<div class=".ss">' + msg.join('') + '</div>');
			new Y.ScrollView({
				'srcNode': this.flickr.one('.ss'),
				'width': 200
			}).render();
		},

		processTwitter: function(data) {
			var msg = [];
			for(var idx = 0; idx < data.length; idx++) {
				msg.push(Y.Lang.sub(TWITTER_FMT, data[idx]));
			}
			this.twitter.set('innerHTML', msg.join('<br/>'));
		},

		processEvents: function(data) {
			var l = data.length,
				msg = [];

			Y.log('[processEvents] data: ' + Y.JSON.stringify(data));
			Y.log('[processEvents] l: ' + l);
			if(!l) {
				if(l === undefined && (data.ticket_url || data.venue_url || data.url) && (data.name || data.description)) {
					data.name = data.name || data.description || 'Not Provided';
					data.ticket_url = data.ticket_url || data.venue_url || data.url || 'javascript:void(0)';
					this.events.set('innerHTML', Y.Lang.sub(EVENT_FMT, data));
				} else {
					this.events.set('innerHTML', 'No events found');
				}
				return;
			}

			for(var idx = 0; idx < l; idx++)
			{
				//msg.push(Y.JSON.stringify(data[idx]));
				data[idx].name = data[idx].name || data[idx].description || 'Not Provided';
				data[idx].ticket_url = data[idx].ticket_url || data[idx].venue_url || data[idx].url || 'javascript:void(0)';
				if(data[idx].name.length > 30) {
					data[idx].name = data[idx].name.substring(0, 30) + '&#8230;';
				}
				msg.push(Y.Lang.sub(EVENT_FMT, data[idx]));
			}
			this.events.set('innerHTML', msg.join('<br/>'));
		},

		processWeather: function(data) {
			var item = data.item,
				cond = item.condition;

			//Y.log('weather data: ' + Y.JSON.stringify(cond));
			this.weather.set('innerHTML', Y.Lang.sub(WEATHER_FMT, cond));//Y.JSON.stringify(cond));
		}
    };

}, '0.0.1', {requires: ['event', 'mojito-client', 'yql', 'scrollview']});
