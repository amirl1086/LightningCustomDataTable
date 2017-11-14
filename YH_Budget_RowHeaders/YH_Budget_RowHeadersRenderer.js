({
	
	//will fire after item is added - focus on the item name and select the text
	/*rerender: function(cmp, helper) {
		this.superRerender();
		
		var budgetItems = cmp.get('v.budgetItems');
		var newItemIndex = budgetItems.findIndex(function(item) { return item.isNew });
		
		if(newItemIndex >= 0) {
			var tableRowHeaders = cmp.find('budgetItemRowHeader');
			tableRowHeaders[newItemIndex].focus();
		}
	}*/
	
})