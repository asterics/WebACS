import EventChannel from "../../model/eventChannel.js";

describe('EventChannel', () => {

	test('init', () => {
		var ch = EventChannel('theID');
		expect(ch.getId()).toBe('theID');
	});

	test('setId()', () => {
		var ch = EventChannel('theID');
		ch.setId('anotherID');
		expect(ch.getId()).toBe('anotherID');
	});

	test('setIsSelected()', () => {
		var ch = EventChannel('theID');
		ch.setIsSelected(true);
		expect(ch.getIsSelected()).toBe(true);
	});
});