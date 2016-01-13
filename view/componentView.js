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
 
 ACS.componentView = function(	component, // ACS.component
								model, // ACS.model
								modelView, // ACS.modelView
								modelLayer, // Kinetic.Layer
								guiLayer) { // Kinetic.Layer
								
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var visible = true;
	var view = null;
	var elementHeight = ACS.vConst.COMPONENTVIEW_ELEMENTHEIGHT;
	var inputPortViewList = [];
	var outputPortViewList = [];
	var eventOutPortView = null;
	var eventInPortView = null;
	var selectedRect = null;

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var channelExists = function(inPort) {
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getInputPort() === inPort) return true;
		}
		return false;
	}
	
	var buildView = function() {
		// determine height of the element, depending on the amount of input- and/or output-ports
		if ((component.outputPortList.length > 3) || (component.inputPortList.length > 3)) {
			if (component.outputPortList.length > component.inputPortList.length) {
				elementHeight = elementHeight + (component.outputPortList.length-3) * ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP;
			} else {
				elementHeight = elementHeight + (component.inputPortList.length-3) * ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP;
			}
		}	
		// construct main body of component
		var mainRect = new Kinetic.Rect({ 
			x: component.getX(),
			y: component.getY(),
			width: ACS.vConst.COMPONENTVIEW_ELEMENTWIDTH,
			height: elementHeight,
			fill: ACS.vConst.COMPONENTVIEW_COMPONENTCOLOR,
			stroke: ACS.vConst.COMPONENTVIEW_STROKECOLOR,
			strokeWidth: 1,
			cornerRadius: 5,
			listening: true
		});
		// add header-box and textual heading
		var topRect = new Kinetic.Rect({
			x: component.getX(),
			y: component.getY(),
			width: ACS.vConst.COMPONENTVIEW_ELEMENTWIDTH,
			height: ACS.vConst.COMPONENTVIEW_TOPRECTHEIGHT,
			fill: ACS.vConst.COMPONENTVIEW_COMPONENTHEADERCOLOR,
			stroke: ACS.vConst.COMPONENTVIEW_STROKECOLOR,
			strokeWidth: 1,
			cornerRadius: 5,
			listening: false
		});
		var headerText = new Kinetic.Text({
			x: component.getX() + ACS.vConst.COMPONENTVIEW_HEADERTEXTPOSITIONX,
			y: component.getY() + ACS.vConst.COMPONENTVIEW_HEADERTEXTPOSITIONY,
			text: component.getId(),
			fontSize: ACS.vConst.COMPONENTVIEW_FONTSIZE,
			fill: ACS.vConst.COMPONENTVIEW_TEXTCOLOR,
			width: ACS.vConst.COMPONENTVIEW_HEADERTEXTWIDTH,
			wrap: 'char'
		});
		// construct input ports and their labels
		for (var i = 0; i < component.inputPortList.length; i++) {
			inputPortViewList[i] = [];
			inputPortViewList[i]['port'] = new Kinetic.Rect({
				x: component.getX() - ACS.vConst.COMPONENTVIEW_INPUTPORTLEFTOFCOMPONENT,
				y: component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTINPUTPORTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i,
				width: ACS.vConst.COMPONENTVIEW_PORTWIDTH,
				height: ACS.vConst.COMPONENTVIEW_PORTHEIGHT,
				fill: ACS.vConst.COMPONENTVIEW_INPUTPORTCOLOR,
				stroke: ACS.vConst.COMPONENTVIEW_STROKECOLOR,
				strokeWidth: 1,
				cornerRadius: 3,
				listening: true,
			});	
			inputPortViewList[i]['label'] = new Kinetic.Text({
				x: component.getX() + ACS.vConst.COMPONENTVIEW_INPUTPORTLABELPOSITIONX,
				y: component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTINPUTPORTY + 1 + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i,
				text: component.inputPortList[i].getId(),
				fontSize: ACS.vConst.COMPONENTVIEW_FONTSIZE,
				fill: ACS.vConst.COMPONENTVIEW_TEXTCOLOR,
				width: ACS.vConst.COMPONENTVIEW_PORTLABELWIDTH
			});
			// listen for click event on port
			inputPortViewList[i]['port'].on('click', function(inPort) {
				return function(evt) {
					log.debug('clicked inputport');
					if ((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort())) {
						if (!channelExists(inPort)) {
							evt.cancelBubble = true;
							model.dataChannelList[model.dataChannelList.length - 1].setInputPort(inPort);
						}
					}
				}
			}(component.inputPortList[i]));
			// catch mousedown event on port (prevents component from being selected, when only the port is clicked, e.g. when channel is drawn)
			inputPortViewList[i]['port'].on('mousedown', function(inPort) {
				return function(evt) {
					evt.cancelBubble = true;
				}
			}(component.inputPortList[i]));						
			// highlight port when mouse is over hitGraph
			inputPortViewList[i]['port'].on('mouseover', function(inPort) {
				return function(e) {
					inPort.strokeWidth(3);
					modelLayer.draw();
				}
			}(inputPortViewList[i]['port']));
			inputPortViewList[i]['port'].on('mouseout', function(inPort) {
				return function(e) {
					inPort.strokeWidth(1);
					modelLayer.draw();
				}
			}(inputPortViewList[i]['port']));
		}
		// construct output ports and their Labels
		for (var i = 0; i < component.outputPortList.length; i++) {
			outputPortViewList[i] = [];
			outputPortViewList[i]['port'] = new Kinetic.Rect({
				x: component.getX() + ACS.vConst.COMPONENTVIEW_OUTPUTPORTPOSITIONX,
				y: component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTOUTPUTPORTPOSITIONY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i,
				width: ACS.vConst.COMPONENTVIEW_PORTWIDTH,
				height: ACS.vConst.COMPONENTVIEW_PORTHEIGHT,
				fill: ACS.vConst.COMPONENTVIEW_OUTPUTPORTCOLOR,
				stroke: ACS.vConst.COMPONENTVIEW_STROKECOLOR,
				strokeWidth: 1,
				cornerRadius: 3,
				listening: true
				//port: 'output',
				//DOMElement: compOutputPorts[i]
			});
			outputPortViewList[i]['label'] = new Kinetic.Text({
				x: component.getX() + ACS.vConst.COMPONENTVIEW_OUTPUTPORTLABELPOSITIONX,
				y: component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTOUTPUTPORTPOSITIONY + 1 + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i,
				text: component.outputPortList[i].getId(),
				fontSize: ACS.vConst.COMPONENTVIEW_FONTSIZE,
				fill: ACS.vConst.COMPONENTVIEW_TEXTCOLOR,
				align: 'right',
				width: ACS.vConst.COMPONENTVIEW_PORTLABELWIDTH
			});
			// listen for click event on port
			outputPortViewList[i]['port'].on('click', function(outPort) {
				return function(evt) {
					log.debug('clicked outputport');
					if (!((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort()))) {
						evt.cancelBubble = true;
						var ch = ACS.dataChannel('tempId'); // TODO: generate a proper ID or drop ID for channels
						ch.setOutputPort(outPort);
						var addAct = ACS.addDataChannelAction(model, ch);
						addAct.execute();
					}
				}
			}(component.outputPortList[i]));
			// catch mousedown event on port (prevents component from being selected, when only the port is clicked, e.g. when channel is drawn)
			outputPortViewList[i]['port'].on('mousedown', function(outPort) {
				return function(evt) {
					evt.cancelBubble = true;
				}
			}(component.outputPortList[i]));			
			// highlight port when mouse is over hitGraph
			outputPortViewList[i]['port'].on('mouseover', function(outPort) {
				return function(e) {
					outPort.strokeWidth(3);
					modelLayer.draw();
				}
			}(outputPortViewList[i]['port']));
			outputPortViewList[i]['port'].on('mouseout', function(outPort) {
				return function(e) {
					outPort.strokeWidth(1);
					modelLayer.draw();
				}
			}(outputPortViewList[i]['port']));			
		}
		// construct event-input and event-output ports, if necessary
		if (component.listenEventList.length > 0) {
			eventInPortView = new Kinetic.Shape({
				x: component.getX() + ACS.vConst.COMPONENTVIEW_EVENTLISTENERPORTPOSITIONX,
				y: component.getY() + elementHeight - ACS.vConst.COMPONENTVIEW_EVENTPORTYINSIDECOMPONENT,
				fill: ACS.vConst.COMPONENTVIEW_EVENTINPUTPORTCOLOR,
				stroke: ACS.vConst.COMPONENTVIEW_STROKECOLOR,
				strokeWidth: 1,
				drawFunc: function(context) {
					context.beginPath();
					context.moveTo(0, 0);
					context.lineTo(0, ACS.vConst.COMPONENTVIEW_EVENTPORTHEIGHT);
					context.lineTo(ACS.vConst.COMPONENTVIEW_EVENTPORTWIDTH / 2, ACS.vConst.COMPONENTVIEW_EVENTPORTHEIGHT * 0.8);
					context.lineTo(ACS.vConst.COMPONENTVIEW_EVENTPORTWIDTH, ACS.vConst.COMPONENTVIEW_EVENTPORTHEIGHT);
					context.lineTo(ACS.vConst.COMPONENTVIEW_EVENTPORTWIDTH, 0);
					context.lineTo(0, 0);
					context.closePath();
					context.fillStrokeShape(this);
				},
				listening: true
			});	
			eventInPortView.on('click', function(evt) {
				log.debug('clicked eventInputPort');
				if ((model.eventChannelList.length > 0) && (!model.eventChannelList[model.eventChannelList.length - 1].endComponent)) {
					evt.cancelBubble = true;
					model.eventChannelList[model.eventChannelList.length - 1].setId(model.eventChannelList[model.eventChannelList.length - 1].getId() + component.getId()); // this ID currently involves start- and end-component - therefore it must be finalised here, on completion of channel
					model.eventChannelList[model.eventChannelList.length - 1].endComponent = component;
					model.eventChannelList[model.eventChannelList.length - 1].events.fireEvent('eventChannelCompletedEvent');
					modelLayer.draw();
				}
			});
			// catch mousedown event on port (prevents component from being selected, when only the port is clicked, e.g. when channel is drawn)
			eventInPortView.on('mousedown', function(evt) {
				evt.cancelBubble = true;
			});
			// highlight port when mouse is over hitGraph
			eventInPortView.on('mouseover', function(e) {
				eventInPortView.strokeWidth(3);
				modelLayer.draw();
			});
			eventInPortView.on('mouseout', function(e) {
				eventInPortView.strokeWidth(1);
				modelLayer.draw();
			});			
		}
		if (component.triggerEventList.length > 0) {
			eventOutPortView = new Kinetic.Shape({
				x: component.getX() + ACS.vConst.COMPONENTVIEW_EVENTTRIGGERPORTPOSITIONX,
				y: component.getY()+elementHeight - ACS.vConst.COMPONENTVIEW_EVENTPORTYINSIDECOMPONENT,
				fill: ACS.vConst.COMPONENTVIEW_EVENTOUTPUTPORTCOLOR,
				stroke: ACS.vConst.COMPONENTVIEW_STROKECOLOR,
				strokeWidth: 1,
				drawFunc: function(context) {
					context.beginPath();
					context.moveTo(0, 0);
					context.lineTo(0, ACS.vConst.COMPONENTVIEW_EVENTPORTHEIGHT * 0.8);
					context.lineTo(ACS.vConst.COMPONENTVIEW_EVENTPORTWIDTH / 2, ACS.vConst.COMPONENTVIEW_EVENTPORTHEIGHT);
					context.lineTo(ACS.vConst.COMPONENTVIEW_EVENTPORTWIDTH, ACS.vConst.COMPONENTVIEW_EVENTPORTHEIGHT * 0.8);
					context.lineTo(ACS.vConst.COMPONENTVIEW_EVENTPORTWIDTH, 0);
					context.lineTo(0, 0);
					context.closePath();
					context.fillStrokeShape(this);
				},
				listening: true
			});
			// listen for click event on port
			eventOutPortView.on('click', function(evt) {
				log.debug('clicked eventOutputPort');
				if (!((model.eventChannelList.length > 0) && (!model.eventChannelList[model.eventChannelList.length - 1].endComponent))) {
					evt.cancelBubble = true;
					var ch = ACS.eventChannel(component.getId() + '_'); // second half of ID is added, when channel is completed
					ch.startComponent = component;
					var addAct = ACS.addEventChannelAction(model, ch);
					addAct.execute();
				}
			});
			// catch mousedown event on port (prevents component from being selected, when only the port is clicked, e.g. when channel is drawn)
			eventOutPortView.on('mousedown', function(evt) {
				evt.cancelBubble = true;
			});		
			// highlight port when mouse is over hitGraph
			eventOutPortView.on('mouseover', function(e) {
				eventOutPortView.strokeWidth(3);
				modelLayer.draw();
			});
			eventOutPortView.on('mouseout', function(e) {
				eventOutPortView.strokeWidth(1);
				modelLayer.draw();
			});				
		}
		// define the selection frame
		selectedRect = new Kinetic.Rect({
			x: component.getX() - ACS.vConst.COMPONENTVIEW_SELECTIONFRAMEWIDTH,
			y: component.getY() - ACS.vConst.COMPONENTVIEW_SELECTIONFRAMEWIDTH,
			width: ACS.vConst.COMPONENTVIEW_ELEMENTWIDTH + (2 * ACS.vConst.COMPONENTVIEW_SELECTIONFRAMEWIDTH),
			height: elementHeight + (2 * ACS.vConst.COMPONENTVIEW_SELECTIONFRAMEWIDTH),
			fill: ACS.vConst.COMPONENTVIEW_SELECTIONFRAMECOLOR,
			stroke: ACS.vConst.COMPONENTVIEW_SELECTIONFRAMESTROKECOLOR,
			strokeWidth: 1,
			cornerRadius: 0,
			listening: true
		});
		selectedRect.hide();
		// define the error marker
		var errorRect = new Kinetic.Rect({ 
			x: component.getX() - ACS.vConst.COMPONENTVIEW_ERRORMARKERWIDTH,
			y: component.getY() - ACS.vConst.COMPONENTVIEW_ERRORMARKERWIDTH,
			width: ACS.vConst.COMPONENTVIEW_ELEMENTWIDTH + (2 * ACS.vConst.COMPONENTVIEW_ERRORMARKERWIDTH),
			height: elementHeight + (2 * ACS.vConst.COMPONENTVIEW_ERRORMARKERWIDTH),
			fill: ACS.vConst.COMPONENTVIEW_ERRORMARKERCOLOR,
			stroke: ACS.vConst.COMPONENTVIEW_ERRORMARKERCOLOR,
			strokeWidth: 1,
			cornerRadius: 0,
			listening: true
		});
		errorRect.hide();
		// group all parts and make component draggable
		view = new Kinetic.Group({
			draggable: true,
			comp: component
		});
		view.add(errorRect); // always added to keep sequence of components in view consistent
		view.add(selectedRect); // always added to keep sequence of components in view consistent
		view.add(mainRect);
		view.add(topRect);
		view.add(headerText);
		for (var i = 0; i < inputPortViewList.length; i++) {
			view.add(inputPortViewList[i]['port']);
			view.add(inputPortViewList[i]['label']);
		}
		for (var i = 0; i < outputPortViewList.length; i++) {
			view.add(outputPortViewList[i]['port']);
			view.add(outputPortViewList[i]['label']);
		}
		if (eventInPortView) {view.add(eventInPortView)};
		if (eventOutPortView) {view.add(eventOutPortView)};
		// show the error marker round the component, in case the component did not match the collection
		if (!component.matchesComponentCollection) {
			errorRect.show();
		}
		view.on('mousedown', function(e) {
			if (!e.evt.ctrlKey && !component.getIsSelected()) {
				// select only this component
				model.deSelectAll();
				model.addItemToSelection(component);
			}
			if (!component.getIsSelected()) {
				e.cancelBubble = true;
			}
		});
		view.on('click', function(e) {
			if (e.evt.ctrlKey) {
				// invert selection status
				var newStatus = !component.getIsSelected();
				if (newStatus) {
					model.addItemToSelection(component); 
				} else {
					model.removeItemFromSelection(component);
				}
			}
		});
		// add the group to the layer
		modelLayer.add(view);
	}

	var setViewPosition = function() {
		view.x(0);
		view.y(0);
		var ch = view.getChildren();
		ch[0].x(component.getX() - ACS.vConst.COMPONENTVIEW_ERRORMARKERWIDTH); // errorRect
		ch[0].y(component.getY() - ACS.vConst.COMPONENTVIEW_ERRORMARKERWIDTH); // errorRect
		ch[1].x(component.getX() - ACS.vConst.COMPONENTVIEW_SELECTIONFRAMEWIDTH); // selectedRect
		ch[1].y(component.getY() - ACS.vConst.COMPONENTVIEW_SELECTIONFRAMEWIDTH); // selectedRect
		ch[2].x(component.getX()); // mainRect
		ch[2].y(component.getY()); // mainRect
		ch[3].x(component.getX()); // topRect
		ch[3].y(component.getY()); // topRect
		ch[4].x(component.getX() + ACS.vConst.COMPONENTVIEW_HEADERTEXTPOSITIONX); // headerText
		ch[4].y(component.getY() + ACS.vConst.COMPONENTVIEW_HEADERTEXTPOSITIONY); // headerText
		for (var i = 0; i < inputPortViewList.length; i++) {
			inputPortViewList[i]['port'].x(component.getX() - ACS.vConst.COMPONENTVIEW_INPUTPORTLEFTOFCOMPONENT);
			inputPortViewList[i]['port'].y(component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTINPUTPORTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i);
			inputPortViewList[i]['label'].x(component.getX() + ACS.vConst.COMPONENTVIEW_INPUTPORTLABELPOSITIONX);
			inputPortViewList[i]['label'].y(component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTINPUTPORTY + 1 + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i);
		}
		for (var i = 0; i < outputPortViewList.length; i++) {
			outputPortViewList[i]['port'].x(component.getX() + ACS.vConst.COMPONENTVIEW_OUTPUTPORTPOSITIONX);
			outputPortViewList[i]['port'].y(component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTOUTPUTPORTPOSITIONY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i);
			outputPortViewList[i]['label'].x(component.getX() + ACS.vConst.COMPONENTVIEW_OUTPUTPORTLABELPOSITIONX);
			outputPortViewList[i]['label'].y(component.getY() + ACS.vConst.COMPONENTVIEW_FIRSTOUTPUTPORTPOSITIONY + 1 + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * i);
		}	
		if (eventInPortView) {
			eventInPortView.x(component.getX() + ACS.vConst.COMPONENTVIEW_EVENTLISTENERPORTPOSITIONX);
			eventInPortView.y(component.getY() + elementHeight - ACS.vConst.COMPONENTVIEW_EVENTPORTYINSIDECOMPONENT);
		}
		if (eventOutPortView) {
			eventOutPortView.x(component.getX() + ACS.vConst.COMPONENTVIEW_EVENTTRIGGERPORTPOSITIONX);
			eventOutPortView.y(component.getY() + elementHeight - ACS.vConst.COMPONENTVIEW_EVENTPORTYINSIDECOMPONENT);
		}
	}
	
	var selectView = function() {
		selectedRect.show();
		view.setAttr('draggable', false);
		modelView.selectedComponentsGroup.add(view);
		modelView.selectedComponentsGroup.moveToTop();
		view.x(view.getX() - modelView.selectedComponentsGroup.getX());
		view.y(view.getY() - modelView.selectedComponentsGroup.getY());
	}
	
	var setSelectionBounds = function() {
		if (modelView.selectedComponentsGroup.children.length > 0) {
			var i, left, right, upper, lower;
			for (i = 0; i < modelView.selectedComponentsGroup.children.length; i++) {
				// calculate the bounds of the element
				left = modelView.selectedComponentsGroup.children[i].children[2].x();
				right = modelView.selectedComponentsGroup.children[i].children[2].x() + ACS.vConst.COMPONENTVIEW_ELEMENTWIDTH;
				upper = modelView.selectedComponentsGroup.children[i].children[2].y();
				lower = modelView.selectedComponentsGroup.children[i].children[2].y() + ACS.vConst.COMPONENTVIEW_ELEMENTHEIGHT;
				if (modelView.selectedComponentsGroup.children.length > 1) {
					// compare to the current bounds and set to the outer-most
					if (left < modelView.selectedComponentsGroup.leftBound) modelView.selectedComponentsGroup.leftBound = left;
					if (right > modelView.selectedComponentsGroup.rightBound) modelView.selectedComponentsGroup.rightBound = right;
					if (upper < modelView.selectedComponentsGroup.upperBound) modelView.selectedComponentsGroup.upperBound = upper;
					if (lower > modelView.selectedComponentsGroup.lowerBound) modelView.selectedComponentsGroup.lowerBound = lower;
				} else {
					// set current bounds to bounds of the only element
					modelView.selectedComponentsGroup.leftBound = left;
					modelView.selectedComponentsGroup.rightBound = right;
					modelView.selectedComponentsGroup.upperBound = upper;
					modelView.selectedComponentsGroup.lowerBound = lower;
				}
			}
		}
	}
	
	// ********************************************** handlers ***********************************************************
	var selectedEventHandler = function() {
		selectView();
		setSelectionBounds();
		modelLayer.draw();
	}
	
	var deSelectedEventHandler = function() {
		selectedRect.hide();
		view.setAttr('draggable', true);
		view.remove(); // view is in selectedComponentsGroup AND modelLayer, the remove-function only exists for removing from all parents, thus we need to remove and then add to the modelLayer again
		modelLayer.add(view);
		setViewPosition();
		setSelectionBounds();
		// reset selectedComponentsGroup to coordinates 0,0, if empty; also reset OldX and OldY
		if (modelView.selectedComponentsGroup.children.length === 0) {
			modelView.selectedComponentsGroup.position({x: 0, y: 0});
			modelView.selectedComponentsGroup.oldX = 0;
			modelView.selectedComponentsGroup.oldY = 0;
		}
		modelLayer.draw();
	}
	
	var componentPositionChangedEventHandler  = function() {
		if (!modelView.isDragging()) {
			if (component.getIsSelected()) {
				// this will set the position of the component right in the view
				component.setIsSelected(false);
				component.setIsSelected(true);
			} else {
				setViewPosition();
			}
			modelLayer.draw();
		}
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};

	returnObj.setVisible = function(vis) {
		visible = vis;
		if (view) {
			if (vis === true) {
				view.show();
			} else {
				view.hide();
			}
			visible = vis;
		}
	}
	
	returnObj.getVisible = function() {
		return visible;
	}	
	
	returnObj.getComponent = function() {
		return component;
	}	
	
	returnObj.destroy = function() {
		// unregister all handlers
		component.events.removeHandler('selectedEvent', selectedEventHandler);
		component.events.removeHandler('deSelectedEvent', deSelectedEventHandler);
		// destroy the view
		if (view) {
			view.destroy();
			view = null; // prevents program from terminating in an error, when getView() is called after destruction
		}
	}
	
	returnObj.getView = function() {
		return view;
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	buildView();
	// check if component is already selected on insert
	if (component.getIsSelected()) selectView();
	// register event handlers
	component.events.registerHandler('selectedEvent', selectedEventHandler);
	component.events.registerHandler('deSelectedEvent', deSelectedEventHandler);
	component.events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandler);

	return returnObj;
}