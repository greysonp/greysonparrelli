<!DOCTYPE html>

<?php
	$tweet=json_decode(file_get_contents("https://api.twitter.com/1/statuses/user_timeline.json?screen_name=greyson_p&exclude_replies=true")); // get tweets and decode them into a variable

	 // show latest tweet
?>

<html>
<head>
	<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css'>
	<link href="css/style.css" rel="stylesheet" />

	<script src="js/jquery.min.js" type="text/javascript"></script>
	<script src="js/prefixfree.min.js" type="text/javascript"></script>


	<script type="text/javascript">
        $(document).ready(function()
        {
           // set up hover panels
           // although this can be done without JavaScript, we've attached these events
          // because it causes the hover to be triggered when the element is tapped on a touch device
	        $('.hover').hover(function()
	        {
	            $(this).addClass('flip');
	        },
	        function()
	        {
	            $(this).removeClass('flip');
        	});

        	$('.panel').click(function()
        	{
        		window.location.href = $(this).data('url');
        	})
    	});
 </script>

</head>
<body>

<div id="header"><h1 class="text-center">GREYSON PARRELLI</h1></div>

<h2 class="push-down">PRESENCE</h2>
<div id="presence">

		<!-- Twitter -->
		<div class="panel hover" data-url="http://twitter.com/greyson_p">
			<div class="front"><div class="icon blue"><img src="img/icons/twitter.png" /></div></div>
			<div class="back"><div class="icon blue-dark">
				<p><?php echo $tweet[0]->text; ?></p>
				<p>Follow <a href="https://twitter.com/greyson_p">@greyson_p</a></p>
			</div></div>
		</div>

		<!-- Github -->
		<div class="panel hover" data-url="http://github.com/greysonp">
			<div class="front"><div class="icon grey"><img src="img/icons/github.png" /></div></div>
			<div class="back"><div class="icon grey-dark"><p>Follow @greyson_p</p></div></div>
		</div>

		<!-- LinkedIn -->
		<div class="panel hover" data-url="http://www.linkedin.com/pub/greyson-parrelli/2b/997/887/">
			<div class="front"><div class="icon navy"><img src="img/icons/linkedin.png" /></div></div>
			<div class="back"><div class="icon navy-dark"><p>Follow @greyson_p</p></div></div>
		</div>


</div>

<h2>PROJECTS</h2>
<div class="project">
	<img src="img/projects/sparktab.png" />
	<p>This is some text about SparkTab.</p>
</div>

<div class="project">
	<img src="img/projects/tamagetitdone.png" />
	<p>This is some text about Tamagetitdone.</p>
</div>

<div class="project">
	<img src="img/projects/webstagram.png" />
	<p>This is some text about Webstagram.</p>
</div>


<h2>NEWS</h2>
<h3>Lehigh University</h3>
<p>Lehigh writes up a summary of our hackathon adventures.</p>

</body>
</html>