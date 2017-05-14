var beautifier = {
	"validJSON": true,
	fnBeautifier(obj, event) {
		if ($(obj).parent().find("textarea").val().trim() != '' && $(obj).parent().find("textarea").val().trim() != undefined && $(obj).parent().find("textarea").val().trim() != null) {
			try {
				var result = jsonlint.parse($(obj).parent().find("textarea").val().trim());
				$(obj).parent().find("textarea").val(JSON.stringify(result, null, 4));
				$(obj).parent().find(".errorArea").css("display", "none");
				this.validJSON = true;
				$(obj).css("background-color", "#00a63f");
			} catch (e) {
				var textAreaPrimaryContent = $(obj).parent().find("textarea").val().trim();
				var parsedContent = this.syntaxHighlight(textAreaPrimaryContent);
				$(obj).parent().find("textarea").val(parsedContent);
				try {
					jsonlint.parse(parsedContent);
				} catch (e) {
					$(obj).parent().find(".errorArea").append('<p><pre>' + e.message + '</pre></p>');
					$(obj).parent().find(".errorArea").css("display", "block");
				}
				this.validJSON = false;
			}
		}
		this.fnContentChange($(obj).parent().find("textarea"), event);
	},
	syntaxHighlight(json) {
		json = json.replace(new RegExp("\n\t", 'g'), "");
		json = json.replace(new RegExp("\n", 'g'), "")
		json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'number';
			var addbr = true;
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
					addbr = false;
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			if (addbr) {
				return match;
			} else {
				return "\n\t" + match;
			}
		});
	},
	fnClear(obj, event) {
		$(obj).parent().find(".errorArea").css("display", "none");
		$(obj).parent().find("textarea").val('');
		this.fnContentChange($(obj).parent().find("textarea"), event);
	},
	fnContentChange(obj, event) {
		if($(obj).val() == ''){
			$(obj).parent().find(".errorArea").css("display", "none");
		}
		var contentLength = this.getLineCount(obj);
		$(obj).parent().find('.linesCount').empty();
		var html = '';
		if (contentLength == 0) {
			html = '<p class="line">1</p>'
		} else {

			for (var len = 1; len <= contentLength; len++) {
				html += '<p class="line">' + len + '</p>';
			}
		}
		$(obj).parent().find('.linesCount').append(html);
		this.fntextAreaScroll(obj, event);
		if (!this.validJSON) {
			$(obj).parent().find(".beautifyBtn").css("background-color", "#0088ee");
		}
		this.validJSON = false;
	},
	getLineCount(obj) {
		return $(obj).val().split(/\r*\n/).length;
	},
	fntextAreaScroll(obj, event) {
		$($(obj).parent().find('.linesCount')).scrollTop($(obj).scrollTop());
	}
};