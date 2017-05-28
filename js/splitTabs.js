$(document).ready(function(){
   $("input[name='diff_type']").click(function(){
    splitTabs.fnCompare();
   });
});
var splitTabs = {
  'result' : document.getElementById('diffDisplay'),
  fnCompare(){
  	var a = $("#firstSplit").val();
  	var b = $("#secondSplit").val();
  	var diff = JsDiff[$("input[name='diff_type']:checked").val()](a, b);
  	var fragment = document.createDocumentFragment();
		for (var i=0; i < diff.length; i++) {

			if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
				var swap = diff[i];
				diff[i] = diff[i + 1];
				diff[i + 1] = swap;
			}

			var node;
			if (diff[i].removed) {
				node = document.createElement('del');
				node.appendChild(document.createTextNode(diff[i].value));
			} else if (diff[i].added) {
				node = document.createElement('ins');
				node.appendChild(document.createTextNode(diff[i].value));
			} else {
				node = document.createTextNode(diff[i].value);
			}
			fragment.appendChild(node);
		}
        this.result.style.display = 'inline-block';
        $(".splitTextArea").removeClass('width50').addClass("width30");
		//$($(this.result).html()).not('button').remove();
		this.result.textContent = '';
		this.result.appendChild(fragment);
  }
};