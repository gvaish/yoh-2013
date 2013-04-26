/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('ylatest', function(Y, NAME) {

    Y.namespace('mojito.controllers')[NAME] = {

        index: function(ac) {
			ac.assets.addCss('./index.css');
			ac.done({});
        },

		getAll: function(ac) {
			var city = ac.params.body('city');

			if(!city) {
				ac.done("Missing city");
			} else {
				ac.models.get('ylatestModelFoo').fetchAll(city, function(error, response) {
					ac.done(response, "flickr");
				});
			}
		}
    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'ylatestModelFoo', 'mojito-params-addon', 'json' ]});
