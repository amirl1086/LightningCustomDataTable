({
	
	scrollTable : function(cmp, event, helper) {
		helper.scrollTable(cmp, event);
	},
	
	setTableSize: function(cmp, event, helper) {
		helper.setTableSize(cmp, helper);
	},
	
	//this method will invoke once adding or removing a year was clicked
	//1. if a year was added - just add it and start transition
	//2. if a year was removed - hide the year column and wait till the transition end - then, removeYear function will run
	handleYears: function(cmp, event, helper) {
		var method = event.getParam('method');
		
		if(method === 'push' || method === 'unshift') {
			helper.addYear(cmp, event, helper)
		}
		else {
			helper.hideYear(cmp, event, helper);
		}
	},
	
	//this method will invoke once adding or removing a budget item was clicked
	//1. if an item was added - just add it and start transition
	//2. if an item was removed - hide the row and wait till the transition end
	//3. in both cases toggleBudgetItems function will run afterwards because of transition issues
	handleRows: function(cmp, event, helper) {
		var action = event.getParam('action');
		
		if(action === 'add') {
			helper.addRow(cmp, event, helper);
		}
		else {
			helper.hideRow(cmp, event, helper);
		}
	},
	
	//as mentioned in step 3 above this hack is necessary to wait until the row is in the DOM and only then remove isHidden attribute 
	toggleBudgetItems: function(cmp, event, helper) {
		setTimeout(function() {
			helper.toggleBudgetItems(cmp, event, helper);
		}, 0);
	},
	
	removeYear: function(cmp, event, helper) {
		helper.removeYear(cmp, event, helper);
	}
	
})