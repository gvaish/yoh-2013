/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('ylatestBinderIndex', function(Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function(mojitProxy) {
            this.mojitProxy = mojitProxy;
        },

        bind: function(node) {
            var me = this;
            this.node = node;

			node.one('#city').on('keypress', function(e) {
				if(e.charCode == 13) {
					//*
					me.mojitProxy.invoke('getAll', { 'params': { 'body': { 'city': e.target.get('value')}}}, function(err, resp) {
						if(!err) {
							node.one(".flickr").set('innerHTML', resp);
						}
					});
					//*/
					/*
					me.mojitProxy.refreshView({ 'params': { 'body': { 'city': e.target.get('value')}}}, function() {
						Y.log('refresh view callback - arguments: ' + arguments.length, 'warn', NAME);
						Y.log('argument[0]: ' + arguments[0]);
					});
					//*/
				}
			});
        }
    };

}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
