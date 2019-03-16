import DataChannel from "../../model/dataChannel.js";
import Port from "../../model/port.js";

describe('DataChannel', () => {

	test('init', () => {
		var ch = DataChannel('theID');
		expect(ch.getId()).toBe('theID');
	});

	test('setInputPort()', () => {
		var ch = DataChannel('theID');
		var port = Port('portId', {}, 2, 3, 4, true);
		ch.setInputPort(port);
		expect(ch.getInputPort()).toBe(port);
	});

	test('setOutputPort()', () => {
		var ch = DataChannel('theID');
		var port = Port('portId', {}, 2, 3, 4, true);
		ch.setOutputPort(port);
		expect(ch.getOutputPort()).toBe(port);
	});
});