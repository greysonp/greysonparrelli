<!DOCTYPE html>

<html>
<head>
	<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css'>
	<link href="css/style.css" rel="stylesheet" />

	<script src="js/jquery.min.js" type="text/javascript"></script>
	<script src="js/prefixfree.min.js" type="text/javascript"></script>


	<script type="text/javascript">
        $(document).ready(function(){
           // set up hover panels
           // although this can be done without JavaScript, we've attached these events
          // because it causes the hover to be triggered when the element is tapped on a touch device
        $('.hover').hover(function(){
            $(this).addClass('flip');
        },function(){
            $(this).removeClass('flip');
        });
    });
 </script>

</head>
<body>

<div id="header"><h1 class="text-center">GREYSON PARRELLI</h1></div>

<h2 class="push-down">PRESENCE</h2>
<div id="presence">

		<!-- Twitter -->
		<div class="panel hover">
			<div class="front"><div class="icon blue"><img src="img/icons/twitter.png" /></div></div>
			<div class="back"><div class="icon navy"><p>Follow @greyson_p</p></div></div>
		</div>

		<!-- Github -->
		<div class="panel hover">
			<div class="front"><div class="icon grey"><img src="img/icons/github.png" /></div></div>
			<div class="back"><div class="icon navy"><p>Follow @greyson_p</p></div></div>
		</div>

		<!-- LinkedIn -->
		<div class="panel hover">
			<div class="front"><div class="icon navy"><img src="img/icons/linkedin.png" /></div></div>
			<div class="back"><div class="icon navy"><p>Follow @greyson_p</p></div></div>
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