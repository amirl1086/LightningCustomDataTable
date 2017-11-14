({
	doneEditing: function(cmp, action) {
		var doneEditingEvent = cmp.getEvent('doneEditingEvent');
		doneEditingEvent.setParams({'dataObject': action});
		doneEditingEvent.fire();
	}
})