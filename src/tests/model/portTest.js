import Component from "../../model/component.js";
import Port from "../../model/port.js";

import QUnit from "qunit";

QUnit.module( 'port' );

QUnit.test( 'port initialization', function( assert ) {
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	assert.strictEqual(port.getId(), 'portId');
	assert.strictEqual(port.getParentComponent(), comp);
	assert.strictEqual(port.getType(), 2);
	assert.strictEqual(port.getDataType(), 3);
	assert.strictEqual(port.getPosition(), 4);
	assert.strictEqual(port.getMustBeConnected(), true);
});

