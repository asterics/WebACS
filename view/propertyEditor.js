/*
 * AsTeRICS - Assistive Technology Rapid Integration and Construction Set (http://www.asterics.org)
 * 
 * 
 * Y88b                     d88P      888               d8888  .d8888b.   .d8888b. 
 *  Y88b                   d88P       888              d88888 d88P  Y88b d88P  Y88b
 *   Y88b                 d88P        888             d88P888 888    888 Y88b.
 *    Y88b     d888b     d88P .d88b.  8888888b.      d88P 888 888         "Y888b.  
 *     Y88b   d88888b   d88P d8P  Y8b 888   Y88b    d88P  888 888            "Y88b.
 *      Y88b d88P Y88b d88P  88888888 888    888   d88P   888 888    888       "888
 *       Y88888P   Y88888P   Y8b.     888   d88P  d8888888888 Y88b  d88P Y88b  d88P
 *        Y888P     Y888P     "Y8888  8888888P"  d88P     888  "Y8888P"   "Y8888P"
 * 
 * Copyright 2015 Kompetenznetzwerk KI-I (http://ki-i.at)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
 ACS.propertyEditor = function(modelList) {

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var propertiesTabPanel = ACS.tabPanel(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL, 'propEdTab', 'propEdPanel');
	var actModel = modelList.getActModel();
	var propertyTable =document.createElement('table');
	var inputPortTable = document.createElement('table');
	var row = [];
	var cell = null;
	var dropdownList = document.createElement('select');
	var numberInput;
	var textInput;
	var selectedElement;
	var flagActiveModelChanged=false;
	var eventChannelTable=document.createElement('table');; 
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
	//methodes handling incoming events
	//=================================
		
		//generate view based on the type eventchannel or coponent and the selected tab 
	var generateViews = function(){
		
		clearPropertyEditor();
		var selectedElementType = null;
		if(actModel.selectedItemsList.length===1 || flagActiveModelChanged){//check if only one component is selected
			//get selected component
			for(var i = 0; i<actModel.componentList.length;i++){
				if(actModel.componentList[i].getIsSelected()){
					selectedElement = i;
					selectedElementType = "component";
				}
			}
			
			for(var i = 0; i<actModel.eventChannelList.length;i++){
				if(actModel.eventChannelList[i].getIsSelected()){
					selectedElement = i;
					selectedElementType = "channel";
				}
			}
		

		
		//Part for component
		if(selectedElementType ==="component"){
			generatePropertiesForComponent();
			generateInputPortsForComponent();
		}
			
		//Part for Events		
		if(selectedElementType ==="channel"){
			generateChannelEventsForChannel();
		}

		}
		
		
		/*if(actModel.selectedItemsList.length>1){
		
		clearPropertyEditor();
		}*/
	}
	
		//generate the parts / fields for the properties for the selected component
	var generatePropertiesForComponent = function(){

			//if a new element is selected the old propertyEditor has to be removed from the panel
			if(propertyTable.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(propertyTable);
			propertyTable=null;
			propertyTable = document.createElement('table');
			
			row = [];
			cell = null;
			}
			propertyTable.innerHTML=actModel.componentList[selectedElement].getId();
			
			//var tempString=actModel.componentList[selectedElement].getId();
			for(var h=0; h<actModel.componentList[selectedElement].propertyList.length;h++){
				var propName=actModel.componentList[selectedElement].propertyList[h].getKey();
				row[h] = propertyTable.insertRow(-1);
				cell = row[h].insertCell(0);
				
				var tempStringa=actModel.componentList[selectedElement].propertyList[h].combobox;
				var valtemp = actModel.componentList[selectedElement].propertyList[h].value;
				var typetemp = actModel.componentList[selectedElement].propertyList[h].getType();
				cell.innerHTML = propName;
				
				//generat dropdown list in case that combox includes values
				if(tempStringa !== ''){
					var entries = tempStringa.split('//');
				
					dropdownList = null;
					dropdownList = document.createElement('select');
					for(l=0;l<entries.length;l++){
						dropdownList.appendChild(new Option(entries[l],l));
						dropdownList.selectedIndex=valtemp;
					}
					dropdownList.setAttribute("id",h+ "/1/"+ valtemp);
					dropdownList.addEventListener("change",writeProperty);
					cell = row[h].insertCell(1);
					cell.appendChild(dropdownList);
				}
				
					//generate checkbox field for boolean
				if(tempStringa === '' && typetemp===1){
					cell = row[h].insertCell(1);
					boolInput = null;
					boolInput = document.createElement("INPUT");
					boolInput.setAttribute("type", "checkbox"); 
					boolInput.setAttribute("value", valtemp);
					if(valtemp==="true"){boolInput.setAttribute("checked", true);}
					boolInput.setAttribute("id",h+ "/1/"+ valtemp);
					boolInput.addEventListener("change",writeProperty);
					cell.appendChild(boolInput);
				}
					//generate intage field
					//console.log(typetemp);
				if(tempStringa === '' && typetemp===4){
					cell = row[h].insertCell(1);
					numberInput = null;
					numberInput = document.createElement("INPUT");
					numberInput.setAttribute("type", "number"); 
					numberInput.setAttribute("value", valtemp); 
					numberInput.setAttribute("id",h+ "/1/"+ valtemp);
					numberInput.addEventListener("change",writeProperty);
					numberInput.addEventListener("input",writeProperty);
					cell.appendChild(numberInput);
				}
			
				//console.log(typetemp);
				if(tempStringa === '' && typetemp===5){
					cell = row[h].insertCell(1);
					numberInput = null;
					numberInput = document.createElement("INPUT");
					numberInput.setAttribute("type", "double"); 
					numberInput.setAttribute("value", valtemp); 
					numberInput.setAttribute("id",h+ "/1/"+ valtemp);
					numberInput.addEventListener("change",writeProperty);
					numberInput.addEventListener("input",writeProperty);
					cell.appendChild(numberInput);
				}
			
				if(tempStringa === '' && typetemp===6){
					cell = row[h].insertCell(1);
					textInput = null;
					textInput = document.createElement("INPUT");
					textInput.setAttribute("type", "text"); 
					textInput.setAttribute("name",propName);
					textInput.setAttribute("value", valtemp); 
					textInput.setAttribute("id",h+ "/1/"+ valtemp); 
					textInput.addEventListener("blur", writeProperty);
					textInput.addEventListener("input",writeProperty);
					cell.appendChild(textInput);
				}
			
			//element.setAttribute("type", "button");
			//element.setAttribute("value", tempString);
			}
			document.getElementById('propEdPanel').appendChild(propertyTable);



		flagActiveModelChanged=false;
	}
	
		//generate the parts / fields for the inputs of the selected property
	var generateInputPortsForComponent = function(){

		for(var h=0; h<actModel.componentList[selectedElement].inputPortList.length;h++){
			var tempStringa=actModel.componentList[selectedElement].inputPortList[h].getId();
			row[h] = inputPortTable.insertRow(-1);
			cell = row[h].insertCell(0);
			cell.innerHTML = tempStringa;
		}
			
		document.getElementById('inputPanel').appendChild(inputPortTable);
	}
	
		//generate the event fileds for the channel based on startcompoment and endcomponent
	var generateChannelEventsForChannel = function(){
		
		
		if(eventChannelTable.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(eventChannelTable);
			eventChannelTable=null;
			eventChannelTable = document.createElement('table');
			
			row = [];
			cell = null;
		}
		
		var chan = actModel.eventChannelList[selectedElement];
		var startcomp = chan.startComponent;
		var endcomp = chan.endComponent;
		
		row[0] = eventChannelTable.insertRow(-1);
		cell = row[0].insertCell(0);
		cell.innerHTML=endcomp.getId();
		cell = row[0].insertCell(1);
		cell.innerHTML=startcomp.getId();
		cell = row[0].insertCell(2);
		cell.innerHTML='Description';
		
		for(var h = 0; h<endcomp.listenEventList.length; h++){
				var eventName=endcomp.listenEventList[h].getId();
				row[h+1] = eventChannelTable.insertRow(-1);
				cell = row[h+1].insertCell(0);
				cell.innerHTML = eventName;
				
				cell = row[h+1].insertCell(1);
				dropdownList = null;
				dropdownList = document.createElement('select');
				for(l=0;l<startcomp.triggerEventList.length;l++){
						dropdownList.appendChild(new Option(startcomp.triggerEventList[l].getId(),l));
				}
				dropdownList.setAttribute("id",h+ "/1/");
				dropdownList.addEventListener("change",writeChannel);
				cell.appendChild(dropdownList);
				cell = row[h+1].insertCell(2);
				textInput = document.createElement("INPUT");
				textInput.setAttribute("type", "text"); 
				cell.appendChild(textInput);
		}
		
		
		document.getElementById('propEdPanel').appendChild(eventChannelTable);
	}	
	
		//remove the content of the property editor 
	var clearPropertyEditor = function(){
		if(inputPortTable.parentNode===document.getElementById('inputPanel')){
			document.getElementById('inputPanel').removeChild(inputPortTable);
			inputPortTable=null;
			inputPortTable= document.createElement('table');
			row = [];
			cell = null;
		}
		if(propertyTable.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(propertyTable);
			propertyTable=null;
			propertyTable = document.createElement('table');
			row = [];
			cell = null;
		}
		if(eventChannelTable.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(eventChannelTable);
			eventChannelTable=null;
			eventChannelTable = document.createElement('table');
			row = [];
			cell = null;
		}
	}

	
	//methods handling outgoing events
	//================================
	
	//write the actual input modifiaction to the property
	var writeProperty = function(evt){
		var completeId = evt.target.id;
		var splitIda = completeId.split("/1/");
		var splitId = splitIda[0];				
		var t = document.getElementById(evt.target.id).value;
		// toggle t in case of a boolean value
		if(t==='false'){
		t='true';
		document.getElementById(evt.target.id).value='true';
		}
		else if(t==='true'){
		t='false';
		document.getElementById(evt.target.id).value='false';}
		actModel.componentList[selectedElement].propertyList[splitId].setValue(t);
	}
	
	var writeChannel = function(evt){
		console.log("====Channel Write");
		console.info(evt);
		var selectedChan = actModel.eventChannelList[selectedElement];
		console.info(selectedChan);
		var listenerComponent=selectedChan.startComponent;
		var triggerComponent=selectedChan.endComponent;
		
		var completeId = evt.target.id;
		var splitIda = completeId.split("/1/");
		var splitId = splitIda[0];				
		var t = document.getElementById(evt.target.id).value;
		
		var listener = ACS.event(t,'',listenerComponent.getId());
		var trigger = ACS.event(t,'',triggerComponent.getId());
		var eventConnectionDescription = '';
						
		var eventConnection = {listener,trigger,eventConnectionDescription};
		selectedChan.eventConnections.push(eventConnection);
		console.info(selectedChan);
		//TODO Generate Event and Put it into EventChannel List
		
	}
	
	//class needed methodes
	
	
// ********************************************** handlers ***********************************************************
	
	var actModelChangedEventHandler = function(){
		//remove eventlistener else it would be added in each new selecting of the model
		//TODO mabe find way to listen on another event vor instance creat new model
				
		actModel.events.removeHandler('componentAddedEvent',componentAddedEventHandler);
		actModel.events.removeHandler('componentRemovedEvent',removeComponentEventHandler);
		actModel.events.removeHandler('eventChannelAddedEvent',eventChannelAddedEvemtHandler);
		actModel.events.removeHandler('eventChannelRemovedEvent',eventChannelRemovedEvemtHandler);
		actModel.events.removeHandler('modelChangedEvent', modelChangedEventHandler);
			actModel = modelList.getActModel();
		actModel.events.registerHandler('componentAddedEvent',componentAddedEventHandler);
		actModel.events.registerHandler('componentRemovedEvent',removeComponentEventHandler);
		actModel.events.registerHandler('eventChannelAddedEvent',eventChannelAddedEvemtHandler);
		actModel.events.registerHandler('eventChannelRemovedEvent',eventChannelRemovedEvemtHandler);
		actModel.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
		
		
		
		//clearPropertyEditor();
		if(actModel.selectedItemsList.length===1){
			flagActiveModelChanged=true;
			generateViews();
		}
		else{clearPropertyEditor();}
	}
	
	var modelChangedEventHandler = function(){
		// derigister all event for the actual model
		for(var countera=0; countera<=actModel.componentList.length-1; countera++){
			actModel.componentList[countera].events.removeHandler('selectedEvent',selectedEventHandler);
			actModel.componentList[countera].events.removeHandler('deSelectedEvent',deSelectedEventHandler);
			}
		for(var counterx=0; counterx<=actModel.eventChannelList.length-1; counterx++){
			actModel.eventChannelList[counterx].events.removeHandler('selectedEvent',selectedEventHandler);
			actModel.eventChannelList[counterx].events.removeHandler('deSelectedEvent',deSelectedEventHandler);
		}
		actModel = modelList.getActModel();
		//in case that model was loaded select and deselect events must be registered
		for(var counterb=0; counterb<=actModel.componentList.length-1; counterb++){
			actModel.componentList[counterb].events.registerHandler('selectedEvent',selectedEventHandler);
			actModel.componentList[counterb].events.registerHandler('deSelectedEvent',deSelectedEventHandler);
		}
		for(var countery=0; countery<=actModel.eventChannelList.length-1; countery++){
			actModel.eventChannelList[countery].events.registerHandler('selectedEvent',selectedEventHandler);
			actModel.eventChannelList[countery].events.registerHandler('deSelectedEvent',deSelectedEventHandler);
		}
	}
	
	var componentAddedEventHandler = function(){
		actModel.componentList[actModel.componentList.length-1].events.registerHandler('selectedEvent',selectedEventHandler);
		actModel.componentList[actModel.componentList.length-1].events.registerHandler('deSelectedEvent',deSelectedEventHandler);
	}
	

	var selectedEventHandler = function(){
		generateViews();
	}
	
	var deSelectedEventHandler = function(){
		clearPropertyEditor();
	}
	
	var removeComponentEventHandler = function(){
		clearPropertyEditor();
	}
	
	var eventChannelAddedEvemtHandler =function(){
		actModel.eventChannelList[actModel.eventChannelList.length-1].events.registerHandler('selectedEvent',selectedEventHandler);
		actModel.eventChannelList[actModel.eventChannelList.length-1].events.registerHandler('deSelectedEvent',deSelectedEventHandler);
	}
	
	var eventChannelRemovedEvemtHandler =function(){
		clearPropertyEditor();
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	var ul = document.createElement('ul');
	ul.setAttribute('id', 'TabList');
	ul.setAttribute('class', 'tablist');
	ul.setAttribute('role', 'tablist');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(ul);
	
	var li1 = document.createElement('li');
	li1.setAttribute('id', 'propEdTab');
	li1.setAttribute('class', 'tab propEdTab');
	li1.setAttribute('aria-controls', 'propEdPanel');
	li1.setAttribute('aria-selected', 'false');
	li1.setAttribute('role', 'tab');
	li1.setAttribute('tabindex', -1);
	li1.textContent = ACS.vConst.PROPERTYEDITOR_PROPERTIESHEADER;
	document.getElementById(ACS.vConst.PROPERTYEDITOR_TABLIST).appendChild(li1);
	var div = document.createElement('div');
	div.setAttribute('id', 'propEdPanel');
	div.setAttribute('class', 'panel propEdPanel');
	div.setAttribute('aria-labelledby', 'propEdTab');
	div.setAttribute('role', 'tabpanel');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(div);
		
	var li2 = document.createElement('li');
	li2.setAttribute('id', 'propertiesInputTab');
	li2.setAttribute('class', 'tab propEdTab');
	li2.setAttribute('aria-controls', 'inputPanel');
	li2.setAttribute('aria-selected', 'false');
	li2.setAttribute('role', 'tab');
	li2.setAttribute('tabindex', -1);
	li2.textContent = ACS.vConst.PROPERTYEDITOR_INPUTHEADER;
	//li2.textContent = 'Input';
	document.getElementById(ACS.vConst.PROPERTYEDITOR_TABLIST).appendChild(li2);
	div = document.createElement('div');
	div.setAttribute('id', 'inputPanel');
	div.setAttribute('class', 'panel propEdPanel');
	div.setAttribute('aria-labelledby', 'inputTab');
	div.setAttribute('role', 'tabpanel');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(div);
	
	var li3 = document.createElement('li');
	li3.setAttribute('id', 'propertiesOutputTab');
	li3.setAttribute('class', 'tab propEdTab');
	li3.setAttribute('aria-controls', 'outputPanel');
	li3.setAttribute('aria-selected', 'false');
	li3.setAttribute('role', 'tab');
	li3.setAttribute('tabindex', -1);
	li3.textContent = ACS.vConst.PROPERTYEDITOR_OUTPUTHEADER;
	//li3.textContent='Outputs';
	document.getElementById(ACS.vConst.PROPERTYEDITOR_TABLIST).appendChild(li3);
	div = document.createElement('div');
	div.setAttribute('id', 'outputPanel');
	div.setAttribute('class', 'panel propEdPanel');
	div.setAttribute('aria-labelledby', 'outputTab');
	div.setAttribute('role', 'tabpanel');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(div);
	
	var li4 = document.createElement('li');
	li4.setAttribute('id', 'propertiesTriggerTab');
	li4.setAttribute('class', 'tab propEdTab');
	li4.setAttribute('aria-controls', 'triggerPanel');
	li4.setAttribute('aria-selected', 'false');
	li4.setAttribute('role', 'tab');
	li4.setAttribute('tabindex', -1);
	li4.textContent = ACS.vConst.PROPERTYEDITOR_TRIGGERHEADER;
	document.getElementById(ACS.vConst.PROPERTYEDITOR_TABLIST).appendChild(li4);
	div = document.createElement('div');
	div.setAttribute('id', 'triggerPanel');
	div.setAttribute('class', 'panel propEdPanel');
	div.setAttribute('aria-labelledby', 'triggerTab');
	div.setAttribute('role', 'tabpanel');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(div);
	
	propertiesTabPanel.updatePanel();
	// activate the propertiesTab (a simple li.click() will not work in safari)
	var click_ev = document.createEvent("MouseEvents");
	click_ev.initEvent("click", true, true);
	li1.dispatchEvent(click_ev);	
	
	document.getElementById('propEdPanel').setAttribute("style","overflow:auto;");
	
	modelList.events.registerHandler('actModelChangedEvent', actModelChangedEventHandler);
	//modelList.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	actModel.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	actModel.events.registerHandler('componentAddedEvent',componentAddedEventHandler);
	actModel.events.registerHandler('componentRemovedEvent',removeComponentEventHandler);
	actModel.events.registerHandler('componentRemovedEvent',removeComponentEventHandler);
	actModel.events.registerHandler('eventChannelAddedEvent',eventChannelAddedEvemtHandler);
	actModel.events.registerHandler('eventChannelRemovedEvent',eventChannelRemovedEvemtHandler);
	
	return returnObj;
}