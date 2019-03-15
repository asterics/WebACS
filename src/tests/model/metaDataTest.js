import MetaData from "../../model/metaData.js";

import QUnit from "qunit";

QUnit.module( 'metaData' );

QUnit.test( 'metaData initialization', function( assert ) {
	var md = MetaData('keyString', 'some value');
	assert.strictEqual(md.getKey(), 'keyString');
	assert.strictEqual(md.value, 'some value');
});