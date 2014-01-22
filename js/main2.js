(function($){
	//Models and Collections
	var AccountModel= Backbone.Model.extend({

	});

	var AccountCollection=Backbone.Collection.extend({
		model: AccountModel
	});

	var FilterModel = 
		Backbone.Model.extend({
		});

	var FilterCollection = 
		Backbone.Collection.extend({
			model: FilterModel
		});
		
	var AggregatorModel =
		Backbone.Model.extend({});


	var AggregatorCollection = 
		Backbone.Collection.extend({
		model: AggregatorModel
	});

	//Layouts
	var AccountLayout=Backbone.Layout.extend({
		template: "#acc_form",
		serialize: function(){
			return{
				accounts: _.chain(this.collection.models)
			};
		}
	});

	var AggregatorLayout=Backbone.Layout.extend({
		template: "#agg_form",
		serialize: function(){
			return{
				aggregators: _.chain(this.collection.models)
			};
		}
	});

	//Routes

	var router=Backbone.Router.extend({

		routes: {
			"":"page",
			"account/:id":"page"
		},
		initialize: function(){
			//Attach Collection and their data.
			accounts = new AccountCollection([
				//data from the xml
				{acc_id:1, name:"Account1"}, 
				{acc_id:2, name:"Account2"},
				{acc_id:3, name:"Account3"}
			]);
		},
		page: function(id){
			if (!id) {
        	// Set default id.
        		id = accounts.models[0].cid;
	      	}

	      	var aggregators= null;
            loadAggregators(1, function(d){
                aggregators= new AggregatorCollection();
                var json= $.xml2json(d);
                for (var i=0; i<json.aggregator.length; i++){
                   var model= new AggregatorModel(json.aggregator[i]);
                   aggregators.add(model);
                }
                var layout = new Backbone.Layout({
                    // Attach the layout to the main container.
                    el: "body",

                    // Set template selector.
                    template: "#layout",

                    // Declaratively bind a nested View to the layout.
                    views: {
                      "#acc_form": new AccountLayout({collection: accounts}),
                      "#agg_form": new AggregatorLayout({collection: aggregators})
                    }
                });

                layout.render();
            });//load
		}
	});

    function loadAggregators(id_account, cb){
        var x = $.ajax({
            url:"GET-aggregator-by_account-1.xml",
            type:"GET",
            dataType : 'xml',
            success: function(d){
                cb(d);
            }
        });
    }

	$(document).ready(function () {

    // Create the workspace.
	    new router();

	    // Start the application.
	    Backbone.history.start();
  	});

})(jQuery);