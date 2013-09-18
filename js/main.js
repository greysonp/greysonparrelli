$(document).ready(function() {
    // Pick a random color theme
    var colors = ["grey", "red", "green", "yellow"];
    var index = Math.floor(Math.random() * colors.length);
    $('body').addClass(colors[index] + "Theme");

    // Add our click events to all of our panels
    $('.panel').click(function() {
        window.location.href = $(this).data("url");
    });

    // Setup the fact-switching loop
    var facts = ["Hackathon Fanatic", "Pun-Lover", "Early Adopter", "Spider-Man Enthusiast", "Indie Gamer", "Soda Streamer"];
    var factIndex = 0;
    $('#js-fact0').text(facts[factIndex++]);
    $('#js-fact1').text(facts[factIndex++]);
    setInterval(function(){
        $('#js-fact-block').animate({"top": "-24px"}, 500, function(){
            $('#js-fact0').text($('#js-fact1').text());
            $('#js-fact-block').css("top", "0");
            $('#js-fact1').text(facts[factIndex]);
            factIndex++;
            if (factIndex >= facts.length) factIndex = 0;
        });
    }, 2000);

});