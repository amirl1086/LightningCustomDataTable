({

	scrollHeaders : function(cmp, event, helper) {
		var args = event.getParam('arguments');
		var verticalScrollIndex = args.verticalScrollIndex;
		var tableHeader = cmp.find('table-headers');
		tableHeader.getElement().scrollLeft = verticalScrollIndex;
	},
	
	handleYears: function(cmp, event) {
		//the event name contains the method information - js method to apply (and the index clicked, in case of deletion)
		var methodInfo = event.getSource().get('v.name');
		
		//if the add button was clicked (append or prepend)
		if(methodInfo !== 'push' && methodInfo !== 'unshift') {
			var methodInfoArr = methodInfo.split(',');
			var index = parseInt(methodInfoArr[1]);
			
			//get the element to remove - set event listener to know when the transition was finished and the item can be deleted
			var yearColumnElement = event.getSource().getElement().parentElement;
			yearColumnElement.addEventListener('transitionend', function() {
				var removeBudgetYearEvent = cmp.getEvent('removeBudgetYear');
				removeBudgetYearEvent.setParams({'dataObject': { 'remove': true, 'index': index }});
				removeBudgetYearEvent.fire();
			});
		}
		
		//
		var handleYearsEvent = cmp.getEvent('handleYearsEvent');
		handleYearsEvent.setParams({ 'method': methodInfo });
		handleYearsEvent.fire();
	}
	
})