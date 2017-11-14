({
	
	getBudgetDataByGrant : function(cmp, helper) {
		var grantId = cmp.get('v.recordId');
        var action = cmp.get('c.getLatestBudgetByGrant');
        
        action.setParams({
            'grantId': grantId
        });
        
        action.setCallback(this, function(response){ 
            var state = response.getState();
            if (cmp.isValid() && state === 'SUCCESS') {
                var tableData = response.getReturnValue();
                if (tableData) {
                	//1. initialize data table data
                	helper.prepareItems(cmp, helper, tableData);
                	
                	//2. set the multi selection options
                	helper.setFilterOptions(cmp);
                }
                else {
                	var errorHandler = cmp.find('errorHandler');
                    errorHandler.showToast_error('Error', 'YH_Budget_MainView Failed to get grant record.');
                }
            }
            else {
                var errorHandler = cmp.find('errorHandler'); 
                errorHandler.handleResponse(response);
            }
        });
        $A.enqueueAction(action); 
	},
	
	prepareItems: function(cmp, helper, tableData) { 
		var budgetItemsData = [];
		var budgetItems = tableData.budget.Budget_Items__r;
		var budgetYearItems = tableData.budgetYearItems;
		
		//loop over budget year items
		for(key in budgetYearItems) {
			//find the budget object 
			var currBudgetItem = budgetItems.find(function(budget, index) { 
				if(budget.Id === budgetYearItems[key].Budget_Item__c) {
					return true;
				}
			});
			//this array represent the related data of the current budget item (for easy iteration)
			if(!currBudgetItem.data) { 
				currBudgetItem.data = [];
			}
			
			//sum the current year payments
			budgetYearItems[key].payment = helper.sumCurrentYearPayments(tableData.budgetPayments, budgetYearItems[key]);
			
			//add the item to the array
			currBudgetItem.data.push(budgetYearItems[key]);
		}
		
		//add empty first and last year for transition effects
		tableData.budget.Budget_Years__r.unshift({'isHidden': true});
		tableData.budget.Budget_Years__r.push({'isHidden': true});
		
		//set all items to visible
		for(var i = 0; i < tableData.budget.Budget_Items__r.length; i++) {
			tableData.budget.Budget_Items__r[i].isVisible = true;
			
			//for each item - add hidden first and last cells
			tableData.budget.Budget_Items__r[i].data.unshift({'isHidden': true});
			tableData.budget.Budget_Items__r[i].data.push({'isHidden': true});
		}
		
        cmp.set('v.budgetItems', tableData.budget.Budget_Items__r);
        cmp.set('v.budgetYears', tableData.budget.Budget_Years__r);
        
        cmp.set('v.tableData', tableData);
        cmp.set('v.clonedTableData', Object.assign({}, tableData));
	},
	
	sumCurrentYearPayments: function(budgetPayments, budgetYearItem) {
		var total = 0;
		for(index in budgetPayments) {
			//check if the year is the current
			if(new Date(budgetPayments[index].Payday__c).getFullYear() === parseInt(budgetYearItem.Budget_Year__r.Name)) {
				//if so, find the budget payemnt item
				var currPaymentItem = budgetPayments[index].Payment_Items__r.find(function(paymentItem){ return paymentItem.Name === budgetYearItem.Budget_Item__r.Name});
				if(currPaymentItem) {
					//add the payment amount to the current total
					total += currPaymentItem.Amount__c;
				}
			}
		}
		return total;
	},
	
	setFilterOptions: function(cmp) {
		var filterOptions = [
			{ value: 'project', label: $A.get('$Label.c.YH_Budget_Project'), selected: true },
			{ value: 'yh', label: $A.get('$Label.c.YH_Budget_YH'), selected: true },
			{ value: 'paid', label: $A.get('$Label.c.YH_Budget_Paid'), selected: true }
		];
		
		cmp.set('v.filterOptions', filterOptions);
	},
	
	cancelEdit: function(cmp) {
		cmp.set('v.isEditEnabled', !cmp.get('v.isEditEnabled'));
		cmp.set('v.tableData', Object.assign({}, cmp.get('v.clonedTableData')));
		
		/*TODO*/
	},
	
	saveVersion: function(cmp) {
		cmp.set('v.isEditEnabled', !cmp.get('v.isEditEnabled'));
		
		/*TODO*/
	},
	
})