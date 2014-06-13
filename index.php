<?php
    // Setup
    session_start();
    require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
    ini_set('error_log', dirname(__FILE__) . '/error_log.txt');
    date_default_timezone_set('UTC');
    error_reporting(E_ALL);

    // Twitter
    $twitteruser = "greyson_p";
    $notweets = 1;
    $consumerkey = getenv("TWITTER_CONSUMER");
    $consumersecret = getenv("TWITTER_CONSUMER_SECRET");
    $accesstoken = getenv("TWITTER_TOKEN");
    $accesstokensecret = getenv("TWITTER_TOKEN_SECRET");

    function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
        $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
        return $connection;
    }
 
    $connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
    $tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=$twitteruser&count=$notweets&include_rts=false&exclude_replies=true");

    // Github
    $clientId = getenv("GIT_ID");;
    $clientSecret = getenv("GIT_SECRET");
    $events = curlToJson("https://api.github.com/users/greysonp/events?client_id=$clientId&client_secret=$clientSecret");
    $lastCommit = array("repo" => null, "url" => null, "message" => null, "date" => null);

    foreach ($events as $e) {
        // We only want push events
        if (strcmp($e->type, "PushEvent") != 0)
            continue;

        // If the last date is unset, or the repo we're looking at has a more recent date than our new one
        // (the dates are formatted as such that a string compare should work to compare the two)
        $exploded = explode("/", $e->repo->name);
        $lastCommit["repo"] = $exploded[1];
        $lastCommit["url"] = "http://github.com/" . $e->repo->name;
        $lastCommit["message"] = $e->payload->commits[0]->message;
        $lastCommit["date"] = $e->created_at;
        break;
    }

    function curlToJson($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36");
        $data = curl_exec($ch);
        curl_close($ch);
        return json_decode($data);
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <link href='http://fonts.googleapis.com/css?family=Raleway:400,700' rel='stylesheet' type='text/css'>
        <link href="css/style.css" rel="stylesheet" />

        <script src="js/jquery.min.js" type="text/javascript"></script>
        <script src="js/prefixfree.min.js" type="text/javascript"></script>

        <script src="js/main.js" type="text/javascript"></script>

    </head>
    <body>
        <div class="content">
            <h1 class="text-center">
                <div>Greyson Parrelli</span>
                <div class="sub-heading">Programmer and 
                    <div class="fact-window" id="js-fact-window">
                        <ul class="fact-block" id="js-fact-block">
                            <li class="fact" id="js-fact0">Hackathon Fanatic</li>
                            <li class="fact" id="js-fact1">Pun-Lover</li>
                        </ul>
                    </div>
                </div>
                <span class="sub-link">[<a href="greyson-parrelli-resume.pdf">R&eacute;sum&eacute;</a>]</span>
            </h1>

            <h2 class="push-down">Presence</h2>
            <div class="presence">

                <!-- Twitter -->
                <div class="panel" data-url="http://twitter.com/greyson_p">
                    <div class="contents">
                        <div class="half"><div class="icon blue"><img src="img/icons/twitter.png" /></div></div>
                        <div class="half"><div class="icon blue-dark">
                            <div><?php echo $tweets[0]->text; ?></div>
                        </div></div>
                    </div>
                </div>

                <!-- Github -->
                <div class="panel" data-url="http://github.com/greysonp">
                    <div class="contents">
                        <div class="half"><div class="icon grey"><img src="img/icons/github.png" /></div></div>
                        <div class="half"><div class="icon grey-dark">
                            <div><?php 
                                echo "<h1>[<a href='{$lastCommit['url']}'>{$lastCommit['repo']}</a>]</h1>";
                                echo "<p>{$lastCommit['message']}</p>";
                            ?></div>
                        </div></div>
                    </div>
                </div>

                <!-- LinkedIn -->
                <div class="panel" data-url="http://www.linkedin.com/pub/greyson-parrelli/2b/997/887/">
                    <div class="contents">

                        <div class="half"><div class="icon navy"><img src="img/icons/linkedin.png" /></div></div>
                        <div class="half"><div class="icon navy-dark">
                            <div>
                                I do my best to keep it up to date.
                            </div>
                        </div></div>
                    </div>
                </div>
            </div>

            <h2>News</h2>
            
            <h3>Technically Philly - Resizeasaurus [<a href="https://technical.ly/philly/2013/09/10/pennapps-fall-2013-our-favorites/">Link</a>]</h3>
            <h4 class="date">September 10, 2013</h4>
            <p>It looks like at least a few of the judges at PennApps appreciated Resizeasaurus, a goofy Chrome extension that turns yoru browser into a dinosaur.</p>

            <h3>Lehigh - Hackathons [<a href="http://www.lehigh.edu/engineering/news/student/stdt_20130425_student_hackers.html">Link</a>]</h3>
            <h4 class="date">May 28, 2013</h4>
            <p>
                Lehigh University does a write-up on our success in our last few hackathons, with details about the projects we made at each.
                Lehigh also wrote another (similar) article, featured [<a href="http://www4.lehigh.edu/news/newsarticle.aspx?Channel=%2fChannels%2fNews+2013&WorkflowItemID=3c30561f-436f-4d37-8729-cd4b32b8a469">here</a>].
            </p>

            <h3>TechCrunch - Tamagetitdone [<a href="http://techcrunch.com/2013/04/07/students-tackle-road-trips-online-distraction-and-more-at-hackprinceton/">Link</a>]</h3>
            <h4 class="date">April 7, 2013</h4>
            <p>TechCrunch writes an article featuring our HackPrinceton Spring 2013 hackathon project, Tamagetitdone.</p>

            <h3>TechCrunch - SparkTab [<a href="http://techcrunch.com/2013/01/21/pennapps-2013-hackathon-runner-up-sparktab-could-be-your-new-browser-start-page/">Link</a>]</h3>
            <h4 class="date">January 21, 2013</h4>
            <p>TechCrunch writes an article about our PennApps Spring 2013 hackathon project, SparkTab.</p>

        </div>
    </body>
</html>