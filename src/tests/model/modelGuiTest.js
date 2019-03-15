import ModelGui from "../../model/modelGui.js";

import QUnit from "qunit";

QUnit.module( 'modelGui' );

QUnit.test( 'modelGui setDecoration', function( assert ) {
	var mGui = ModelGui();
	mGui.setDecoration(false);
	assert.strictEqual(mGui.getDecoration(), false);
});

QUnit.test( 'modelGui setFullScreen', function( assert ) {
	var mGui = ModelGui();
	mGui.setFullScreen(true);
	assert.strictEqual(mGui.getFullScreen(), true);
});

QUnit.test( 'modelGui setAlwaysOnTop', function( assert ) {
	var mGui = ModelGui();
	mGui.setAlwaysOnTop(true);
	assert.strictEqual(mGui.getAlwaysOnTop(), true);
});

QUnit.test( 'modelGui setToSystemTray', function( assert ) {
	var mGui = ModelGui();
	mGui.setToSystemTray(true);
	assert.strictEqual(mGui.getToSystemTray(), true);
});

QUnit.test( 'modelGui setShowControlPanel', function( assert ) {
	var mGui = ModelGui();
	mGui.setShowControlPanel(false);
	assert.strictEqual(mGui.getShowControlPanel(), false);
});