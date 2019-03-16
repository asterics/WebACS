import Component from "../../model/component.js";
import Port from "../../model/port.js";

describe('Port', () => {

	test('init', () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		expect(port.getId()).toBe('portId');
		expect(port.getParentComponent()).toBe(comp);
		expect(port.getType()).toBe(2);
		expect(port.getDataType()).toBe(3);
		expect(port.getPosition()).toBe(4);
		expect(port.getMustBeConnected()).toBe(true);
	});
});
