/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Helper functions for selecting and changing boards.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Boards');

//set default profile
profile.default = profile["none"][0];

/**
 * Set board when click in board modal
 */
Code.setBoard = function () {
    var boardId = Code.getStringParamFromUrl('board', '');
    if (!boardId) {
        boardId = "none";
    }
    document.getElementById('boardMenu').value = boardId;
    profile.default = profile[boardId][0];
	// change tooltip & info when a board is selected
	if (boardId != "none") {
		document.getElementById('boardButton').classList.add('active');
		document.getElementById('boardButton').title = profile["default"].description;
		document.getElementById('boardButton').onmouseover = function () {
			document.getElementById("content_hoverButton").textContent = profile["default"].description;
		};
		document.getElementById('boardButton').onmouseout = function () {
			document.getElementById("content_hoverButton").textContent = "";
		};
	}
		else {
			document.getElementById('boardButton').classList.remove('active');
			document.getElementById('boardButton').title = MSG['boardButtonSpan'];
			document.getElementById('boardButton').onmouseover = function () {
				document.getElementById("content_hoverButton").textContent = MSG['boardButtonSpan'];
			};
			document.getElementById('boardButton').onmouseout = function () {
				document.getElementById("content_hoverButton").textContent = "";
			};
		}
};

/**
 * Set board throught URL
 */
Code.changeBoard = function ()  {
    var boardMenu = document.getElementById('boardDescriptionSelector');
    var newBoard = boardMenu.value;
    var search = window.location.search;
    if (search.length <= 1) {
        search = '?board=' + newBoard;
    } else if (search.match(/[?&]board=[^&]*/)) {
        search = search.replace(/([?&]board=)[^&]*/, '$1' + newBoard);
    } else {
        search = search.replace(/\?/, '?board=' + newBoard + '&');
    }
    profile["default"] = profile[newBoard][0];
	document.getElementById('boardMenu').value = newBoard;
	document.getElementById("boardSelected_span").textContent = profile["default"].description;
	document.getElementById("portSelected_span").textContent = WebUSB.isConnected ? ' : Conectado' : '';
	window.history.pushState({}, "blocklyduino", window.location.origin + window.location.pathname + search);
	// close modal first
	document.getElementById('overlayForModals').style.display = "none";
	document.getElementById('boardListModal').classList.remove('show');
	Code.setBoard();
	Code.buildToolbox();
	var xml = Blockly.Xml.workspaceToDom(Code.workspace);
	Blockly.Xml.domToWorkspace(xml, Code.workspace);
};

/**
 * Set COM port via WebUSB
 */
Code.setPort = function ()  {
	if (WebUSB.isConnected) {
		document.getElementById("portSelected_span").textContent = ' : Conectado';
	} else {
		WebUSB.connect();
	}
	document.getElementById('overlayForModals').style.display = "none";
	document.getElementById('portListModal').classList.remove('show');
	if (newPort != 'none') {
		document.getElementById('serialButton').classList.add('active');
		document.getElementById('serialButton').title = newPort;
		document.getElementById('serialButton').onmouseover = function () {
			document.getElementById("content_hoverButton").textContent = newPort;
		};
		document.getElementById('serialButton').onmouseout = function () {
			document.getElementById("content_hoverButton").textContent = "";
		}
	}
		else {
			document.getElementById('serialButton').classList.remove('active');
			document.getElementById('serialButton').title = MSG['serialButtonSpan'];
			document.getElementById('serialButton').onmouseover = function () {
				document.getElementById("content_hoverButton").textContent = MSG['serialButtonSpan'];
			};
			document.getElementById('serialButton').onmouseout = function () {
				document.getElementById("content_hoverButton").textContent = "";
			};
		}
}
;