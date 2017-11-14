({
	
	toggleEditMode : function(cmp, event, helper) {
		cmp.set('v.isEditEnabled', !cmp.get('v.isEditEnabled'));
	},
	
	doneEditing: function(cmp, event, helper) {
		//get the name of the button clicked - save or cancel
		var action = event.getSource().get('v.name');
		
		//call helper method to fire the event to the table cmp
		helper.doneEditing(cmp, action);
	}
	
})