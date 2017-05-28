let tabslength = 0;
let totalTabs = 0;
var FileMap = new Map();
const ele = require('electron');
/*inter process communication methods*/
ele.ipcRenderer.on('openFile',(event,message,filePath) =>{
	fnAddNewTab();
	$("#tabContent_"+tabslength).find("textarea").val(message);
	$("#tabContent_"+tabslength).find("textarea").trigger('onchange');
	FileMap.set(tabslength,filePath);
});
ele.ipcRenderer.on('getCurrentTabDetails',(event,message) =>{
	var currentTab = $(".active").attr('data-tab');
	if(FileMap.get(parseInt(currentTab,10)) !== undefined){
		var fileObj = {
		"fileName" : FileMap.get(parseInt(currentTab,10)),
		"fileContent" : $("#tabContent_"+currentTab).find("textarea").val()
	};
	if(message == 'save'){
		ele.ipcRenderer.send('saveFile',fileObj);
	}else if(message == 'saveAs'){
		ele.ipcRenderer.send('saveAsFile',$("#tabContent_"+currentTab).find("textarea").val());
	}
}else{
       ele.ipcRenderer.send('saveAsFile',$("#tabContent_"+currentTab).find("textarea").val());
}
});
ele.ipcRenderer.on('NewTab',(event,message) =>{
	fnAddNewTab();
});
ele.ipcRenderer.on('CloseTab',(event,message) =>{
	$($(".active").find('button')[0]).trigger('click');
});
ele.ipcRenderer.on('CloseAllTab',(event,message) =>{
	tabslength = 0;
	totalTabs = 0;
	FileMap = new Map();
	$('body').find('.tab').remove();
	$('body').find('.data').remove();
	var html='<div class="tab"><div class="tabElm active" id="tab_0" data-tab="0" onclick="fnMakeCurrentTab(this,event)"><p>New Tab</p><button class="" onclick="fnRemoveTab(this,event)">x</button></div><div class="tabElm" id="addBtnTab" onclick="fnAddNewTab()"><p></p><button class="addBtn">+</button></div></div><div class="data"><section id="tabContent_0" class="tabContentVisible"><div class="linesCount"><p class="line">1</p></div><textarea class="primaryTextArea" id="primaryTextArea" onkeyup="beautifier.fnContentChange(this,event)" onchange="beautifier.fnContentChange(this,event)" onscroll="beautifier.fntextAreaScroll(this,event)"></textarea><button onclick="beautifier.fnBeautifier(this,event)" class="beautifyBtn">Validate</button><button onclick="beautifier.fnClear(this,event)" class="clearBtn">Clear</button><div class="errorArea"><h4>Error</h4></div></section></div>'
	$('body').append(html);
});
ele.ipcRenderer.on('spiltTabs',(event,message) =>{
	// confirm("Do you Really want to continue?\n Please make sure you have saved the current work.");
	$(".split").toggleClass("dispnone");
	$(".regular").toggleClass("dispnone");
});
/*inter process communication methods*/
/*common methods*/
fnAddNewTab = function () {
	tabslength++;
	if (totalTabs >= 10) {
		$("#addBtnTab").css("display", "none");
		ele.ipcRenderer.send('disableMenu','NewTab');
	}
	var currentTabs = $(".tab").find(".tabElm").length;
	var html = '<div class="tabElm" id="tab_' + tabslength + '" data-tab="' + tabslength + '" onclick="fnMakeCurrentTab(this,event)"><p>New Tab</p><button class="" onclick="fnRemoveTab(this,event)">x</button></div>';
	if (currentTabs == 1) {
		$($(".tab").find(".tabElm")[0]).before(html);
	} else {
		$($(".tab").find(".tabElm")[currentTabs - 2]).after(html);
	}
	var tabContent = '<section id="tabContent_' + tabslength + '" data-tab="' + tabslength + '" class="tabcontent"><div class="linesCount"><p class="line">1</p></div><textarea class="primaryTextArea" id="" onkeyup="beautifier.fnContentChange(this,event)" onchange="beautifier.fnContentChange(this,event)" onscroll="beautifier.fntextAreaScroll(this,event)"></textarea><button onclick="beautifier.fnBeautifier(this,event)" class="beautifyBtn">Validate</button><button onclick="beautifier.fnClear(this,event)" class="clearBtn">Clear</button><div class="errorArea"><h4>Error</h4></div></section>';
	$(".data").append(tabContent);
	$("#tab_" + tabslength).trigger('click');
	totalTabs++;
};
fnRemoveTab = function (obj, event) {
	var currentTabs = $(".tab").find(".tabElm").length;
	var index = $(obj).parent().index();
	if ($(obj).parent().hasClass('active')) {
		if (index > 0) {
			var contentToRemove = $(obj).parent().attr('data-tab');
	        $("#tabContent_" + contentToRemove).remove();
			$(obj).parent().remove();
			$($(".tab").find(".tabElm")[index - 1]).trigger('click');
		} else if (index == 0 && currentTabs > 2) {
			var contentToRemove = $(obj).parent().attr('data-tab');
	        $("#tabContent_" + contentToRemove).remove();
			$(obj).parent().remove();
			$($(".tab").find(".tabElm")[0]).trigger('click');
		} else if (index == 0 && currentTabs == 2) {
			fnAddNewTab();
			var contentToRemove = $(obj).parent().attr('data-tab');
	        $("#tabContent_" + contentToRemove).remove();
			$(obj).parent().remove();
			$($(".tab").find(".tabElm")[0]).trigger('click');
		}
	} else {
		if (currentTabs == 2) {
			fnAddNewTab();
			$(obj).parent().remove();
			$($(".tab").find(".tabElm")[0]).trigger('click');
		} else {
			var contentToRemove = $(obj).parent().attr('data-tab');
	        $("#tabContent_" + contentToRemove).remove();
			$(obj).parent().remove();
		}
	}
	totalTabs--;
	$("#addBtnTab").css("display", "block");
	ele.ipcRenderer.send('enableMenu','NewTab');
	event.stopPropagation();
};
fnMakeCurrentTab = function (obj, event) {
	debugger;
	var contentToShow = $(obj).attr('data-tab');
	if(document.getElementById($(obj).attr('id')) === null) return;
	$(".active").removeClass("active");
	$(obj).addClass("active");
	$(".tabContentVisible").addClass("tabcontent").removeClass("tabContentVisible");
	$("#tabContent_" + contentToShow).removeClass("tabcontent").addClass("tabContentVisible");
	event.stopPropagation();
};