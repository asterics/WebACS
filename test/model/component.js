QUnit.test( "Component Initialization", function( assert ) {
	var comp = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	assert.equal(comp.getId(),"comp1");
	assert.equal(comp.getComponentTypeId(),"typeID");
	assert.equal(comp.getDescription(),"desc");
	assert.equal(comp.getSingleton(),true);
	assert.equal(comp.getX(),1);
	assert.equal(comp.getY(),2);
	assert.equal(comp.getType(),"actuator");
	assert.equal(comp.getIsSelected(),true);
	assert.equal(comp.foundInComponentCollection,true);
});

QUnit.test( "Component SetID", function( assert ) {
	var comp = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	comp.setId("comp2");
	assert.equal(comp.getId(),"comp2");
	
});

QUnit.test( "Component SetDescription", function( assert ) {
	var comp = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	comp.setDescription("desc 1");
	assert.equal(comp.getDescription(),"desc 1");
});

QUnit.test( "Component setNewPosition 0", function( assert ) {
	var comp = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	comp.setNewPosition(2,3);
	assert.equal(comp.getX(),2);
	assert.equal(comp.getY(),3);
});

QUnit.test( "Component Set IsSelected", function( assert ) {
	var comp = ACS.component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	comp.setIsSelected(false);
	assert.equal(comp.getIsSelected(),false);
});
