import Property from "../../model/property.js";

describe('Property', () => {

	test('init', () => {
		var ppt = Property('keyString', 3, '2.5');
		expect(ppt.getKey()).toBe('keyString');
		expect(ppt.getType()).toBe(3);
		expect(ppt.value).toBe('2.5');
	});
});