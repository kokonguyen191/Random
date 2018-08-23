var spamClick = function() {
    var ran = Math.floor(Math.random()*6);
    $("#rabbitapp > div.content > div > div > div.content > div > div > div > div.vcWrapper > div > div > div.controls > div > div.right > div.reactions > div").children()[ran].click();
};

var runScheduler = function() {
	setTimeout(function() { spamClick(); runScheduler(); }, Math.random() * 150 + 250);
}

runScheduler();
