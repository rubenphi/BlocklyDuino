/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Helper functions for buttons visible in UI.
 * @author scanet@libreduc.cc (SebCanet)
 */

/*
 * auto save and restore blocks
 */
function auto_save_and_restore_blocks() {
    // Store the blocks for the duration of the reload.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (window.sessionStorage) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        var text = Blockly.Xml.domToText(xml);
        window.sessionStorage.loadOnceBlocks = text;
    }
}
;

var fullScreen_ = false;

/**
 * Full screen, thanks to HTML5 API
 * @argument {type} _element 
 */
function fullScreen(_element) {
    var elementClicked = _element || document.documentElement;
    // HTML5
    if (document.fullscreenEnabled) {
        if (!document.fullscreenElement) {
            elementClicked.requestFullscreen();
            document.addEventListener('fullscreenchange', exitFullScreen, false);
        } else {
            exitFullScreen();
            document.exitFullscreen();
            document.removeEventListener('fullscreenchange', exitFullScreen, false);
        }
    } else
    // Chrome, Safari and Opera
    if (document.webkitFullscreenEnabled) {
        if (!document.webkitFullscreenElement) {
            elementClicked.webkitRequestFullscreen();
            document.addEventListener('webkitfullscreenchange', exitFullScreen, false);
        } else {
            exitFullScreen();
            document.webkitExitFullscreen();
            document.removeEventListener('webkitfullscreenchange', exitFullScreen, false);
        }
    } else
    // IE/Edge
    if (document.msFullscreenEnabled) {
        if (!document.msFullscreenElement) {
            elementClicked.msRequestFullscreen();
            document.addEventListener('MSFullscreenChange', exitFullScreen, false);
        } else {
            exitFullScreen();
            document.msExitFullscreen();
            document.removeEventListener('MSFullscreenChange', exitFullScreen, false);
        }
    }
}
;

function exitFullScreen() {
    if (fullScreen_ === false) {
        fullScreenButton.className = 'iconButtonsClicked';
        fullScreen_ = true;
    } else {
        fullScreenButton.className = 'iconButtons';
        fullScreen_ = false;
    }
}
;

/**
 * Copy code from div code_peek in clipboard system
 */
Code.copyToClipboard = function () {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementsByClassName("ace_content")[0]);
        range.select();
        document.execCommand("copy");
    } else if (window.getSelection) {
        // var range = document.createRange();
        // range.selectNode(document.getElementsByClassName("ace_content")[0]);
        // window.getSelection().removeAllRanges();
        // window.getSelection().addRange(range);
    // }
    // document.execCommand("copy");
        navigator.clipboard.writeText(document.getElementsByClassName("ace_content")[0].innerText)
                .then(() => {console.log('Code copied!') })
                .catch((error) => { console.log('Copy failed! ${error}') });
    }
};

/**
 * modal controllers
 */
Code.boardsListModalShow = function () {
    document.getElementById('overlayForModals').style.display = "block";
    document.getElementById('boardListModal').classList.add('show');
    for (var i = 0; i < document.getElementById("boardDescriptionSelector").length; i++)
        document.getElementById("boardDescriptionSelector").options[i].style.backgroundColor = 'white';
    var boardValue = document.getElementById("boardMenu").value;
    if (boardValue !== 'none') {
        var selector = document.getElementById("boardDescriptionSelector");
        for (var i = 0; i < selector.options.length; i++) {
            if (selector.options[i].value === boardValue) {
                selector.selectedIndex = i;
                selector.options[i].style.backgroundColor = 'yellow';
                break;
            }
        }
    }
    window.addEventListener('click', Code.boardsListModalHide, 'once');
    Code.boardDescription();
};
Code.portsListModalShow = function () {
    document.getElementById('overlayForModals').style.display = "block";
    document.getElementById('portListModal').classList.add('show');
    WebUSB.updateUI();
    window.addEventListener('click', Code.portsListModalHide, 'once');
};
document.getElementById("closeModalBoards").onclick = function () {
    document.getElementById('overlayForModals').style.display = "none";
    document.getElementById('boardListModal').classList.remove('show');
};
document.getElementById("closeModalPorts").onclick = function () {
    document.getElementById('overlayForModals').style.display = "none";
    document.getElementById('portListModal').classList.remove('show');
};
// When the user clicks anywhere outside of the modal, close it
Code.boardsListModalHide = function (event) {
    if (!document.getElementById('boardListModal').contains(event.target)) {
        document.getElementById('overlayForModals').style.display = "none";
        document.getElementById('boardListModal').classList.remove('show');
    }
};
Code.portsListModalHide = function (event) {
    if (!document.getElementById('portListModal').contains(event.target)) {
        document.getElementById('overlayForModals').style.display = "none";
        document.getElementById('portListModal').classList.remove('show');
    }
};

/**
 * change information in the boards modal
 **/
Code.boardDescription = function () {
    var boardValue = document.getElementById("boardDescriptionSelector").value;
    if (boardValue === '')
        boardValue = 'none';
    document.getElementById("board_mini_picture").setAttribute("src", profile[boardValue][0]['picture']);
    document.getElementById("boardModal_connect").textContent = profile[boardValue][0]['usb'] || '';
    document.getElementById("boardModal_cpu").textContent = profile[boardValue][0]['cpu'] || '';
    document.getElementById("boardModal_voltage").textContent = profile[boardValue][0]['voltage'] || '';
    document.getElementById("boardModal_inout").textContent = profile[boardValue][0]['inout'] || '';
};

/**
 * Undo/redo functions
 */
Code.Undo = function () {
    Blockly.getMainWorkspace().undo(0);
};
Code.Redo = function () {
    Blockly.getMainWorkspace().undo(1);
};

/**
 * Luanch blockFatcory with language argument
 */
Code.BlockFactory = function () {
    var lang = Code.getStringParamFromUrl('lang', '');
    if (!lang) {
        lang = "en";
    }
    parent.open('tools/blockFactory/blockFactory.html?lang=' + lang);
};

/**
 * Creates an INO file containing the Arduino code from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Code.newProject = function () {
    var count = Code.workspace.getAllBlocks().length;
    if (count > 0) {
        Blockly.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count), function (confirm) {
            if (confirm) {
                Code.workspace.clear();
                var defaultXml = '<xml><block type="board_setup" x="20" y="20"><statement name="SETUP_BODY"></statement></block><block type="board_loop" x="20" y="120"><statement name="LOOP_BODY"></statement></block></xml>';
                var xml = Blockly.Xml.textToDom(defaultXml);
                Blockly.Xml.domToWorkspace(xml, Code.workspace);
            }
            return true;
        });
    } else {
        var defaultXml = '<xml><block type="board_setup" x="20" y="20"><statement name="SETUP_BODY"></statement></block><block type="board_loop" x="20" y="120"><statement name="LOOP_BODY"></statement></block></xml>';
        var xml = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
    }
};

/**
 * Creates an INO file containing the Arduino code from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Code.saveCodeFile = function () {
    console.log('saveCodeFile: INICIO');
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
    var baseName = 'bloque_' + utc;
    try {
        var dataToSave = Blockly.Arduino.workspaceToCode(Code.workspace);
    } catch (error) {
        console.error('saveCodeFile: error generando codigo', error);
        alert('Error generando el codigo: ' + error.message);
        return;
    }
    Code.downloadFile(dataToSave, baseName + '.ino', 'text/plain;charset=utf-8');
};



/**
  * Creats an INO file containing the Arduino code from the Blockly workspace
  * and posts it to http://127.0.0.1/verify/ which will pass it to the 
  * Arduino IDE with the --verify flag.
  */

/**
  * Compile .ino code via WebSocket server.
  */
Code.verifyCodeFile = function () {
    var code = Blockly.Arduino.workspaceToCode(Code.workspace);
    var fqbn = profile["default"].upload_arg;

    console.log('=== CODIGO GENERADO ===');
    console.log(code);
    console.log('=== FIN CODIGO ===');

    if (typeof Compiler === 'undefined') {
        alert('Modulo de compilacion no disponible.\nEjecuta servidor_compilacion.py en el PC del profesor.');
        return;
    }

    if (fqbn === 'none' || fqbn === '') {
        alert('Selecciona una placa antes de compilar.');
        return;
    }

    Compiler.updateStatus('Compilando...');
    Compiler.compile(code, fqbn, document.getElementById("detailedCompilation").checked)
        .then(function (result) {
            Compiler.updateStatus('Compilacion exitosa');
            alert('Compilacion exitosa.');
        })
        .catch(function (err) {
            Compiler.updateStatus('Error: ' + err.message);
            alert('Error compilando: ' + err.message);
        });
};

/**
  * Compile and flash via WebUSB.
  */
Code.uploadCodeFile = function () {
    var code = Blockly.Arduino.workspaceToCode(Code.workspace);
    var fqbn = profile["default"].upload_arg;

    console.log('=== CODIGO GENERADO (upload) ===');
    console.log(code);
    console.log('=== FIN CODIGO ===');

    if (typeof Compiler === 'undefined') {
        alert('Modulo de compilacion no disponible.\nEjecuta servidor_compilacion.py en el PC del profesor.');
        return;
    }

    if (fqbn === 'none' || fqbn === '') {
        alert('Selecciona una placa antes de subir el programa (por ejemplo ESP32 DevKit).');
        return;
    }

    if (typeof WebUSB === 'undefined' || !WebUSB.isConnected) {
        alert('No hay dispositivo conectado.\nHaz clic en el boton USB para conectar.');
        return;
    }

    var isESP32 = fqbn.indexOf('esp32') !== -1;

    Compiler.updateStatus('Compilando...');
    Compiler.compile(code, fqbn, document.getElementById("detailedCompilation").checked)
        .then(function (result) {
            if (isESP32) {
                return Compiler.flashESP32(result.binary_hex);
            } else {
                return Compiler.flashAVR(result.binary_hex);
            }
        })
        .then(function () {
            Compiler.updateStatus('Flasheo completado');
            alert('Programa subido exitosamente.');
        })
        .catch(function (err) {
            Compiler.updateStatus('Error: ' + err.message);
            alert('Error: ' + err.message);
        });
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Code.saveXmlBlocklyFile = function () {
    console.log('saveXmlBlocklyFile: INICIO');
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
    var baseName = 'proyecto_' + utc;
    try {
        var xmlData = Blockly.Xml.workspaceToDom(Code.workspace);
        var dataToSave = Blockly.Xml.domToPrettyText(xmlData);
    } catch (error) {
        console.error('saveXmlBlocklyFile: error serializando bloques', error);
        alert('Error guardando el proyecto: ' + error.message);
        return;
    }
    Code.downloadFile(dataToSave, baseName + '.bduino', 'text/xml;charset=utf-8');
};

/**
 * Descarga un texto como archivo de forma robusta (no depende de dialogo ni de
 * window.URL, evitando que los navegadores bloqueen la descarga sintetica).
 */
Code.downloadFile = function (content, fileName, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }, 0);
};

/**
 * Load blocks from local file.
 */
Code.loadXmlBlocklyFile = function () {
    console.log('loadXmlBlocklyFile: INICIO');
    // Create event listener function
    var parseInputXMLfile = function (e) {
        var files = e.target.files;
        var reader = new FileReader();
        reader.onloadend = function () {
            var success = false;
            if (reader.result != null) {
                Code.loadBlocksfromXml(reader.result);
                success = true;
            }
            if (success) {
                Code.workspace.render();
            } else {
                Blockly.alert(MSG['badXml'], callback);
            }
        };
        reader.readAsText(files[0]);
    };
    // Create once invisible browse button with event listener, and click it
    var selectFile = document.getElementById('select_file');
    if (selectFile === null) {
        var selectFileDom = document.createElement('INPUT');
        selectFileDom.type = 'file';
        selectFileDom.id = 'select_file';
        selectFileDom.accept = '.bduino, .xml';
        selectFileDom.style.display = 'none';
        document.body.appendChild(selectFileDom);
        selectFile = document.getElementById('select_file');
        selectFile.addEventListener('change', parseInputXMLfile, false);
    }

    selectFile.onclick = function destroyClickedElement(event) {
        document.body.removeChild(event.target);
    };

    selectFile.click();
};

/**
 * Parses the XML from its input to generate and replace the blocks in the
 * Blockly workspace.
 * @param {!string} defaultXml String of XML code for the blocks.
 * @return {!boolean} Indicates if the XML into blocks parse was successful.
 */
Code.loadBlocksfromXml = function (defaultXml) {
    var count = Code.workspace.getAllBlocks().length;
    var xml = Blockly.Xml.textToDom(defaultXml);
    if (count > 0) {
        Blockly.confirm(MSG['loadXML_span'], function (confirm) {
            if (confirm) {
                Code.workspace.clear();
                Blockly.Xml.domToWorkspace(xml, Code.workspace);
                Code.renderContent();
                Code.autosaveBlocks();
            }
        });
    } else {
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
        Code.renderContent();
        Code.autosaveBlocks();
    }
};

/**
 * Add or replace a parameter to the URL.
 *
 * @param {string} name The name of the parameter.
 * @param {string} value Value to set
 * @return {string} The url completed with parameter and value
 */
Code.addReplaceParamToUrl = function (url, param, value) {
    var re = new RegExp("([?&])" + param + "=.*?(&|$)", "i");
    var separator = url.indexOf('?') !== -1 ? "&" : "?";
    if (url.match(re)) {
        return url.replace(re, '$1' + param + "=" + value + '$2');
    } else {
        return url + separator + param + "=" + value;
    }
};

/**
 * Reset workspace and parameters
 */
Code.ResetWorkspace = function () {
    var count = Blockly.mainWorkspace.getAllBlocks(false).length;
    Blockly.confirm(MSG['resetQuestion_span'] + ' ' + Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count), function (answer) {
        if (answer) {
            Blockly.Events.disable();
            Blockly.getMainWorkspace().clear();
            Blockly.getMainWorkspace().trashcan.contents_ = [];
            Blockly.getMainWorkspace().trashcan.setLidOpen('false');
            window.removeEventListener('unload', auto_save_and_restore_blocks, false);
            localStorage.clear();
            sessionStorage.clear();
            Code.renderContent();
            Blockly.Events.enable();
            if (window.location.hash) {
                window.location.hash = '';
            }
            window.location = window.location.protocol + '//' + window.location.host + window.location.pathname;
        }
    });
};

/**
 * Change font size in blocks in all workspace
 */
Code.changeRenderingConstant = function (value) {
    var type = document.getElementById('rendering-constant-selector').value;
    switch (type) {
        case 'fontSizeBlocks':
            var fontStyle = {
                'size': value
            };
            Blockly.getMainWorkspace().getTheme().setFontStyle(fontStyle);
            editor.setOptions({
                fontSize: value + "pt"
            });
        case 'fontSizePage':
        // fontSizePageModify('access', value);
        case 'fontSpacingPage':
        // document.body.style.fontSize = value + 'px';
    }
    // Refresh theme.
    Blockly.getMainWorkspace().setTheme(Blockly.getMainWorkspace().getTheme());
};


/**
 * Hide/show the help modal.
 * @param {boolean} state The state of the checkbox. True if checked, false
 *     otherwise.
 */
var HelpModalDisplay_ = false;

function toggleDisplayHelpModal() {
    if (!HelpModalDisplay_) {
        document.getElementById('helpModal').style.display = 'block';
    	document.getElementById('helpModal').classList.add('show');
        document.getElementById('helpModal').style.left = (top.innerWidth - document.getElementById('helpModal').offsetWidth) / 2 + "px";
        document.getElementById('helpModal').style.top = (top.innerHeight - document.getElementById('helpModal').offsetHeight) / 2 + "px";
        helpButton.className = 'iconButtonsClicked';
    } else {
        document.getElementById('helpModal').style.display = 'none';
    	document.getElementById('helpModal').classList.remove('show');
        helpButton.className = 'iconButtons';
    }
    HelpModalDisplay_ = !HelpModalDisplay_;
}