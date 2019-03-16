import Component from "../../model/component.js";

describe('Component', () => {

	test("init", () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		expect(comp.getId()).toBe("comp1");
		expect(comp.getComponentTypeId()).toBe("typeID");
		expect(comp.getDescription()).toBe("desc");
		expect(comp.getSingleton()).toBe(true);
		expect(comp.getX()).toBe(1);
		expect(comp.getY()).toBe(2);
		expect(comp.getType()).toBe("actuator");
		expect(comp.getIsSelected()).toBe(true);
		expect(comp.foundInComponentCollection).toBe(true);
	});

	test("setId()", () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		comp.setId("comp2");
		expect(comp.getId()).toBe("comp2");
	});

	test("setDescription()", () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		comp.setDescription("desc 1");
		expect(comp.getDescription()).toBe("desc 1");
	});

	test("setNewPosition()", () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		comp.setNewPosition(2,3);
		expect(comp.getX()).toBe(2);
		expect(comp.getY()).toBe(3);
	});

	test("setIsSelected()", () => {
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		comp.setIsSelected(false);
		expect(comp.getIsSelected()).toBe(false);
	});
});