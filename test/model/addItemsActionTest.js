QUnit.module( 'addItemsAction' );

QUnit.test( 'addItemsAction initialization', function( assert ) {
	var model = ACS.model("test.acs");
	var comp1 = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var comp2 = ACS.component("comp2","typeID","desc",true,1,2,"actuator",true,true);
	var compList = [];
	compList.push(comp1);
	compList.push(comp2);
	var dc1 = ACS.dataChannel('dataChannel1');
	var dc2 = ACS.dataChannel('dataChannel2');
	var dcList = [];
	dcList.push(dc1);
	dcList.push(dc2);
	var ec1 = ACS.eventChannel('eventChannel1');
	var ec2 = ACS.eventChannel('eventChannel2');
	var ecList = [];
	ecList.push(ec1);
	ecList.push(ec2);
	var action = ACS.addItemsAction(model, compList, dcList, ecList);
	assert.strictEqual(action.getModel(), model);
});

QUnit.test( 'addItemsAction execute', function( assert ) {
	var model = ACS.model("test.acs");
	var comp1 = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var comp2 = ACS.component("comp2","typeID","desc",true,1,2,"actuator",true,true);
	var compList = [];
	compList.push(comp1);
	compList.push(comp2);
	var dc1 = ACS.dataChannel('dataChannel1');
	var dc2 = ACS.dataChannel('dataChannel2');
	var dcList = [];
	dcList.push(dc1);
	dcList.push(dc2);
	var ec1 = ACS.eventChannel('eventChannel1');
	var ec2 = ACS.eventChannel('eventChannel2');
	var ecList = [];
	ecList.push(ec1);
	ecList.push(ec2);
	var action = ACS.addItemsAction(model, compList, dcList, ecList);
	action.execute();
	assert.strictEqual(model.componentList[0], comp1);
	assert.strictEqual(model.componentList[1], comp2);
	assert.strictEqual(model.dataChannelList[0], dc1);
	assert.strictEqual(model.dataChannelList[1], dc2);
	assert.strictEqual(model.eventChannelList[0], ec1);
	assert.strictEqual(model.eventChannelList[1], ec2);
	assert.strictEqual(model.undoStack[0], action);
});

QUnit.test( 'addItemsAction undo', function( assert ) {
	var model = ACS.model("test.acs");
	var comp1 = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var comp2 = ACS.component("comp2","typeID","desc",true,1,2,"actuator",true,true);
	var compList = [];
	compList.push(comp1);
	compList.push(comp2);
	var dc1 = ACS.dataChannel('dataChannel1');
	var dc2 = ACS.dataChannel('dataChannel2');
	var dcList = [];
	dcList.push(dc1);
	dcList.push(dc2);
	var ec1 = ACS.eventChannel('eventChannel1');
	var ec2 = ACS.eventChannel('eventChannel2');
	var ecList = [];
	ecList.push(ec1);
	ecList.push(ec2);
	var action = ACS.addItemsAction(model, compList, dcList, ecList);
	action.execute();
	action.undo();
	assert.strictEqual(model.componentList.length, 0);
	assert.strictEqual(model.dataChannelList.length, 0);
	assert.strictEqual(model.eventChannelList.length, 0);
	assert.strictEqual(model.redoStack[0], action);
});