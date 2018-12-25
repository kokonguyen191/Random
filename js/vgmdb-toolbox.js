// ==UserScript==
// @name         VGMDB Toolbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generate foo friendly data from VGMDB
// @author       koko191
// @match        https://vgmdb.net/album/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    createButtons();
	assignClickFunctions();
})();

/* ACTIONS */

function ClickAction1(zEvent) {
    var rightClone = $("#rightfloat").clone();
    $("#album_infobit_large span[style*='display:none']").remove();
    $(".link_event").remove();
    copyTextToClipboard(getGeneralDataText(getGeneralDataArray()));
    $("#rightfloat").html(rightClone.html());
}

function ClickAction2(zEvent) {
	var tracksClone = $("#tracklist").clone();
	$(".tl[style='display: none']").remove();
	copyTextToClipboard(getTracksDataText(getTracksData()));
	$("#tracklist").html(tracksClone.html());
}

function ClickAction3(zEvent) {
	copyTextToClipboard(getStaffData("composer"));
}

function ClickAction4(zEvent) {
	copyTextToClipboard(getStaffData("arranger"));
}

function ClickAction5(zEvent) {
	copyTextToClipboard(getStaffData("lyricist"));
}

/* Initialization */

function createButtons() {
	var panel = $('<div style="width: 250px; background-color: #1B273D"> <b class="rtop"><b></b></b> <div style="padding: 6px 10px 0px 10px"><h3 style="float: left">Toolbox</h3>  </div> <div style="width: 250px; background-color: #2F364F; clear:both"><div style="padding: 10px 10px 6px 10px">  <div class="covertab" id="cover_gallery"><table border="0" width="100%"><tbody><tr> <td width="50%" align="center" valign="top" colspan="3"> <input id="databtn1" type="button" value="General" style="float: center; width: 100%;">  </td><td width="50%" align="center" valign="top" colspan="3"> <input id="databtn2" type="button" value="Tracks" style="float: center; width: 100%;">  </td></tr> <tr> <td width="33%" align="center" valign="top" colspan="2"> <input id="databtn3" type="button" value="Compose" style="float: center; width: 100%;">  </td><td width="33%" align="center" valign="top" colspan="2"> <input id="databtn4" type="button" value="Arrange" style="float: center; width: 100%;">  </td><td width="33%" align="center" valign="top" colspan="2">   <input id="databtn5" type="button" value="Lyric" style="float: center; width: 100%;"></td></tr></tbody></table> </div>   </div> <b class="rbot"><b></b></b> </div></div><br style="clear: left">');
	$("#rightcolumn").prepend(panel);
}

function assignClickFunctions() {
	$("#databtn1")[0].addEventListener("click", ClickAction1);
    $("#databtn2")[0].addEventListener("click", ClickAction2);
	$("#databtn3")[0].addEventListener("click", ClickAction3);
	$("#databtn4")[0].addEventListener("click", ClickAction4);
	$("#databtn5")[0].addEventListener("click", ClickAction5);
}

/* TextArea manipulation */

function createTextArea() {
	var r = $('<textarea></textarea>');
	$("#innermain > span").append(r);
	var textArea = $('#innermain > span > textarea')[0];
	textArea.style.position = 'absolute';
	textArea.style.left = '-9999px';
}

function removeTextArea() {
	$('#innermain > span > textarea').remove();
}

function copyToTextArea(string) {
	var textArea = $('#innermain > span > textarea')[0];
	textArea.textContent = string;
}

function copyToClipboard() {
	var textArea = $('#innermain > span > textarea')[0];
	textArea.select();
	document.execCommand("Copy");
}

function copyTextToClipboard(string) {
	createTextArea();
    copyToTextArea(string);
    copyToClipboard();
    removeTextArea();
}

/* Data processing */

function getGeneralDataArray() {
	const rows = $("#album_infobit_large > tbody").children();
	var result = {};
	for (var i = 0, len = rows.length; i < len; i++) {
		data = rows[i].textContent.split("\n");
		result[data[0]] = data[1].trim();
	}
	return result;
}

function getTracksData() {
	var discs = $(".tl > table");
	var result = Array();
	for (var i = 0, len = discs.length; i < len; i++) {
		var tracks = discs[i].textContent.split("\n");
		var trimmedTracks = Array();
		for (var j = 0, len2 = tracks.length; j < len2; j++) {
			var trimmedData = tracks[j].trim();
			if (trimmedData !== "") {
				trimmedTracks.push(trimmedData);
			}
		}
		for (var k = 0, totalTracks = trimmedTracks.length; k < totalTracks / 3; k++) {
			result.push(trimmedTracks[k * 3 + 1]);
		}
	}
	return result;
}

function getStaffData(role) {
	var roles = {
		"composer": [
			"music",
			"compo"	// Compo-ser / Compo-sition
		],
		"arranger": [
			"arran"	// Arran-ger / Arran-gement
		],
		"lyricist": [
			"word",
			"lyric"
		]
	};
	var notes = $("body > div:nth-child(5) > table > tbody > tr:nth-child(2) > td > div:nth-child(2) > div")[0];
	var notesString = notes.innerText || notes.textContent;
	var result = Array();
	var line, roleValue;
	for (line of notesString.split("\n")) {
		for (roleValue of roles[role]) {
			if (line.toLowerCase().includes(roleValue)) {
                var splitLine = line.split(":");
                if (splitLine.length > 1) {
                    var names = splitLine[1].split(",");
                    var fixedNames = Array(names.length);
                    for (var i = 0; i < names.length; i++) {
                        fixedNames[i] = names[i].trim().split(" ").reverse().join(" ");
                    }
                    result.push(fixedNames.join("; "));
                    break;
                }
			}
		}
	}
	return result.join("\n");
}

/* String output */

function getGeneralDataText(dataDict) {
	var result = "";
	result += dataDict["Published by"].split("/")[0].trim() + "\n";
	result += $("#innermain > h1 > span:nth-child(1)").text().split("/")[0].trim() + "\n";
    result += dataDict["Release Date"] + "\n";
	result += dataDict["Catalog Number"];
    return result;
}

function getTracksDataText(textList) {
	return textList.join("\n");
}
