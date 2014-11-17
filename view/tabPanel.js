ACS.tabPanelKeyCodes = {
  TAB: 9,
  ENTER: 13,
  ECS: 27,
  SPACE: 32,
  PGUP: 33,
  PGDOWN: 34,
  END: 35,
  POS1: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

// for the tabPanel to work
// - all tabs need to be of class "tab"
// - all panels need to be of class "panel"
ACS.tabPanel = function(id, tab, panel) { // String; the id of the div-container holding the tabPanel
	// private variables
	var $panel = $('#' + id);  // the jQuery object for the panel
	var $tabs = $panel.find('.' + tab); // Array of panel tabs.
	var $panels = $panel.children('.' + panel); // Array of panels.			
	
	// private methods
	var initPanel = function() {
		var $tab; // the selected tab

		// add aria attributes to the panels
		$panels.attr('aria-hidden', 'true');
		// get the selected tab
		$tab = $tabs.filter('[aria-selected="true"]');
		// set to first ab, in case none is selected yet
		if ($tab === undefined) {
			$tab = $tabs.first();
		}

		// show the panel that the selected tab controls and set aria-hidden to false
		$panel.find('#' + $tab.attr('aria-controls')).attr('aria-hidden', 'false');		
	}
	
	var switchTabs = function($curTab, // jQuery object of the currently selected tab
							  $newTab) { // jQuery object of new tab to switch to
		$curTab.removeClass('focus');
		// remove tab from the tab order and update its aria-selected attribute
		$curTab.attr('tabindex', '-1').attr('aria-selected', 'false');
		// Highlight the new tab and update its aria-selected attribute
		$newTab.attr('aria-selected', 'true');
		// swap displayed tabs:
		// hide the current tab panel and set aria-hidden to true
		$panel.find('#' + $curTab.attr('aria-controls')).attr('aria-hidden', 'true');
		// show the new tab panel and set aria-hidden to false
		$panel.find('#' + $newTab.attr('aria-controls')).attr('aria-hidden', 'false');

		// Make new tab navigable
		$newTab.attr('tabindex', '0');
		// give the new tab focus
		$newTab.focus();
		// tell others that a new tab is focussed
		returnObj.events.fireEvent('tabSwitchedEvent');
	}
	
	var bindEventHandlers = function() {
		// Bind handlers for the tabs:
		$tabs.keydown(function(e) {
			return handleTabKeyDown($(this), e);
		});

		$tabs.keypress(function(e) {
			return handleTabKeyPress($(this), e);
		});

		$tabs.click(function(e) {
			return handleTabClick($(this), e);
		});

		$tabs.focus(function(e) {
			return handleTabFocus($(this), e);
		});

		$tabs.blur(function(e) {
			return handleTabBlur($(this), e);
		});

		// Bind handlers for the panels:
		$panels.keydown(function(e) {
			return handlePanelKeyDown($(this), e);
		});

		$panels.keypress(function(e) {
			return handlePanelKeyPress($(this), e);
		});
	}
	
	var handleTabKeyDown = function($tab, // jquery object of the tab being processed
									e) { // the associated event object
		// returns true if propagating; false if consuming event									

		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case ACS.tabPanelKeyCodes.ENTER:
			case ACS.tabPanelKeyCodes.SPACE: return true;

			case ACS.tabPanelKeyCodes.LEFT:
			case ACS.tabPanelKeyCodes.UP: {
											var $newTab;

											if (e.ctrlKey) {
												// Ctrl+arrow moves focus from panel content to the open tab header
											} else {
												var curIdx = $tabs.index($tab);

												if (curIdx === 0) {
												  // tab is the first one - set newTab to last tab
												  $newTab = $tabs.last();
												} else {
												  // set newTab to previous
												  $newTab = $tabs.eq(curIdx - 1);
												}
												switchTabs($tab, $newTab);
											}
											e.stopPropagation();
											return false;
										  }
			case ACS.tabPanelKeyCodes.RIGHT:
			case ACS.tabPanelKeyCodes.DOWN: {
												var $newTab;
												var curIdx = $tabs.index($tab);

												if (curIdx === $tabs.length-1) {
													// tab is the last one - set newTab to first tab
													$newTab = $tabs.first();
												} else {
													// set newTab to next tab
													$newTab = $tabs.eq(curIdx + 1);
												}
												switchTabs($tab, $newTab);

												e.stopPropagation();
												return false;
											}
			case ACS.tabPanelKeyCodes.POS1: {
												// switch to the first tab
												switchTabs($tab, $tabs.first());
												e.stopPropagation();
												return false;
											}
			case ACS.tabPanelKeyCodes.END: {
												// switch to the last tab
												switchTabs($tab, $tabs.last());
												e.stopPropagation();
												return false;
										   }
		}
	}
	
	var handleTabKeyPress = function($tab, // jquery object of the tab being processed
									 e) { // the associated event object
		// returns true if propagating; false if consuming event

	  if (e.altKey) {
		// do nothing
		return true;
	  }

	  switch (e.keyCode) {
		case ACS.tabPanelKeyCodes.ENTER:
		case ACS.tabPanelKeyCodes.SPACE:
		case ACS.tabPanelKeyCodes.LEFT:
		case ACS.tabPanelKeyCodes.UP:
		case ACS.tabPanelKeyCodes.RIGHT:
		case ACS.tabPanelKeyCodes.DOWN:
		case ACS.tabPanelKeyCodes.POS1:
		case ACS.tabPanelKeyCodes.END: {
											e.stopPropagation();
											return false;
										}
		case ACS.tabPanelKeyCodes.PGUP:
		case ACS.tabPanelKeyCodes.PGDOWN: {	// TODO: check if the following makes sense at all

												// The tab keypress handler must consume pageup and pagedown
												// keypresses to prevent Firefox from switching tabs
												// on ctrl+pageup and ctrl+pagedown

												if (!e.ctrlKey) {
													return true;
												}

												e.stopPropagation();
												return false;
											}
	  }

	  return true;

	}
	
	var handleTabClick = function($tab, // jQuery object of the tab being processed
								  e) { // the associated event object
		// hide the panels
		$panels.attr('aria-hidden', 'true');
		// remove all tabs from the tab order and reset their aria-selected attribute
		$tabs.attr('tabindex', '-1').attr('aria-selected', 'false');
		// Update the selected tab's aria-selected attribute
		$tab.attr('aria-selected', 'true');
		// show the clicked tab panel
		$panel.find('#' + $tab.attr('aria-controls')).attr('aria-hidden', 'false');
		// make clicked tab navigable
		$tab.attr('tabindex', '0');
		// give the tab focus
		$tab.focus();
		// tell others that a new tab is focussed
		returnObj.events.fireEvent('tabSwitchedEvent');

		return true;
	}

	var handleTabFocus = function($tab, // jQuery object of the tab being processed
								  e) { // the associated event object
		// Add the focus class to the tab
		$tab.addClass('focus');

		return true;
	}
	
	var handleTabBlur = function($tab, // jQuery object of the tab being processed
								  e) { // the associated event object
		// Remove the focus class to the tab
		$tab.removeClass('focus');

		return true;
	}
	
	var handlePanelKeyDown = function($elem, // jquery object of the element being processed
									  e) { // the associated event object
		// returns true if propagating; false if consuming event
		
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case ACS.tabPanelKeyCodes.ESC:  {
												e.stopPropagation();
												return false;
											}
			case ACS.tabPanelKeyCodes.LEFT:
			case ACS.tabPanelKeyCodes.UP: {
											if (!e.ctrlKey) {
												// do not process
												return true;
											}
											// get the jQuery object of the tab
											var $tab = $('#' + $elem.attr('aria-labelledby'));
											// Move focus to the tab
											$tab.focus();

											e.stopPropagation();
											return false;
										  }
			case ACS.tabPanelKeyCodes.PGUP: {
												var $newTab;

												if (!e.ctrlKey) {
													// do not process
													return true;
												}

												// get the jQuery object of the tab
												var $tab = $tabs.filter('[aria-selected="true"]');
												// get the index of the tab in the tab list
												var curNdx = $tabs.index($tab);
												if (curNdx === 0) {
													// this is the first tab, set focus on the last one
													$newTab = $tabs.last();
												} else {
													// set focus on the previous tab
													$newTab = $tabs.eq(curNdx - 1);
												}
												// switch to the new tab
												switchTabs($tab, $newTab);

												e.stopPropagation();
												e.preventDefault();
												return false;
											}
			case ACS.tabPanelKeyCodes.PGDOWN: {
												var $newTab;

												if (!e.ctrlKey) {
													// do not process
													return true;
												}
												// get the jQuery object of the tab
												var $tab = $('#' + $elem.attr('aria-labelledby'));
												// get the index of the tab in the tab list
												var curNdx = $tabs.index($tab);
												if (curNdx === $tabs.length-1) {
													// this is the last tab, set focus on the first one
													$newTab = $tabs.first();
												} else {
													// set focus on the next tab
													$newTab = $tabs.eq(curNdx + 1);
												}
												// switch to the new tab
												switchTabs($tab, $newTab);

												e.stopPropagation();
												e.preventDefault();
												return false;
											  }
		}

		return true;
	}
	
	var handlePanelKeyPress = function($elem, // jquery object of the element being processed
									   e) { // the associated event object
		// returns true if propagating; false if consuming event
		
		if (e.altKey) {
			// do nothing
			return true;
		}

		if (e.ctrlKey && (e.keyCode == ACS.tabPanelKeyCodes.PGUP || e.keyCode == ACS.tabPanelKeyCodes.PGDOWN)) {
			e.stopPropagation();
			e.preventDefault();
			return false;
		}
		switch (e.keyCode) {
			case ACS.tabPanelKeyCodes.ECS: {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}

		return true;
	}	
	
	// public stuff
	var returnObj = {};
	
	returnObj.updatePanel = function() {
		$panel = $('#' + id);  // the jQuery object for the panel
		$tabs = $panel.find('.' + tab); // Array of panel tabs.
		$panels = $panel.children('.' + panel); // Array of panels.				
		bindEventHandlers(); 
		initPanel();
	}
	
	returnObj.events = ACS.eventManager();

	// constructor code
	bindEventHandlers(); 
	initPanel();
	
	return returnObj;
}