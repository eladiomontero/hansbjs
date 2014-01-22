(function($){
	
	var AccountModel= Backbone.Model.extend({
		defaults: { account_id: 0, name: "" }
	});

	var AccountCollection=Backbone.Collection.extend({
		model: AccountModel
	});
	/* Models */
	var FilterModel = 
		Backbone.Model.extend({
			defaults: { filter: '', include: true },
		
		});

	var FilterCollection = 
		Backbone.Collection.extend({
			model: FilterModel
		});
		
	var AggregatorModel =
		Backbone.Model.extend({
			defaults: { 
				name: "Name", 
				type: 0,
				filters: new FilterCollection() },
			
		});
	
		
	/* Views */
	var AccountView=Backbone.View.extend({
		events: {
			this.model.on("change"): this.render()
		}
		render()
	});

	var AggregatorView = 
		Backbone.View.extend({
			template: _.template(' Name: <%= name %>. Type: <%= type %>'),
			render: function(){
				var html = this.template({
					name: this.model.get('name'),
					type: this.model.get('type'),
				});
			$(this.el).html(html);
			}
		});
		
	var FilterView = 
		Backbone.View.extend({
			template: _.template(' Filter: <%= filter %>. Include: <%= include %>'),
			render: function(){
				var html= this.template({
					filter: this.model.get('filter'),
					include: this.model.get('include')
				});
			$(this.el).html(html);
			}
		});
		
	/* Routes */	
	var Workspace = 
		Backbone.Router.extend({
			routes: {'': 'aggregator',
					 'aggregator': 'aggregator',
					 'filter':  'filter',
					 'filter/:id' : 'filterById',
					 'filters' : 'filters'
					 },
					 
			aggregator : function(){
				var aggregatorModel = new AggregatorModel({ name: "Name", type: "filter" });
				var aggregatorView = new AggregatorView({
					el: 'body',
					model: aggregatorModel
				});
				aggregatorView.render();
			},
			
			filter: function(){
				var filterModel = new FilterModel({ filter: 'blog/', include: 'true' });
				var filterView = new FilterView({
					el: 'body',
					model: filterModel
				});
				filterView.render();
			},
			
			filterById : function(id){
				var filterCollection = new FilterCollection([
					{ filter: '/blog/*', include: true},
					{ filter: '/blog/', include: false}
				]);
				var filterView = new FilterView({
					el: 'body',
					model: filterCollection.at(id)
				});
				filterView.render();
			},
			
			filters : function(){
				var filterCollection = new FilterCollection([
					{ filter: '/blog/*', include: true},
					{ filter: '/blog/', include: false}
				]);
				var aggregatorModel = new AggregatorModel({
					name: "Name", 
					type: "filter",
					filters: filterCollection
				});
				
			}
		});
	
	$(document).ready(function(){
		new Workspace();
		Backbone.history.start();
	});
})(jQuery);