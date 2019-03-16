import Component from "../../model/component.js";
import Event from "../../model/event.js";

describe('Event', () => {

	test('init', () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var evt = Event('evtId', 'description', comp);
		expect(evt.getId()).toBe('evtId');
		expect(evt.getDescription()).toBe('description');
		expect(evt.getParentComponent()).toBe(comp);
	});
});