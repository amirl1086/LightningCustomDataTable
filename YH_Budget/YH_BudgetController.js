({

	doInit: function(cmp, event, helper) {
		//get the raw budget data
		helper.getBudgetDataByGrant(cmp, helper);
	},
	
	doneEditing: function(cmp, event, helper) {
		var action = event.getParam('dataObject');
		
		//take action
		if(action === 'save') {
			helper.saveVersion(cmp);
		}
		else {
			helper.cancelEdit(cmp);
		}
	},
	
    openPicture: function(component, event, helper) {
		 window.open("https://yadhanadiv--dev3--c.cs21.content.force.com/servlet/servlet.ImageServer?id=015q0000000dTbY&oid=00Dq0000000Bs73&lastMod=1510236467000", "_blank", "width=1000,height=500");
	}
	
})