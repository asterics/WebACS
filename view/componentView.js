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
					modelView.addEventChannelView(ACS.eventChannelView(null, component, modelLayer));
				}
			});
		}
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
		// set this component to highest z-value of all on the layer
		view.on('mousedown', function() {
			this.moveToTop();
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
	
	return returnObj;
}