ACS.modelView = function(	modelContainerId, // String
							model) { // ACS.model
							
	// private variables
	var modelTabPanel = ACS.tabPanel(modelContainerId, 'modelTab', 'modelPanel');
	var componentViewList = []; // Array<ACS.componentView>
	var dataChannelViewList = []; // Array<ACS.dataChannelView>
	var eventChannelViewList = []; // Array<ACS.eventChannelView>
	var visualAreaMarkerViewList = []; // Array<ACS.visualMarkerView>
	var modelStage; // Kinetic.Stage
	var modelLayer; // Kinetic.Layer
	var guiStage; // Kinetic.Stage
	var guiLayer; // Kinetic.Layer
	
	// private methods
	var drawCompleteModel = function() {
		var i;
		// destroy and delete the old views:
		for (i = 0; i < componentViewList.length; i++) componentViewList[i].destroy();
		componentViewList = [];
		for (i = 0; i < dataChannelViewList.length; i++) dataChannelViewList[i].destroy();
		dataChannelViewList = [];
		for (i = 0; i < eventChannelViewList.length; i++) eventChannelViewList[i].destroy();
		eventChannelViewList = [];
		for (i = 0; i < visualAreaMarkerViewList.length; i++) visualAreaMarkerViewList[i].destroy();
		visualAreaMarkerViewList = [];
		// instantiate new views:
		for (i = 0; i < model.componentList.length; i++) {
			componentViewList[i] = ACS.componentView(model.componentList[i], modelLayer, guiLayer);
		}
		for (i = 0; i < model.dataChannelList.length; i++) {
			dataChannelViewList[i] = ACS.dataChannelView(model.dataChannelList[i], modelLayer);
		}
		for (i = 0; i < model.eventChannelList.length; i++) {
			eventChannelViewList[i] = ACS.eventChannelView(model.eventChannelList[i], modelLayer);
		}
		for (i = 0; i < model.visualAreaMarkerList.length; i++) {
			visualAreaMarkerViewList[i] = ACS.visualAreaMarkerView(model.visualAreaMarkerList[i], modelLayer);
		}
		// actually do the drawing:
		modelLayer.draw();
	}
	
	// public stuff
	var returnObj = {};
	
	returnObj.getModel = function() {
		return model;
	}
	
	// constructor code
	// initiate the tabPanel:
	var ul = document.createElement('ul');
	ul.setAttribute('id', modelContainerId + 'TabList');
	ul.setAttribute('class', 'tablist');
	ul.setAttribute('role', 'tablist');
	document.getElementById(modelContainerId).appendChild(ul);
	var li1 = document.createElement('li');
	li1.setAttribute('id', 'modelTab' + modelContainerId);
	li1.setAttribute('class', 'tab modelTab');
	li1.setAttribute('aria-controls', 'modelPanel' + modelContainerId);
	li1.setAttribute('aria-selected', 'false');
	li1.setAttribute('role', 'tab');
	li1.setAttribute('tabindex', -1);
	li1.textContent = ACS.vConst.MODELVIEW_MODELDESIGNERHEADER;
	document.getElementById(modelContainerId + 'TabList').appendChild(li1);
	var div = document.createElement('div');
	div.setAttribute('id', 'modelPanel' + modelContainerId);
	div.setAttribute('class', 'panel modelPanel');
	div.setAttribute('aria-labelledby', 'modelTab' + modelContainerId);
	div.setAttribute('role', 'tabpanel');
	document.getElementById(modelContainerId).appendChild(div);
	var li2 = document.createElement('li');
	li2.setAttribute('id', 'guiTab' + modelContainerId);
	li2.setAttribute('class', 'tab modelTab');
	li2.setAttribute('aria-controls', 'guiPanel' + modelContainerId);
	li2.setAttribute('aria-selected', 'false');
	li2.setAttribute('role', 'tab');
	li2.setAttribute('tabindex', -1);
	li2.textContent = ACS.vConst.MODELVIEW_GUIDESIGNERHEADER;
	document.getElementById(modelContainerId + 'TabList').appendChild(li2);
	div = document.createElement('div');
	div.setAttribute('id', 'guiPanel' + modelContainerId);
	div.setAttribute('class', 'panel modelPanel');
	div.setAttribute('aria-labelledby', 'guiTab' + modelContainerId);
	div.setAttribute('role', 'tabpanel');
	document.getElementById(modelContainerId).appendChild(div);
	modelTabPanel.updatePanel();
	li1.click(); // activate the modelTab			
	// initiate Stages and Layers and add Layers:
	modelStage = new Kinetic.Stage({
		container: 'modelPanel' + modelContainerId,
		width: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	modelLayer = new Kinetic.Layer({
		width: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	modelStage.add(modelLayer);
	guiStage = new Kinetic.Stage({
		container: 'guiPanel' + modelContainerId,
		width: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEY
	});
	guiStage.add(guiLayer);
	// draw the model:
	drawCompleteModel();
	// register event-handlers:
	model.events.registerHandler('modelChangedEvent', function() {
		drawCompleteModel();
	});
	
	model.events.registerHandler('componentAddedEvent', function() {
		if (model.componentList.length > 0) componentViewList.push(ACS.componentView(model.componentList[model.componentList.length - 1], modelLayer, guiLayer));
		modelLayer.draw();
	});

	model.events.registerHandler('componentRemovedEvent', function() {
		var found = false;
		var i = 0;
		while (!found && (i < componentViewList.length)) {
			if (componentViewList[i].getComponent() === model.componentList[i]) {
				componentViewList[i].destroy();
				componentViewList.splice(i, 1);
				modelLayer.draw();
				found = true;
			}
			i++;
		}
	});

	model.events.registerHandler('dataChannelAddedEvent', function() {
		dataChannelViewList.push(ACS.dataChannelView(model.dataChannelList[model.dataChannelList.length -1], modelLayer, guiLayer));
		modelLayer.draw();
	});

	model.events.registerHandler('dataChannelRemovedEvent', function() {
		var found = false;
		var i = 0;
		while (!found && (i < dataChannelViewList.length)) {
			if (dataChannelViewList[i].getChannel() === model.dataChannelList[i]) {
				dataChannelViewList[i].destroy();
				dataChannelViewList.splice(i, 1);
				modelLayer.draw();
				found = true;
			}
			i++;
		}
	});

	model.events.registerHandler('eventChannelAddedEvent', function() {
		eventChannelViewList.push(ACS.eventChannelView(model.eventChannelList[model.eventChannelList.length -1], modelLayer, guiLayer));
		modelLayer.draw();
	});

	model.events.registerHandler('eventChannelRemovedEvent', function() {
		var found = false;
		var i = 0;
		while (!found && (i < eventChannelViewList.length)) {
			if (eventChannelViewList[i].getChannel() === model.eventChannelList[i]) {
				eventChannelViewList[i].destroy();
				eventChannelViewList.splice(i, 1);
				modelLayer.draw();
				found = true;
			}
			i++;
		}
	});	
	
	return returnObj;
}