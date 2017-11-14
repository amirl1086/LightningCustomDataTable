({

	scrollTable: function(cmp, event) {
		var columnHeadersCmp = cmp.get('v.columnHeadersCmp');
		var rowHeadersCmp = cmp.get('v.columnRowsCmp');
		
		//call headers and rows nested components scroll functions
		columnHeadersCmp.scrollHeaders(event.srcElement.scrollLeft);
		rowHeadersCmp.scrollRows(event.srcElement.scrollTop);
	},
	
	setTableSize: function(cmp, helper) {
	
		//1. set selected filters
		helper.setSelectedFilters(cmp);
		var selectedFilters = cmp.get('v.selectedFilters');
		
		//2. calculate minimum cell width
		var numOfSelectedFilters = Object.keys(selectedFilters).length;
		cmp.set('v.innerCellPercentage', (100 / numOfSelectedFilters));
		var cellHeight = cmp.get('v.cellHeight');
		var cellWidth;
		
		if(numOfSelectedFilters > 2) {
			cellWidth = cmp.get('v.innerCellWidth') * numOfSelectedFilters;
		}
		else {
			cellWidth = cmp.get('v.innerCellWidth') * 2;
		}
		cmp.set('v.cellWidth', cellWidth);
		
		//3. get the number of columns and rows to determine the table size
		var budgetYears = cmp.get('v.budgetYears');
		var numOfColumns = budgetYears.reduce(function(result, year) {
			if(!year.isHidden) {
				result++;
			}
			return result;
		}, 0); 
		var numOfRows = cmp.get('v.budgetItems').length;
		
		//4. calculate the table width
		cmp.set('v.tableWidth', (numOfColumns * cellWidth) + cmp.get('v.rowHeadersWidth') + cmp.get('v.summaryColumnWidth') + 4); //4 pixels for borders
		
		//5. set table maximum height - check to see if the bottom scroller is shown
		var budgetTableBody = cmp.find('budget-table-body');
		
		//check if exceeding in width and height (numOfRows * minCellHeight = actual table height without the scroll)
		if(budgetTableBody.getElement()) {
			var isSmallerInWidth = (budgetTableBody.getElement().offsetWidth < cmp.get('v.tableWidth'));
			var isBiggerInHeight = (budgetTableBody.getElement().offsetHeight > (numOfRows * cmp.get('v.minCellHeight')));
			
			if(isSmallerInWidth || isBiggerInHeight) {
				cmp.set('v.tableHeight', cmp.get('v.tableMaxHeight'));
			}
			else {
				cmp.set('v.tableHeight', cmp.get('v.tableMinHeight'));
			}
		}
	},
	
	setSelectedFilters: function(cmp) {
		var filterOptions = cmp.get('v.filterOptions');
		
		var selectedFilters = filterOptions.reduce(function(result, filterItem) {
			if(filterItem.selected) {
				result[filterItem.value] = true;
			}
			return result;
		}, {});
		
		cmp.set('v.selectedFilters', selectedFilters);
	},
	
	addYear: function(cmp, event, helper) {
		var method = event.getParam('method');
		var budgetYears = cmp.get('v.budgetYears');
		var budgetItems = cmp.get('v.budgetItems');
		var tableBody = cmp.find('budget-table-body');
		var tableBodyElement = tableBody.getElement();
		
		var requestedYear, bugdetItemIndex;
			
		//if year needs to append
		if(method == 'push') {
			bugdetItemIndex = budgetYears.length - 1; //head index
			requestedYear = parseInt(budgetYears[bugdetItemIndex - 1].Name) + 1; //get the last year value and add one year
		}
		else { //prepend
			bugdetItemIndex = 0; //tail index
			requestedYear = parseInt(budgetYears[bugdetItemIndex + 1].Name) - 1; //get the first year value and deduct one year
		}
		
		budgetYears[bugdetItemIndex].Name = requestedYear.toString(); //parse the name
		budgetYears[bugdetItemIndex].isHidden = false; //set the column to visible - will start stransition
		budgetYears[method]({'isHidden': true}); //add the empty column by the method
		
		//add a cell (and a mock one) for each budget row item
		for(var i = 0; i < budgetItems.length; i++) {
			helper.createNewBudgetCell(budgetItems[i].data[bugdetItemIndex], budgetItems[i]);
			budgetItems[i].data[bugdetItemIndex].isHidden = false;
			budgetItems[i].data[method]({'isHidden': true});
		}
		
		cmp.set('v.budgetYears', budgetYears);
		cmp.set('v.budgetItems', budgetItems);
		helper.setTableSize(cmp, helper);
		
		/*TODO*/
		var cellWidth = 85 * Object.keys(cmp.get('v.selectedFilters')).length;
		if(method == 'push') {
			helper.scrollTo(tableBodyElement, 0, cellWidth);
		}/*
		else if(method == 'unshift') {
			helper.scrollTo(tableBodyElement, 0);
		}*/
	},
	
	//this function will hide the year
	hideYear: function(cmp, event, helper) {
		var method = event.getParam('method');
		var budgetYears = cmp.get('v.budgetYears');
		var budgetItems = cmp.get('v.budgetItems');
		
		//hide the year
		var deleteInfo = method.split(',');
		method = deleteInfo[0];
		var index = parseInt(deleteInfo[1]);
		budgetYears[index].isHidden = true;
		
		//hide the table cells in the hidden column
		for(var i = 0; i < budgetItems.length; i++) {
			budgetItems[i].data[index].isHidden = true;
		}
		
		cmp.set('v.budgetYears', budgetYears);
		cmp.set('v.budgetItems', budgetItems);
		helper.setTableSize(cmp, helper);
	},
	
	addRow: function(cmp, event, helper) {
		var rowIndex = parseInt(event.getParam('rowIndex'));
		var budgetItems = cmp.get('v.budgetItems');
		var budgetYears = cmp.get('v.budgetYears');
		
		var newBudgetItem = {};
		newBudgetItem.Budget__c = cmp.get('v.budgetId');
		newBudgetItem.Name = $A.get("$Label.c.YH_Budget_EnterName");
		
		newBudgetItem.data = [];
		newBudgetItem.data.push({'isHidden': true});
		
		for(var i = 1; i < budgetYears.length - 1; i++) {
			newBudgetItem.data.push({});
			helper.createNewBudgetCell(newBudgetItem.data[i], budgetItems[0], budgetYears[i]);
		}
		
		newBudgetItem.data.push({'isHidden': true});
		newBudgetItem.isVisible = false;
		newBudgetItem.isNew = true;
		budgetItems.splice(rowIndex + 1, 0, newBudgetItem);
		
		cmp.set('v.budgetItems', budgetItems);
		helper.setTableSize(cmp, helper);
	},
	
	hideRow: function(cmp, event, helper) {
		var rowIndex = parseInt(event.getParam('rowIndex'));
		var budgetItems = cmp.get('v.budgetItems');
		budgetItems[rowIndex].isVisible = false;
		
		cmp.set('v.budgetItems', budgetItems);
		helper.setTableSize(cmp, helper);
	},
	
	createNewBudgetCell: function(dataItem, budgetItem, budgetYear) {
		dataItem.Amount__c = 0;
		dataItem.payment = 0;
		
		if(budgetItem && Object.keys(budgetItem).length) {
			dataItem.Budget_Item__c = budgetItem.data[1].Id;
			dataItem.Budget_Item__r = budgetItem.data[1].Budget_Item__r;
		}
		if(budgetYear && Object.keys(budgetYear).length) {
			dataItem.Budget_Year__c = budgetYear.Id;
			dataItem.Budget_Year__r = budgetYear;
		}
	},
	
	toggleBudgetItems: function(cmp, event, helper) {
		var budgetItems = cmp.get('v.budgetItems');
		var dataObject = event.getParam('dataObject');
		
		var budgetItemIndex = budgetItems.findIndex(function(item) { 
			return !item.isVisible;
		});
		
		//toggle the row by the selection
		if(dataObject.add) { //if removed
			budgetItems[budgetItemIndex].isVisible = true;
			budgetItems[budgetItemIndex].isNew = false;
		}
		//if added new item
		else if(dataObject.remove && budgetItemIndex >= 0) {
			budgetItems.splice(budgetItemIndex, 1);
		}
		
		cmp.set('v.budgetItems', budgetItems);
		helper.setTableSize(cmp, helper);
	},
	
	removeYear: function(cmp, event, helper) {
		var budgetYears = cmp.get('v.budgetYears');
		var budgetItems = cmp.get('v.budgetItems');
		var dataObject = event.getParam('dataObject');
		var index = parseInt(dataObject.index);
		
		budgetYears.splice(index, 1);
		
		for(var i = 0; i < budgetItems.length; i++) {
			budgetItems[i].data.splice(index, 1);
		}
		
		cmp.set('v.budgetYears', budgetYears);
		cmp.set('v.budgetItems', budgetItems);
		helper.setTableSize(cmp, helper);
	},
	
	scrollTo: function(element, topPosition, horizontalPosition) {
		/*var delta = element.scrollLeft;
		horizontalPosition += (delta + 200);
		
		var intervalId = setInterval(function() {
			element.scroll({
				top: topPosition, 
				left: delta
			});
			
			if(horizontalPosition > 0) {
				delta += 2;
				if(delta > horizontalPosition) {
					clearInterval(intervalId);
				}
			}
		}, 2);*/
		
	}
	
})