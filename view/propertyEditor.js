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
 
ACS.propertyEditor = function(modelList, // ACS.modelList
							  modelViewListtemp, // Array<modelView>
							  editorPropsTemp) { // editorProperties

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var propertiesTabPanel = ACS.tabPanel(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL, ACS.vConst.PROPERTYEDITOR_CLASSOFTAB, ACS.vConst.PROPERTYEDITOR_CLASSOFPANEL);
	var actModel = modelList.getActModel();
	var propertyTable =document.createElement('table');
	var inputPortTable = document.createElement('table');
	var outputPortTable = document.createElement('table');
	var propertiesGuiEditorTable = document.createElement('table');
	var propertiesGuiEditorTableEditorProperties = document.createElement('table');
	var eventTriggerTable = document.createElement('table');
	var eventListenerTable =document.createElement('table');
	var modelViewList = modelViewListtemp;
	var modelViewAct = modelViewList[0];
	var modelViewActTabPanel = modelViewList[0].getModelTabPanel();
	var editorProps = editorPropsTemp;
	var row = [];
	var cell = null;
	var dropdownList = document.createElement('select');
	var numberInput;
	var textInput;
	var selectedElement;
	var flagActiveModelChanged=false;
	var eventChannelTable=document.createElement('table');; 
	var previousDropDownEntry = null; //stores the selected dropdownvalue before entry is changed
	var eventTableId=0;
	var guiEditorOn = false;

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
	//methodes handling incoming events
	//=================================
		
		//generate view based on the type eventchannel or coponent and the selected tab 
	var generateViews = function(){
		clearPropertyEditor();
		var selectedElementType = null;
		var containerId =modelViewAct.getModelContainerId();
		var panelId = 'modelPanel'+containerId;
		if(document.getElementById(panelId).getAttribute("aria-hidden")==='false'){
		//render Properties/Inputs... for propPanel
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
				generateOuputPortsForComponent();
				generateEventTriggersForComponent();
				generateEventListenerForComponent();
			}			
			//Part for Events		
			if(selectedElementType ==="channel"){
				generateChannelEventsForChannel();
			}
			}	
		}
		if(document.getElementById(panelId).getAttribute("aria-hidden")==='true'){
		//Render Properties for Gui Editor
			generaterPropertiesForGUIEditor();
		}
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
				if(tempStringa === '' && typetemp===4){
					cell = row[h].insertCell(1);
					numberInput = null;
					numberInput = document.createElement("INPUT");
					numberInput.setAttribute("type", "number"); 
					numberInput.setAttribute("value", valtemp); 
					numberInput.setAttribute("id",h+ "/1/"+ valtemp);
					numberInput.addEventListener("change",writeProperty);
					//numberInput.addEventListener("input",writeProperty);
					cell.appendChild(numberInput);
				}
			
				if(tempStringa === '' && typetemp===5){
					cell = row[h].insertCell(1);
					numberInput = null;
					numberInput = document.createElement("INPUT");
					numberInput.setAttribute("type", "double"); 
					numberInput.setAttribute("value", valtemp); 
					numberInput.setAttribute("id",h+ "/1/"+ valtemp);
					numberInput.addEventListener("change",writeProperty);
					//numberInput.addEventListener("input",writeProperty);
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
					//CHANGEDtextInput.addEventListener("input",writeProperty);
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
			inputPortTable.innerHTML=actModel.componentList[selectedElement].getId()+':';
			row[0] = inputPortTable.insertRow(-1);
			cell = row[0].insertCell(0);
			cell.innerHTML='<b>PortLabel </b>';
			cell = row[0].insertCell(1);
			cell.innerHTML='<b>PortDataType </b>';
			cell = row[0].insertCell(2);
			cell.innerHTML='<b>Synchronize </b>';
			cell = row[0].insertCell(3);
			cell.innerHTML='<b>MustBeConnected </b>';
			cell = row[0].insertCell(4);
			cell.innerHTML='<b>Description </b>';
		for(var h=0; h<actModel.componentList[selectedElement].inputPortList.length;h++){
			var tempStringa=actModel.componentList[selectedElement].inputPortList[h].getId();
			row[h+1] = inputPortTable.insertRow(-1);
			cell = row[h+1].insertCell(0);
			cell.innerHTML = tempStringa;
			tempStringa=actModel.componentList[selectedElement].inputPortList[h].getDataType();
			cell = row[h+1].insertCell(1);
			cell.innerHTML = stringOfEnum(ACS.dataType,tempStringa);
			tempStringa=actModel.componentList[selectedElement].inputPortList[h].sync;
			cell = row[h+1].insertCell(2);
			boolInput = null;
			boolInput = document.createElement("INPUT");
			boolInput.setAttribute("type", "checkbox"); 
			boolInput.setAttribute("value", tempStringa);
			if(tempStringa==="true"){boolInput.setAttribute("checked", true);}
			boolInput.setAttribute("id",h+ "/3/"+ "sync");
			boolInput.addEventListener("change",writeInputPorts);
			cell.appendChild(boolInput);
			tempStringa=actModel.componentList[selectedElement].inputPortList[h].getMustBeConnected();
			cell = row[h+1].insertCell(3);
			boolInput = null;
			boolInput = document.createElement("INPUT");
			boolInput.setAttribute("type", "checkbox"); 
			boolInput.setAttribute("value", tempStringa);
			if(tempStringa==="true"){boolInput.setAttribute("checked", true);}
			boolInput.setAttribute('disabled', 'disabled');
			cell.appendChild(boolInput);
			tempStringa=''; //TODO get description
			cell = row[h+1].insertCell(4);
			cell.innerHTML = tempStringa;
		}
			
		document.getElementById('inputPanel').appendChild(inputPortTable);
	}
	
		//generate the parts / fields for the outputs of the selected component
	var generateOuputPortsForComponent = function(){
			outputPortTable.innerHTML=actModel.componentList[selectedElement].getId()+':';
			row[0] = outputPortTable.insertRow(-1);
			cell = row[0].insertCell(0);
			cell.innerHTML='<b>Port Label </b>';
			cell = row[0].insertCell(1);
			cell.innerHTML='<b>PortDataType </b>';
			cell = row[0].insertCell(2);
			cell.innerHTML='<b>Description </b>';
			for(var h=0; h<actModel.componentList[selectedElement].outputPortList.length;h++){
				tempStringa=actModel.componentList[selectedElement].outputPortList[h].getId();
				row[h+1] = outputPortTable.insertRow(-1);
				cell = row[h+1].insertCell(0);
				cell.innerHTML = tempStringa;
				tempStringa=actModel.componentList[selectedElement].outputPortList[h].getDataType();
				cell = row[h+1].insertCell(1);
				cell.innerHTML = stringOfEnum(ACS.dataType,tempStringa);
				tempStringa=''; //TODO get description
				cell = row[h+1].insertCell(2);
				cell.innerHTML = tempStringa;
			}	
		document.getElementById('outputPanel').appendChild(outputPortTable);
	}
	
	var generateEventTriggersForComponent = function(){
		eventTriggerTable.innerHTML=actModel.componentList[selectedElement].getId()+':';
		row[0] =eventTriggerTable.insertRow(-1);
		cell =row[0].insertCell(0);
		cell.innerHTML = "<b>Trigger</b>";
		cell =row[0].insertCell(1);
		cell.innerHTML = "<b>Description</b>";
		for(var h=0; h<actModel.componentList[selectedElement].triggerEventList.length;h++){
			var tempStringa=actModel.componentList[selectedElement].triggerEventList[h].getId();
			var tempDes = actModel.componentList[selectedElement].triggerEventList[h].getDescription();
			row[h] = eventTriggerTable.insertRow(-1);
			cell = row[h].insertCell(0);
			cell.innerHTML = tempStringa;
			cell = row[h].insertCell(1);
			cell.innerHTML = tempDes;
		}			
		document.getElementById('triggerPanel').appendChild(eventTriggerTable);
	}
	
	var generateEventListenerForComponent = function(){
		eventListenerTable.innerHTML=actModel.componentList[selectedElement].getId()+':';
		row[0] =eventListenerTable.insertRow(-1);
		cell =row[0].insertCell(0);
		cell.innerHTML = "<b>Listener</b>";
		cell =row[0].insertCell(1);
		cell.innerHTML = "<b>Description</b>";
		for(var h=0; h<actModel.componentList[selectedElement].listenEventList.length;h++){
			var tempStringa=actModel.componentList[selectedElement].listenEventList[h].getId();
			var tempDes = actModel.componentList[selectedElement].listenEventList[h].getDescription();
			row[h] = eventListenerTable.insertRow(-1);
			cell = row[h].insertCell(0);
			cell.innerHTML = tempStringa;
			cell = row[h].insertCell(1);
			cell.innerHTML = tempDes
		}			
		document.getElementById('listenerPanel').appendChild(eventListenerTable);
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
			for(var l=0;l<startcomp.triggerEventList.length+1;l++){
				if(l===0){
					dropdownList.appendChild(new Option('---',l));
				}
				else{
					dropdownList.appendChild(new Option(startcomp.triggerEventList[l-1].getId(),l));
				}
			}
			dropdownList.selectedIndex='0';
			dropdownList.setAttribute("id",eventTableId+ "/1/"+eventName);
			dropdownList.addEventListener("change",writeChannel);
			dropdownList.addEventListener("focus",setPreviousSelected);
			cell.appendChild(dropdownList);
			cell = row[h+1].insertCell(2);
			textInput = document.createElement("INPUT");
			textInput.setAttribute("type", "text"); 
			textInput.setAttribute("id",eventTableId+ "/2/"+eventName);
			eventTableId=eventTableId+1;
			//textInput.addEventListener("input",writeChannelDescription);
			textInput.addEventListener("blur",writeChannelDescription);
			cell.appendChild(textInput);
		}
		
		var insertPosition = 1;
		for(var h = 0; h<endcomp.listenEventList.length; h++){
			var eventName=endcomp.listenEventList[h].getId();
			
			for(var countx = 0; countx<chan.eventConnections.length; countx++){
				var storedEventName=chan.eventConnections[countx].listener.getId();
				var storedTriggerEventName=chan.eventConnections[countx].trigger.getId();
				var eventDescription = chan.eventConnections[countx].description;
				if(eventName===storedEventName){
					var rowToInsert = eventChannelTable.insertRow(insertPosition);
					cell = rowToInsert.insertCell(0);
					cell.innerHTML = eventName;
					
					cell = rowToInsert.insertCell(1);
					dropdownList = null;
					dropdownList = document.createElement('select');
					var selectedEventIndex=0; 
					for(var l=0;l<startcomp.triggerEventList.length+1;l++){
						if(l===0){
							dropdownList.appendChild(new Option('---',l));
						}else{
							dropdownList.appendChild(new Option(startcomp.triggerEventList[l-1].getId(),l));
							if(startcomp.triggerEventList[l-1].getId()===storedTriggerEventName){
								selectedEventIndex=l;
							}
						}		
					}
					dropdownList.selectedIndex=selectedEventIndex;
					dropdownList.setAttribute("id",eventTableId+ "/1/"+eventName);
					dropdownList.addEventListener("change",writeChannel);
					dropdownList.addEventListener("focus",setPreviousSelected);
					cell.appendChild(dropdownList);
					cell = rowToInsert.insertCell(2);
					textInput = document.createElement("INPUT");
					textInput.setAttribute("type", "text"); 
					textInput.value=eventDescription;
					if(eventDescription==="undefined"){
						textInput.value="";
					}
					textInput.setAttribute("id",eventTableId+ "/2/"+eventName);
					//textInput.addEventListener("input",writeChannelDescription);
					textInput.addEventListener("blur",writeChannelDescription);
					eventTableId=eventTableId+1;
					cell.appendChild(textInput);
					
					insertPosition++;
				}
			}
			insertPosition++;
		}
		
		
		document.getElementById('propEdPanel').appendChild(eventChannelTable);
	}	
	
		//generate the property fields for the gui editor
	var generaterPropertiesForGUIEditor = function(){
		propertiesGuiEditorTableEditorProperties=null;
		propertiesGuiEditorTableEditorProperties = document.createElement('table');
		propertiesGuiEditorTableEditorProperties.innerHTML = 'Editor Properties';
		document.getElementById('propEdPanel').appendChild(propertiesGuiEditorTableEditorProperties);
		for(var h=0; h<4;h++){
			row[h] = propertiesGuiEditorTableEditorProperties.insertRow(-1);
			cell = row[h].insertCell(0);
			if(h===0){cell.innerHTML = 'EnableGrid';tempStringa=editorProps.getEnableGrid();}
			if(h===1){cell.innerHTML = 'ShowGrid';tempStringa=editorProps.getShowGrid();}
			if(h===2){cell.innerHTML = 'GridSteps';tempStringa=editorProps.getGridSteps();}
			if(h===3){cell.innerHTML = 'ScreenRes';tempStringa=editorProps.getScreenRes();}
			cell = row[h].insertCell(1);
			if(h===0){
				boolInput = null;
				boolInput = document.createElement("INPUT");
				boolInput.setAttribute("type", "checkbox"); 
				if(tempStringa){boolInput.setAttribute("checked", true);}
				boolInput.setAttribute("value", tempStringa);
				boolInput.setAttribute("id",h+"/4/"+ "enablegrid");
				boolInput.addEventListener("change",writeGuiEditorProperties);
				cell.appendChild(boolInput);
			}
			if(h===1){
				boolInput = null;
				boolInput = document.createElement("INPUT");
				boolInput.setAttribute("type", "checkbox"); 
				if(tempStringa){boolInput.setAttribute("checked", true);}
				boolInput.setAttribute("value", tempStringa);
				boolInput.setAttribute("id",h+"/4/"+ "showgrid");
				boolInput.addEventListener("change",writeGuiEditorProperties);
				cell.appendChild(boolInput);
			}
			if(h===2){
				dropdownList = null;
				dropdownList = document.createElement('select');
				for(l=0;l<4;l++){
					if(l===0){dropdownList.appendChild(new Option('small',l));}
					if(l===1){dropdownList.appendChild(new Option('medium',l));}
					if(l===2){dropdownList.appendChild(new Option('large',l));}
					if(l===3){dropdownList.appendChild(new Option('huge',l));}
				}
				dropdownList.selectedIndex=tempStringa - 1;
				dropdownList.setAttribute("id",h+ "/4/"+"gridsteps");
				dropdownList.addEventListener("change",writeGuiEditorProperties);
				cell.appendChild(dropdownList);
			}
			if(h===3){
				dropdownList = null;
				dropdownList = document.createElement('select');
				for(l=0;l<3;l++){
					if(l===0){dropdownList.appendChild(new Option('FiveFour',l));}
					if(l===1){dropdownList.appendChild(new Option('SixteenNine',l));}
					if(l===2){dropdownList.appendChild(new Option('FourThree',l));}
				}
				dropdownList.selectedIndex=tempStringa - 1;
				dropdownList.setAttribute("id",h+ "/4/"+"gridsteps");
				dropdownList.addEventListener("change",writeGuiEditorProperties);
				cell.appendChild(dropdownList);
			}
		}
		
		propertiesGuiEditorTable=null;
		propertiesGuiEditorTable = document.createElement('table');
		propertiesGuiEditorTable.innerHTML = 'ARE Properties';
		for(var h = 0; h<5; h++){
			row[h] = propertiesGuiEditorTable.insertRow(-1);
			cell = row[h].insertCell(0);
			if(h===0){cell.innerHTML = 'Decoration';tempStringa=actModel.modelGui.getDecoration();	}
			if(h===1){cell.innerHTML = 'FullScreen';	tempStringa=actModel.modelGui.getFullScreen();}
			if(h===2){cell.innerHTML = 'AlwaysOnTop';tempStringa=actModel.modelGui.getAlwaysOnTop();	}
			if(h===3){cell.innerHTML = 'ToSystemTray';	tempStringa=actModel.modelGui.getToSystemTray();}
			if(h===4){cell.innerHTML = 'ShowControlPanel';	tempStringa=actModel.modelGui.getShowControlPanel();}
			cell = row[h].insertCell(1);
			boolInput = null;
			boolInput = document.createElement("INPUT");
			boolInput.setAttribute("type", "checkbox"); 
			boolInput.setAttribute("value", tempStringa);
			if(tempStringa){boolInput.setAttribute("checked", true);}
			if(h===0){boolInput.setAttribute("id",h+"/5/"+ "decoration");}
			if(h===1){boolInput.setAttribute("id",h+"/5/"+ "fullscreen");}
			if(h===2){boolInput.setAttribute("id",h+"/5/"+ "alwaysontop");}
			if(h===3){boolInput.setAttribute("id",h+"/5/"+ "tosystemtray");}
			if(h===4){boolInput.setAttribute("id",h+"/5/"+ "showcontrolpanel");}
			
			boolInput.addEventListener("change",writeGuiEditorProperties);
			cell.appendChild(boolInput);
		}
		document.getElementById('propEdPanel').appendChild(propertiesGuiEditorTable);
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
		if(outputPortTable.parentNode===document.getElementById('outputPanel')){
			document.getElementById('outputPanel').removeChild(outputPortTable);
			outputPortTable=null;
			outputPortTable= document.createElement('table');
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
		if(eventTriggerTable.parentNode===document.getElementById('triggerPanel')){
			document.getElementById('triggerPanel').removeChild(eventTriggerTable);
			eventTriggerTable=null;
			eventTriggerTable = document.createElement('table');
			row = [];
			cell = null;
		}
		if(eventListenerTable.parentNode===document.getElementById('listenerPanel')){
			document.getElementById('listenerPanel').removeChild(eventListenerTable);
			eventListenerTable=null;
			eventListenerTable = document.createElement('table');
			row = [];
			cell = null;
		}
		if(eventChannelTable.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(eventChannelTable);
			eventChannelTable=null;
			eventChannelTable = document.createElement('table');
			row = [];
			cell = null;
			eventTableId=0;
		}
		if(propertiesGuiEditorTable.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(propertiesGuiEditorTable);
			propertiesGuiEditorTable=null;
			propertiesGuiEditorTable = document.createElement('table');
			row = [];
			cell = null;
		}
		if(propertiesGuiEditorTableEditorProperties.parentNode===document.getElementById('propEdPanel')){
			document.getElementById('propEdPanel').removeChild(propertiesGuiEditorTableEditorProperties);
			propertiesGuiEditorTableEditorProperties=null;
			propertiesGuiEditorTableEditorProperties = document.createElement('table');
			row = [];
			cell = null;
		}
	}

	
	//methods handling outgoing events
	//================================
	
		//write the actual input modifiaction to the property
	var writeProperty = function(evt){
		var t_temp = document.getElementById(evt.target.id);
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
		
		//write the selected element of the Dropdown list to an eventchannel
	var writeChannel = function(evt){
		var selectedChan = actModel.eventChannelList[selectedElement];
		var listenerComponent=selectedChan.startComponent;
		var triggerComponent=selectedChan.endComponent;
		
		var completeId = evt.target.id;
		var splitIda = completeId.split("/1/");
		var splitId = splitIda[0];	
		var splitIdTriggerName = splitIda[1];
		var	rowI = document.getElementById(completeId).parentNode.parentNode.rowIndex;	
		var insertPosition = getPositionForChannelEven(rowI);
		var tableLenght = eventChannelTable.rows.length;
		
		var t_dropdown = document.getElementById(evt.target.id);
		var t = t_dropdown.options[t_dropdown.selectedIndex].text;
		var r_value = eventChannelTable.rows[rowI].cells[0].innerHTML;
		var eventConnectionDescription =eventChannelTable.rows[rowI].cells[2].firstChild.value;
		
		if(t!=='---'&& previousDropDownEntry==='---'){
			//generate and insert eventconnection into selectedChannel
			var listener = ACS.event(r_value,'',listenerComponent.getId());
			var trigger = ACS.event(t,'',triggerComponent.getId());
			var description = eventConnectionDescription;
			var eventConnection = {listener,trigger,description};
			selectedChan.eventConnections.splice(insertPosition,0,eventConnection);
		
			//generate View for further connections to the same listener
			//var eventName=triggerComponent;
			var rowToInsert = eventChannelTable.insertRow(rowI+1);
			cell = rowToInsert.insertCell(0);
			cell.innerHTML = splitIdTriggerName;
				
			cell = rowToInsert.insertCell(1);
			dropdownList = null;
			dropdownList = document.createElement('select');
			for(l=0;l<listenerComponent.triggerEventList.length+1;l++){
				if(l===0){
					dropdownList.appendChild(new Option('---',l));
				}
				else{
					dropdownList.appendChild(new Option(listenerComponent.triggerEventList[l-1].getId(),l));
				}
			}
			dropdownList.selectedIndex='0';
			dropdownList.setAttribute("id",eventTableId+ "/1/"+splitIdTriggerName);//TODO lenght of list;
			dropdownList.addEventListener("change",writeChannel);
			dropdownList.addEventListener("focus",setPreviousSelected);
			cell.appendChild(dropdownList);
			/*cell = rowToInsert.insertCell(2);
			textInput = document.createElement("INPUT");
			textInput.setAttribute("type", "text"); 
			cell.appendChild(textInput);*/
			cell = rowToInsert.insertCell(2);
			textInput = document.createElement("INPUT");
			textInput.setAttribute("type", "text"); 
			textInput.setAttribute("id",eventTableId+ "/2/"+splitIdTriggerName);
			eventTableId=eventTableId+1;
			//textInput.addEventListener("input",writeChannelDescription);
			textInput.addEventListener("blur",writeChannelDescription);
			cell.appendChild(textInput);
		}else if(t!=='---'&& previousDropDownEntry!=='---'){
			selectedChan.eventConnections.splice(insertPosition,1);
			var listener = ACS.event(r_value,'',listenerComponent.getId());
			var trigger = ACS.event(t,'',triggerComponent.getId());
			var description = eventConnectionDescription;
			var eventConnection = {listener,trigger,description};
			selectedChan.eventConnections.splice(insertPosition,0,eventConnection);
		}else{
			eventChannelTable.deleteRow(rowI);
			selectedChan.eventConnections.splice(insertPosition,1);
		}
		previousDropDownEntry=splitIdTriggerName;	
	}
	
	var writeChannelDescription = function(evt){
		var selectedChan = actModel.eventChannelList[selectedElement];
		var listenerComponent=selectedChan.startComponent;
		var triggerComponent=selectedChan.endComponent;
		var completeId = evt.target.id;
		if(completeId){
			var splitIda = completeId.split("/2/");
			var splitId = splitIda[0];	
			var	rowI = document.getElementById(completeId).parentNode.parentNode.rowIndex;
			var insertPosition = getPositionForChannelEven(rowI);
			var tableLenght = eventChannelTable.rows.length;
			var t_dropdown = eventChannelTable.rows[rowI].cells[1].firstChild;
			var t = t_dropdown.options[t_dropdown.selectedIndex].text;
			var r_value = eventChannelTable.rows[rowI].cells[0].innerHTML;
			var eventConnectionDescription =eventChannelTable.rows[rowI].cells[2].firstChild.value;	
			
			if(t!=="---"){
				selectedChan.eventConnections.splice(insertPosition,1);
				var listener = ACS.event(r_value,'',listenerComponent.getId());
				var trigger = ACS.event(t,'',triggerComponent.getId());
				var description = eventConnectionDescription;
				var eventConnection = {listener,trigger,description};
				selectedChan.eventConnections.splice(insertPosition,0,eventConnection);
			}
		}
	}
	
	var writeInputPorts = function(evt){
		var t_temp = document.getElementById(evt.target.id);
		var completeId = evt.target.id;
		var splitIda = completeId.split("/3/");
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
		actModel.componentList[selectedElement].inputPortList[splitId ].sync=t;
	}
	
	var writeGuiEditorProperties = function(evt){		
		var idString=evt.target.id;
		if(idString.indexOf('/4/') > -1){
			var idStringSplita = idString.split('/4/');
			var idStringSplit = idStringSplita[0];
			if(idStringSplit==='0'){
				var tempbool= editorProps.getEnableGrid();
				editorProps.setEnableGrid(!tempbool);
			}
			if(idStringSplit==='1'){
				var tempbool= editorProps.getShowGrid();
				editorProps.setShowGrid(!tempbool);
			}
			if(idStringSplit==='2'){
				var t = document.getElementById(evt.target.id).selectedIndex + 1;
				editorProps.setGridSteps(t);
			}
			if(idStringSplit==='3'){
				var t = document.getElementById(evt.target.id).selectedIndex + 1;
				editorProps.setScreenRes(t);
			}
		}
		if(idString.indexOf('/5/') > -1){
			var idStringSplita = idString.split('/5/');
			var idStringSplit = idStringSplita[0];
			if(idStringSplit==='0'){
				var tempbool= actModel.modelGui.getDecoration();
				actModel.modelGui.setDecoration(!tempbool);
			}
			if(idStringSplit==='1'){
				var tempbool= actModel.modelGui.getFullScreen();
				actModel.modelGui.setFullScreen(!tempbool);
			}
			if(idStringSplit==='2'){
				var tempbool= actModel.modelGui.getAlwaysOnTop();
				actModel.modelGui.setAlwaysOnTop(!tempbool);
			}
			if(idStringSplit==='3'){
				var tempbool= actModel.modelGui.getToSystemTray();
				actModel.modelGui.setToSystemTray(!tempbool);
			}
			if(idStringSplit==='4'){
				var tempbool= actModel.modelGui.getShowControlPanel();
				actModel.modelGui.setShowControlPanel(!tempbool);
			}
		}
	}
	//class needed methodes helper functions
	//======================================
	
	//returns the insert position of an event into an event channel based on the row position
	var getPositionForChannelEven = function(rowInd){
		var countera = 0;
		for(var i = 1; i<rowInd; i++){
			var x = eventChannelTable.rows[i];
			var y = x.cells[1].childNodes[0].id;
			var t_dropdown = document.getElementById(y);
			var t = t_dropdown.options[t_dropdown.selectedIndex].text;
			if(t!=='---'){
				countera++;
			}
		}
		return countera;
	}
	
	var setPreviousSelected = function(evt){
		var t_dropdown = document.getElementById(evt.target.id);
		previousDropDownEntry = t_dropdown.options[t_dropdown.selectedIndex].text;		
	}
	
	var stringOfEnum = function(enum1,value1){
		for (var k in enum1) if (enum1[k] == value1) return k;
		return null;
	}
	
// ********************************************** handlers ***********************************************************
	
	var actModelChangedEventHandler = function(){
		//remove eventlistener else it would be added in each new selecting of the model
		//TODO mabe find way to listen on another event vor instance creat new model
				
		actModel.events.removeHandler('componentAddedEvent',componentAddedEventHandler);
		actModel.events.removeHandler('componentRemovedEvent',removeComponentEventHandler);
		actModel.events.removeHandler('eventChannelAddedEvent',eventChannelAddedEventHandler);
		actModel.events.removeHandler('eventChannelRemovedEvent',eventChannelRemovedEventHandler);
		actModel.events.removeHandler('modelChangedEvent', modelChangedEventHandler);
		actModel = modelList.getActModel();
		actModel.events.registerHandler('componentAddedEvent',componentAddedEventHandler);
		actModel.events.registerHandler('componentRemovedEvent',removeComponentEventHandler);
		actModel.events.registerHandler('eventChannelAddedEvent',eventChannelAddedEventHandler);
		actModel.events.registerHandler('eventChannelRemovedEvent',eventChannelRemovedEventHandler);
		actModel.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
		
		modelViewActTabPanel.events.removeHandler('tabSwitchedEvent',tabSwitchedEventHandler);
		for (var i = 0; i < modelViewList.length; i++) {
			if (modelViewList[i] && (modelViewList[i].getModel() === actModel)) {
			modelViewAct = modelViewList[i];
			modelViewActTabPanel=modelViewList[i].getModelTabPanel();
			modelViewActTabPanel.events.registerHandler('tabSwitchedEvent',tabSwitchedEventHandler);
			}
		}
		//clearPropertyEditor();
		var containerId =modelViewAct.getModelContainerId();
		var panelId = 'modelPanel'+containerId;
		if(actModel.selectedItemsList.length===1 || document.getElementById(panelId).getAttribute("aria-hidden")==='true'){
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
	
	var eventChannelAddedEventHandler = function(){
		actModel.eventChannelList[actModel.eventChannelList.length-1].events.registerHandler('selectedEvent',selectedEventHandler);
		actModel.eventChannelList[actModel.eventChannelList.length-1].events.registerHandler('deSelectedEvent',deSelectedEventHandler);
	}
	
	var eventChannelRemovedEventHandler = function(){
		clearPropertyEditor();
	}
	
	var tabSwitchedEventHandler = function(){
		generateViews();
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
	
	var li5 = document.createElement('li');
	li5.setAttribute('id', 'propertiesTriggerTab');
	li5.setAttribute('class', 'tab propEdTab');
	li5.setAttribute('aria-controls', 'listenerPanel');
	li5.setAttribute('aria-selected', 'false');
	li5.setAttribute('role', 'tab');
	li5.setAttribute('tabindex', -1);
	li5.textContent = ACS.vConst.PROPERTYEDITOR_LISTENERHEADER;
	document.getElementById(ACS.vConst.PROPERTYEDITOR_TABLIST).appendChild(li5);
	div = document.createElement('div');
	div.setAttribute('id', 'listenerPanel');
	div.setAttribute('class', 'panel propEdPanel');
	div.setAttribute('aria-labelledby', 'listenerTab');
	div.setAttribute('role', 'tabpanel');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(div);
	
	propertiesTabPanel.updatePanel();
	// activate the propertiesTab (a simple li.click() will not work in safari)
	var click_ev = document.createEvent("MouseEvents");
	click_ev.initEvent("click", true, true);
	li1.dispatchEvent(click_ev);	
	
	document.getElementById('propEdPanel').setAttribute("style","overflow:auto;");
	document.getElementById('inputPanel').setAttribute("style","overflow:auto;");
	document.getElementById('outputPanel').setAttribute("style","overflow:auto;");
	document.getElementById('triggerPanel').setAttribute("style","overflow:auto;");
	document.getElementById('listenerPanel').setAttribute("style","overflow:auto;");
	
	
	modelList.events.registerHandler('actModelChangedEvent', actModelChangedEventHandler);
	//modelList.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	actModel.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	actModel.events.registerHandler('componentAddedEvent',componentAddedEventHandler);
	actModel.events.registerHandler('componentRemovedEvent',removeComponentEventHandler);
	//actModel.events.registerHandler('componentRemovedEvent',removeComponentEventHandler);
	actModel.events.registerHandler('eventChannelAddedEvent',eventChannelAddedEventHandler);
	actModel.events.registerHandler('eventChannelRemovedEvent',eventChannelRemovedEventHandler);
	modelViewActTabPanel.events.registerHandler('tabSwitchedEvent',tabSwitchedEventHandler);
	
	return returnObj;
}