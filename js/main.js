$(document).ready(function() {
  	$('.panel').click(function() {
  		window.location.href = $(this).data('url');
  	})
});