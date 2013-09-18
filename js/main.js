$(document).ready(function() {
    var colors = ["grey", "red", "green", "yellow"];
    var index = Math.floor(Math.random() * colors.length);
    $('body').addClass(colors[index] + "Theme");
  	$('.panel').click(function() {
  		window.location.href = $(this).data("url");
  	})
});