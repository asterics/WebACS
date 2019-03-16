import MetaData from "../../model/metaData.js";

describe('MetaData', () => {

	test('init', () => {
		var md = MetaData('keyString', 'some value');
		expect(md.getKey()).toBe('keyString');
		expect(md.value).toBe('some value');
	});
});