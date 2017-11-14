({
	scrollRows : function(cmp, event, helper) {
		var args = event.getParam('arguments');
		var horizontalScrollIndex = args.horizontalScrollIndex;
		var tableRows = cmp.find('table-rows');
		tableRows.getElement().scrollTop = horizontalScrollIndex;
	},
	
	handleRows: function(cmp, event) {
		var rowAction = event.getSource().get('v.name').split(',');
		var handleRowsEvent = cmp.getEvent('handleRowsEvent');
		handleRowsEvent.setParams({ 'action': rowAction[0], 'rowIndex': rowAction[1] });
		handleRowsEvent.fire();
	}
})