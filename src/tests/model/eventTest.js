import Component from "../../model/component.js";
import Event from "../../model/event.js";

import QUnit from "qunit";

QUnit.module( 'event' );

QUnit.test( 'event initialization', function( assert ) {
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var evt = Event('evtId', 'description', comp);
	assert.strictEqual(evt.getId(), 'evtId');
	assert.strictEqual(evt.getDescription(), 'description');
	assert.strictEqual(evt.getParentComponent(), comp);
});

