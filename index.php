<!DOCTYPE html>

<?php
	ini_set('display_errors', 1);
	ini_set('log_errors', 1);
	ini_set('error_log', dirname(__FILE__) . '/error_log.txt');
	error_reporting(E_ALL);

	$tweet=json_decode(file_get_contents("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=greyson_p&include_rts=false&exclude_replies=true&count=10")); // get tweets and decode them into a variable
	echo json_encode($tweet);
	$clientId = "a960821ef0303ef67bb9";
	$clientSecret = "41c7af202079462ba45ff5deae99d7b0f9a04e18";
    $events = curlToJson("https://api.github.com/users/greysonp/events?client_id=$clientId&client_secret=$clientSecret");
    $lastCommit = array("repo" => null, "url" => null, "message" => null, "date" => null);

    foreach ($events as $e)
    {
    	// We only want push events
    	if (strcmp($e->type, "PushEvent") != 0)
    		continue;

    	// If the last date is unset, or the repo we're looking at has a more recent date than our new one
    	// (the dates are formatted as such that a string compare should work to compare the two)
		$lastCommit["repo"] = explode("/", $e->repo->name)[1];
		$lastCommit["url"] = "http://github.com/" . $e->repo->name;
		$lastCommit["message"] = $e->payload->commits[0]->message;
		$lastCommit["date"] = $e->created_at;
		break;
    }

    // echo json_encode($lastCommit);

    function curlToJson($url)
    {
    	$ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36");
	    $data = curl_exec($ch);
	    curl_close($ch);
	    return json_decode($data);
    }
?>

<html>
<head>
	<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css'>
	<link href="css/style.css" rel="stylesheet" />

	<script src="js/jquery.min.js" type="text/javascript"></script>
	<script src="js/prefixfree.min.js" type="text/javascript"></script>

	<script src="js/main.js" type="text/javascript"></script>

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
			<div class="back"><div class="icon grey-dark">
				<p><?php 
					echo 'Repo: <a href="'.$lastCommit["url"].'">'.$lastCommit["repo"].'</a><br />';
					echo '<p class="commit">' . $lastCommit["message"] . '</p>';
				?></p>
			</div></div>
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