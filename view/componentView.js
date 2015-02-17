ACS.componentView = function(	component, // ACS.component
								model, // ACS.model
								modelView, // ACS.modelView
								modelLayer, // Kinetic.Layer
								guiLayer) { // Kinetic.Layer
	// private variables
	var visible = true;
	var view = null;
	var inputPortViewList = [];
	var outputPortViewList = [];
	var eventOutPortView = null;
	var eventInPortView = null;
	var selectedRect = null;

	// private methods
	var channelExists = function(inPort) {
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getInputPort() === inPort) return true;
		}
		return false;
	}
	
	var eventChannelViewExists = function(startComp, endComp) {
		var ecvl = modelView.getEventChannelViewList();
		for (var i = 0; i < ecvl.length; i++) {
			if ((ecvl[i].getStartComponent() === startComp) && (ecvl[i].getEndComponent() === endComp)) return true;
		}
		return false;
	}
	
	var buildView = function() {
		// determine height of the element, depending on the amount of input- and/or output-ports
		var elementHeight = ACS.vConst.COMPONENTVIEW_ELEMENTHEIGHT;
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
						model.addDataChannel(ch);
					}
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
				var ecvl = modelView.getEventChannelViewList();
				if ((ecvl.length > 0) && (!ecvl[ecvl.length - 1].getEndComponent())) {
					if (!eventChannelViewExists(ecvl[ecvl.length - 1].getStartComponent(), component)) {
						evt.cancelBubble = true;
						ecvl[ecvl.length - 1].setEndComponent(component);
						modelLayer.draw();
					}
				}
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
				var ecvl = modelView.getEventChannelViewList();
				if (!((ecvl.length > 0) && (!ecvl[ecvl.length - 1].getEndComponent()))) {
					evt.cancelBubble = true;
					modelView.addEventChannelView(ACS.eventChannelView(null, component, model, modelLayer));
				}
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
		// group all parts and make component draggable
		view = new Kinetic.Group({
			draggable: true
			//doNotSelectOnNextClick: false
		});
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
		// draw the error marker round the component, in case the component did not match the collection
		if (!component.matchesComponentCollection) {
			view.add(errorRect);
			errorRect.setZIndex(-1000);
		}
		// set this component to highest z-value of all on the layer
		view.on('mousedown', function(e) {
			this.moveToTop();
		});
		// do the selecting
		view.on('click', function(e) {
			if (e.evt.ctrlKey) {
				component.setIsSelected(!component.getIsSelected());
			} else {
				model.deSelectAll();
				component.setIsSelected(true);
			}
			e.cancelBubble = true;
		});
		view.on('dragmove', function() {
			component.setNewPosition(mainRect.getAbsolutePosition().x, mainRect.getAbsolutePosition().y);
		});
		// add the group to the layer
		modelLayer.add(view);
	}
	
	// public stuff
	var returnObj = {};

	returnObj.setVisible = function(vis) {
		visible = vis;
		if (view) {
			if (vis === true) {
				view.unhide();
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
		if (view) view.destroy();
	}
	
	// constructor code
	buildView();
	// register event handlers
	component.events.registerHandler('selectedEvent', function() {
		view.add(selectedRect);
		selectedRect.setZIndex(-100);
		modelLayer.draw();
	});
	component.events.registerHandler('deSelectedEvent', function() {
		selectedRect.remove();
		modelLayer.draw();
	});	
	
	return returnObj;
}