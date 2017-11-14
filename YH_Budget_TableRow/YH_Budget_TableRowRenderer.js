({

	//will fire after adding new row
	afterRender: function(cmp, helper) {
		this.superAfterRender();
		
		var rowItem = cmp.get('v.rowItem');
		if(!rowItem.isVisible && rowItem.isNew) {
			helper.fireRowDoneRenderingEvent(cmp, { 'add': true, 'name': rowItem.Name });
		}
		
	},
	
	//will fire after hiding the row to delete
	rerender: function(cmp, helper) {
		this.superRerender();
		
		var rowItem = cmp.get('v.rowItem');
		if(!rowItem.isVisible && !rowItem.isNew) {
			var budgetItemElement = cmp.find('table-data-row').getElement();
			
			//wait until transition process will finish
			budgetItemElement.addEventListener('transitionend', function() { 
				helper.fireRowDoneRenderingEvent(cmp, { 'remove': true, 'name': rowItem.Name });
			});
			
		}
	}
	
})