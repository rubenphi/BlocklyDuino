/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Intercept data to modify toolbox for user
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

var jsonToolbox = toolbox_unified;

/**
 * Build the toolbox using toolbox definition in json files
 */
Code.buildToolbox = function() {
	var toolboxIds = Code.getStringParamFromUrl('toolboxids', '');
	var boardSelected = Code.getStringParamFromUrl('board', '');
	if (toolboxIds === undefined || toolboxIds === "") {
		if (boardSelected) {
			toolboxIds = 'LOGIC,CONTROL,MATH,TEXT,VARIABLES,LISTAS,FUNCTIONS,IO,SENSORS,ACTUATORS,MOTOR,TIME,BOARD';
			window.localStorage.defaultToolbox = 1;
		}
		else {
			toolboxIds = 'LOGIC,CONTROL,MATH,TEXT,VARIABLES,LISTAS,FUNCTIONS,TIME';
			window.localStorage.defaultToolbox = 0;
		}
	} else {
		toolboxIds += ',LOGIC,CONTROL,MATH,TEXT,VARIABLES,LISTAS,FUNCTIONS';
		window.localStorage.defaultToolbox = 2;
	}
	window.localStorage.toolboxids = toolboxIds;
	var jsonToolboxToKeep = {
		"kind": "categoryToolbox",
		"contents": []
	};
	var k = 0;
	toolboxIds = toolboxIds.split(",");
	for (let i = 0; i < jsonToolbox.contents.length; i++ ) {
		if (jsonToolbox.contents[i].type === 'board_setup' || jsonToolbox.contents[i].type === 'board_loop') {
			jsonToolboxToKeep.contents[k] = jsonToolbox.contents[i];
			k++;
		}
		else if (window.localStorage.defaultToolbox != 0) {
			for (var j = 0; j < toolboxIds.length; j++) {
				if (jsonToolbox.contents[i].toolboxitemid == toolboxIds[j]) {
					jsonToolboxToKeep.contents[k] = jsonToolbox.contents[i];
					k++;
				}
			}
		}
		else if (jsonToolbox.contents[i].level == "1") {
				jsonToolboxToKeep.contents[k] = jsonToolbox.contents[i];
				k++;
		}
	}
	return jsonToolboxToKeep;
}

Code.buildControlPanelForToolbox = function() {
	$('#categories_content')[0].innerHTML = "<br>";
	var ligne = "", id_liste = "";
	for (let i = 0; i < jsonToolbox.contents.length; i++ ) {
		if (jsonToolbox.contents[i].level == "1") {
			var rankInDisplayedToolbox = Blockly.getMainWorkspace().getToolbox().getToolboxItems().findIndex(x => x['id_'] == jsonToolbox.contents[i].toolboxitemid);
			if (rankInDisplayedToolbox >= 0) {
				ligne = '<input type="checkbox" checked="checked" onchange="toggleCategory(' + rankInDisplayedToolbox + ')" name="checkbox_' + rankInDisplayedToolbox + '" id="checkbox_' + rankInDisplayedToolbox + '"/> '
						+ '<span id="checkboxSpan_' + rankInDisplayedToolbox + '">' + Blockly.getMainWorkspace().getToolbox().getToolboxItems()[rankInDisplayedToolbox]['name_'] + '</span><br/>';
				id_liste += jsonToolbox.contents[i].toolboxitemid + ',';
				$('#categories_content')[0].innerHTML += ligne;
			}
			else if (window.localStorage.defaultToolbox == 0) {
				ligne = '<input type="checkbox" onchange="toggleCategory(' + rankInDisplayedToolbox + ')" name="checkbox_' + rankInDisplayedToolbox + '" id="checkbox_' + rankInDisplayedToolbox + '"/> '
						+ '<span id="checkboxSpan_' + rankInDisplayedToolbox + '">' + Blockly.getMainWorkspace().getToolbox().getToolboxItems()[rankInDisplayedToolbox]['name_'] + '<br/>';
				$('#categories_content')[0].innerHTML += ligne;
			}
		}
	}
	if (window.localStorage.defaultToolbox == 0)
		for (var j = 11; j < i; j++) 
			if (document.getElementById('checkbox_' + j) != null) document.getElementById('checkbox_' + j).click();
	window.localStorage.toolboxids = id_liste.slice(0, -1);
}
