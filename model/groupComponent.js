ACS.groupComponent = function(id, // String; TODO: decide if this is really necessary
							  componentTypeId, // String
							  name, // String
							  description, // String
							  singleton, // bool
							  x, // int
							  y, // int
							  type, // ACS.componentType
							  inputPortList, // Array<ACS.dataPort>
							  outputPortList, // Array<ACS.dataPort>
							  eventListenerPort, // ACS.eventPort
							  eventTriggerPort, // ACS.eventPort
							  propertyList, // Array<ACS.property>
							  gui, // acsGui
							  isSelected, // bool
							  groupedComponents, // Array<ACS.component>
							  groupedEventChannels, // Array<ACS.eventChannel>
							  groupedDataChannels) { // Array<ACS.dataChannel>

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = acsComponent(id, componentTypeId, name, description, singleton, x, y, type, inputPortList, outputPortList, eventListenerPort, eventTriggerPort, propertyList, gui, isSelected);
	
	returnObj.groupedComponents = groupedComponents;
	returnObj.groupedEventChannels = groupedEventChannels;
	returnObj.groupedDataChannels = groupedDataChannels;

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	
	return returnObj;
}