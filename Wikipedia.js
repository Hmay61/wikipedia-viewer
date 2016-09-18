$(document).ready(function(){

	$('#searchBar').hide();
	$('#result').hide();

	//show the search box
	$("#searchicon").click(function(){
	 	$('#searchicon').hide();
		$('#searchBar').toggle("clip");
		$('#search_input').focus();
		$('.default-view').removeClass('default-view').addClass('result-view');
	});

	//show the title
	$('.btn').tooltip();

	//click the cancle button, it will go back to the first page
	$('#b1').click(function(){
		$('#searchBar').hide();
		$('.result-view').removeClass('result-view').addClass('default-view');
		$('#result').hide();
		$('#searchicon').show();
	 	this.blur();
	});
	
	//search button
	$('#search_btn').click(function(){
		//$('#result').html('');
		if($('#search_input').val()===''){
			$('#result').show();
			$('#result').html('<p style="fontSize:20px;text-align:center;">Please type some word for searching</p>');
			$('#search_input').focus();
		}
		else{
			searchArticle();
			$('#result').show();
			$('#search_input').select();
		}
	});

	//when you press enter,it still can show the result
	$('#search_input').keyup(function(e){
		var key = e.keyCode || e.which;
		if(key===13){
			searchArticle();
			$('#result').show();
			this.select();
			//console.log(wikiUrl);
		}
	}); //end of $('#search_input').keyup

});

//search function
function searchArticle(){
    var article = $('#search_input').val();
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?' +
	               'action=query' +
	               '&format=json' +
	               '&formatversion=2' + //if you want to get json,you should add this, because default is xml
	               '&srsearch=' + encodeURIComponent(article) +
	               '&srinfo=' +
	               '&srlimit=10'+   //How many total pages to return. default:10
	               '&prop=pageimages|extracts|info' +
	               '&pithumbsize=500' + //Maximum thumbnail dimension. default 50;
	               '&pilimit=50' +//Properties of how many pages to return. default 1;
	               '&list=search' +
	               '&generator=search' + //Get the list of pages to work on by executing the specified query module.
	               '&redirects=1' +
	               '&utf8=1' +
	               '&exsentences=2' +
	               '&exlimit=20' +
	               '&exintro=true' +
	               '&inprop=url' +  
	               '&srenablerewrites=1' +
	               '&gsrsearch=' + encodeURIComponent(article) +
	               '&gsrlimit=10';
  //get the json data,the reason why we use jsonp is json can not work
  $.ajax({
    url: wikiUrl,
    dataType: 'jsonp'    
  })
  .done(function (json) {
    //console.log(json.query.pages);  //this is a array with json object
    addResults(json);
  });
}

function addResults(json){
	var logo = "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png";
	//before add the contents, remember to set it to no content first.
	$('#result').html('');
	//add content to page
	$('#result').append('<ul class="media-list">');
	$.each(json.query.pages,function(i,item){
		var title = item.title;
		var thumbnail='';
		if(item.thumbnail){
			thumbnail = item.thumbnail.source;
		}
		else{
			thumbnail=logo;
		}
		var extract = item.extract;		//content
		var article_url =item.fullurl; //wiki url 
		//console.log(item.thumbnail);
		$('#result').append(
	 	'<li class="media">'+
		'<div class="media-left media-middle">'+
		'<img class="media-object" src="'+thumbnail+'" width="100px" height="100px" alt="...">'+
		'</div>'+
		'<div class="media-body">'+
		'<a id="media_a" href="'+article_url+'" target="_blank">'+
		'<h4 class="media-heading">'+title+'</h4>'+
		'<p>'+extract+'</p></a>'+
		'</div></li>'+'<hr>');
	});
	$('#result').append('</ul>');
}
