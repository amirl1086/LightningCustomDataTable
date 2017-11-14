({

	afterRender: function(cmp, helper) {
		this.superAfterRender();
		
		cmp.set('v.columnHeadersCmp', cmp.find('columnHeadersCmp'));
		cmp.set('v.columnRowsCmp', cmp.find('rowHeadersCmp'));
	}
	
})