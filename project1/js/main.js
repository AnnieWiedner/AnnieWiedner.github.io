var deckId = "";

var userPile = [];
var compPile = [];
var counter1 = 0;
var counter2 = 26;
var user = "user";
var draws = 4;

var createDeck = function() {
	$.ajax({
		method: "GET",
		url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
		success: function(response){
			deckId = response.deck_id
			var button = $('<button id="play">Play</button>');
			$('#headlines').append(button);
			$('#play').click(function(){
				$(this).remove();
				var loading = $('<div id="loading">Dealing cards...</div>');
				$('#headlines').append(loading);
				$('#userBack').addClass("userShake")
				$('#compBack').addClass("compShake")
				for(var i = 1; i <= 52; i++){
					if (i%2===0) {
						dealUserDeck();
					}
					else {
						dealComputerDeck();
					}				
				}

				console.log(userPile);
				console.log(compPile);
		
				$(document).ajaxStop(function() {
					$('#userBack').removeClass("userShake")
					$('#compBack').removeClass("compShake")
					$('#loading').remove();
					var yourTurn = $('<div id="turn">Play Card</div>');
					$('#player').append(yourTurn);

					var userScore = $("<div id='userScore'>26</div>")
					var compScore = $("<div id='compScore'>26</div>")

					$('#player').append(userScore);
					$('#computer').append(compScore);


					$('#turn').click(function() {
						pullTopCard();
						gameOver();
	
					})
				})

			})
		
		}

	})
	}


createDeck();




var cardDrawn = "";
var code = "";
var image = "";


var dealUserDeck = function() {
	$.ajax({
		method: "GET",
		url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1",
		success: function(response){
			image = response.cards[0].image;
			code = response.cards[0].code;
			userPile.push(response);
			var card =response.cards[0].image;
			var img = $('<img>').attr({"id":"cardNum" + counter1, "src":card, "class":"leftAlign"});
			$('#player').append(img);
			counter1++;
		}
	})
}

var dealComputerDeck = function() {
	$.ajax({
		method: "GET",
		url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1",
		success: function(response){
			code = response.cards[0].code;
			image = response.cards[0].image;
			compPile.push(response);
			var card =response.cards[0].image;
			var img = $('<img>').attr({"id": "cardNum" + counter2, "src":card, "class":"rightAlign"});
			$('#computer').append(img);
			counter2++;
		}
	})
}


var userIndex = 0;
var compIndex = 0;
var userCard = "";
var compCard = "";



var pullTopCard = function() {
	userCard = userPile[0];
	compCard = compPile[0];
	console.log(userCard)
	console.log(compCard)

	$($('#player > img')[0]).removeClass("leftAlign");
	$('#userPlayed').append($($('#player > img')[0]));
	$($('img')[0]).addClass("topL");
	$($('img')[0]).fadeIn();

	$($('#computer > img')[0]).removeClass("rightAlign");
	$('#compPlayed').append($($('#computer > img')[0]));
	$($('img')[1]).addClass("topR");
	$($('img')[1]).delay(1000).fadeIn();

	console.log($($('img')[0]));
	console.log($($('img')[1]));

	// add button so they can shuffle

	$(document).delay(2000).ready(function() {
		compareCards();
		$('#turn').hide();
	})
}






var compareCards = function() {
	getUserRank();
	getCompRank();

	if(userRank > compRank) {
		$($('img')[0]).delay(3200).animate({left: '-500px'});
		$($('img')[1]).delay(2000).animate({right: '100%'});
		userPile.push(compCard);
		userPile.push(userCard);
		userPile.splice(0, 1);
		compPile.splice(0, 1);


		$($('img')[1]).hide("slow", function(){
			$($('img')[1]).removeClass("topR");
			$($('img')[1]).addClass("leftAlign");
			$($('img')[1]).removeAttr("style");
			$($('img')[1]).show()
			$('#player').append($($('img')[1]));
			$($('img')[0]).delay(2000).hide("slow", function(){
				$($('img')[0]).removeClass("topL");
				$($('img')[0]).addClass("leftAlign");
				$($('img')[0]).removeAttr("style");
				$($('img')[0]).show()
				$('#player').append($($('img')[0]));
				$('#turn').show();
				userScore = userPile.length
				compScore = compPile.length
				$('#userScore').html(userScore)
				$('#compScore').html(compScore)

			});
		});

	}

	else if (compRank > userRank) {	
		$($('img')[0]).delay(3000).animate({left: '100%'});
		$($('img')[1]).delay(2000).animate({left: '100%'});
		compPile.push(userCard);
		compPile.push(compCard);
		compPile.splice(0, 1);
		userPile.splice(0, 1);
		$($('img')[1]).hide("slow", function(){
			$($('img')[1]).removeClass("topR");
			$($('img')[1]).addClass("rightAlign");
			$($('img')[1]).removeAttr("style");
			$($('img')[1]).show()
			$('#computer').append($($('img')[1]));
			$($('img')[0]).hide("slow", function(){
				$($('img')[0]).removeClass("topL");
				$($('img')[0]).addClass("rightAlign");
				$($('img')[0]).removeAttr("style");
				$($('img')[0]).show()
				$('#computer').append($($('img')[0]));
				$('#turn').show();
				userScore = userPile.length
				compScore = compPile.length
				$('#userScore').html(userScore)
				$('#compScore').html(compScore)
			});
		});
	}

	else if(compRank === userRank){

		// alerts user that the cards are equal, so war has been initiated
		setTimeout(function() {
		$('h1').html("War!!!!!!")
		$('h1').addClass("warning");
		}, 2000)

		// displays a play war button which will execute the first round
		var warButton1 = $('<div id="WB1" class="warButton">Play War</div>');
		$('#player').append(warButton1);
		$('#WB1').delay(2000).fadeIn();

		// first round of war executed (cards face down)

		$('#WB1').click("slow", function() {
			$('#WB1').fadeOut();

			var userB1 = $('<div id="UB1"></div>');
			$('#userPlayed').append(userB1);
			$('#UB1').fadeIn();

			$($('#player > img')[0]).removeClass("leftAlign");
			$('#userPlayed').append($($('#player > img')[0]));
			$($('img')[1]).addClass("UF1");

			var compB1 = $('<div id="CB1"></div>');
			$('#compPlayed').append(compB1)
			$('#CB1').delay(1000).fadeIn();

			$($('#computer > img')[0]).removeClass("rightAlign");
			$('#compPlayed').append($($('#computer > img')[0]));
			$($('img')[3]).addClass("CF1");

			var warButton2 = $('<div id="WB2" class="warButton">Play War</div>');
			$('#player').append(warButton2);
			$('#WB2').delay(1000).fadeIn();

			// second round of war executed (cards face down)

			$('#WB2').click("slow", function() {
				$('#WB2').fadeOut();
			
				var userB2 = $('<div id="UB2"></div>');
				$('#userPlayed').append(userB2);
				$('#UB2').fadeIn();

				$($('#player > img')[0]).removeClass("leftAlign");
				$('#userPlayed').append($($('#player > img')[0]));
				$($('img')[2]).addClass("UF2");

				var compB2 = $('<div id="CB2"></div>');
				$('#compPlayed').append(compB2)
				$('#CB2').delay(1000).fadeIn();

				$($('#computer > img')[0]).removeClass("rightAlign");
				$('#compPlayed').append($($('#computer > img')[0]));
				$($('img')[5]).addClass("CF2");

				var warButton3 = $('<div id="WB3" class="warButton">Play War</div>');
				$('#player').append(warButton3);
				$('#WB3').delay(1000).fadeIn();

				// final round of war executed (cards face up)

				$('#WB3').click("slow", function() {
					$('#WB3').fadeOut();
			
					$($('#player > img')[0]).removeClass("leftAlign");
					$('#userPlayed').append($($('#player > img')[0]));
					$($('img')[3]).addClass("UF3");
					$('.UF3').delay(1000).fadeIn();

					$($('#computer > img')[0]).removeClass("rightAlign");
					$('#compPlayed').append($($('#computer > img')[0]));
					$($('img')[7]).addClass("CF3");
					$('.CF3').delay(1000).fadeIn();

					warCompare();

				})
			})

		})

	}




}


var userRank = 0; 
var compRank = 0;


// this function gets the value of the user's card
var getUserRank = function() {
	if(userPile[0].cards[0].value === "KING") {
		userRank = 13;
		console.log(userRank)
	}
	else if (userPile[0].cards[0].value === "QUEEN") {
		userRank = 12;
		console.log(userRank)
	}
	else if (userPile[0].cards[0].value === "JACK") {
		userRank = 11;
		console.log(userRank)
	}
	else if (userPile[0].cards[0].value === "ACE"){
		userRank = 14;
		console.log(userRank)
	}
	else {
		userRank = parseInt(userPile[0].cards[0].value)
		console.log(userRank)
	}
}

// this function gets the value of the computer's card
var getCompRank = function() {
	if(compPile[0].cards[0].value === "KING") {
		compRank = 13;
		console.log(compRank)
	}
	else if (compPile[0].cards[0].value === "QUEEN") {
		compRank = 12;
		console.log(compRank)
	}
	else if (compPile[0].cards[0].value  === "JACK") {
		compRank = 11;
		console.log(compRank)
	}
	else if (compPile[0].cards[0].value  === "ACE"){
		compRank = 14;
		console.log(compRank)
	}
	else {
		compRank = parseInt(compPile[0].cards[0].value)
		console.log(compRank)
	}
}


// this function gets the value of the users's card during war

var userRankWar = function() {
	if(userPile[3].cards[0].value === "KING") {
		warUserRank = 13;
		console.log(warUserRank)
	}
	else if (userPile[3].cards[0].value === "QUEEN") {
		warUserRank = 12;
		console.log(warUserRank)
	}
	else if (userPile[3].cards[0].value === "JACK") {
		warUserRank = 11;
		console.log(warUserRank)
	}
	else if (userPile[3].cards[0].value === "ACE"){
		warUserRank = 14;
		console.log(warUserRank)
	}
	else {
		warUserRank = parseInt(userPile[3].cards[0].value)
		console.log(warUserRank)
	}
}

// this function gets the value of the computer's card during war
var compRankWar = function() {
	if(compPile[3].cards[0].value === "KING") {
		warCompRank = 13;
		console.log(warCompRank)
	}
	else if (compPile[3].cards[0].value === "QUEEN") {
		warCompRank = 12;
		console.log(warCompRank)
	}
	else if (compPile[3].cards[0].value  === "JACK") {
		warCompRank = 11;
		console.log(warCompRank)
	}
	else if (compPile[3].cards[0].value  === "ACE"){
		warCompRank = 14;
		console.log(warCompRank)
	}
	else {
		warCompRank = parseInt(compPile[3].cards[0].value)
		console.log(warCompRank)
	}
}




var gameOver = function() {
	if (compPile.length === 0) {
		var win = $('<div id="userWins">You win!</div>');
		$('#headlines').append(win)
	}

	else if (userPile.length === 0) {
		var lose = $('<div id="userLoses">You lose!</div>');
		$('#headlines').append(lose)
	}
}

var warCompare = function() {
	compRankWar();
	userRankWar();

	if (warUserRank > warCompRank) {
		//flip over the cards 
		$($('img')[1]).delay(4000).fadeIn()
		$($('img')[2]).delay(5000).fadeIn()
		$('#UB1').delay(6000).fadeOut();
		$('#UB2').delay(6000).fadeOut();	
		$($('img')[5]).delay(4000).fadeIn()
		$($('img')[6]).delay(5000).fadeIn()
		$('#CB1').delay(6000).fadeOut();
		$('#CB2').delay(6000).fadeOut();
		//highlight the winner
		
		$($('img')[3]).css({"border": "3px yellow solid", "border-radius":"5px"})
		$($('img')[0]).delay(8500).animate({left: "-500px"})
		$($('img')[1]).delay(4000).animate({left: "-500px"})
		$($('img')[2]).delay(3000).animate({left: "-500px"})
		$($('img')[3]).delay(7000).animate({left: "-500px"})
		$($('img')[4]).delay(8500).animate({right: "100%"})
		$($('img')[5]).delay(4000).animate({right: "100%"})
		$($('img')[6]).delay(3000).animate({right: "100%"})
		$($('img')[7]).delay(7000).animate({right: "100%"})

		userCard1 = userPile[0];
		userCard2 = userPile[1];
		userCard3 = userPile[2];
		userCard4 = userPile[3];

		compCard1 = compPile[0];
		compCard2 = compPile[1];
		compCard3 = compPile[2];
		compCard4 = compPile[3];

		userPile.push(userCard1, userCard2, userCard3, userCard4);
		userPile.push(compCard1, compCard2, compCard3, compCard4);

		compPile.splice(0, 4);
		userPile.splice(0, 4);	

		$($('img')[7]).hide("slow", function(){
			$('#CB1').remove();
			$('#CB2').remove();
			$('#UB1').remove();
			$('#UB2').remove();	
			$('#WB1').remove();	
			$('#WB2').remove();	
			$('#WB3').remove();			
			$($('img')[7]).removeClass("CF3");
			$($('img')[7]).addClass("leftAlign");
			$($('img')[7]).removeAttr("style");
			$($('img')[7]).show()
			$('#player').append($($('img')[7]));
			$($('img')[6]).hide("slow", function(){
				$($('img')[6]).removeClass("CF2");
				$($('img')[6]).addClass("leftAlign");
				$($('img')[6]).removeAttr("style");
				$($('img')[6]).show()
				$('#player').append($($('img')[6]));
				$($('img')[5]).hide("slow", function(){
					$($('img')[5]).removeClass("CF1");
					$($('img')[5]).addClass("leftAlign");
					$($('img')[5]).removeAttr("style");
					$($('img')[5]).show()
					$('#player').append($($('img')[5]));
						$($('img')[4]).hide("slow", function(){
							$($('img')[4]).removeClass("topR");
							$($('img')[4]).addClass("leftAlign");
							$($('img')[4]).removeAttr("style");
							$($('img')[4]).show()
							$('#player').append($($('img')[4]));
							$($('img')[3]).hide("slow", function(){
								$($('img')[3]).removeClass("UF3");
								$($('img')[3]).addClass("leftAlign");
								$($('img')[3]).removeAttr("style");
								$($('img')[3]).show()
								$('#player').append($($('img')[3]));
								$($('img')[2]).hide("slow", function(){
									$($('img')[2]).removeClass("UF2");
									$($('img')[2]).addClass("leftAlign");
									$($('img')[2]).removeAttr("style");
									$($('img')[2]).show()
									$('#player').append($($('img')[2]));
									$($('img')[1]).hide("slow", function(){
										$($('img')[1]).removeClass("UF1");
										$($('img')[1]).addClass("leftAlign");
										$($('img')[1]).removeAttr("style");
										$($('img')[1]).show()
										$('#player').append($($('img')[1]));
										$($('img')[0]).hide("slow", function(){
											$($('img')[0]).removeClass("topL");
											$($('img')[0]).addClass("leftAlign");
											$($('img')[0]).removeAttr("style");
											$($('img')[0]).show()
											$('#player').append($($('img')[0]));
											$('#turn').show();
											userScore = userPile.length
											compScore = compPile.length
											$('#userScore').html(userScore)
											$('#compScore').html(compScore)
											$('h1').removeClass("warning");		
											$('h1').html("War")											
										})
									})
								})
							})
						})
					})
			})
		})

		}

	else if (warUserRank < warCompRank) {
		//flip over the cards
		$($('img')[1]).delay(4000).fadeIn()
		$($('img')[2]).delay(5000).fadeIn()
		$('#UB1').delay(6000).fadeOut();
		$('#UB2').delay(6000).fadeOut();	
		$($('img')[5]).delay(4000).fadeIn()
		$($('img')[6]).delay(5000).fadeIn()
		$('#CB1').delay(6000).fadeOut();
		$('#CB2').delay(6000).fadeOut();
		//highlight the winner	
		$($('img')[7]).css({"border": "3px yellow solid", "border-radius":"5px"})


		$($('img')[0]).delay(8500).animate({left: "100%"})
		$($('img')[1]).delay(4000).animate({left: "100%"})
		$($('img')[2]).delay(3000).animate({left: "100%"})
		$($('img')[3]).delay(7000).animate({left: "100%"})

		$($('img')[4]).delay(8500).animate({left: "100%"})
		$($('img')[5]).delay(4000).animate({left: "100%"})
		$($('img')[6]).delay(3000).animate({left: "100%"})
		$($('img')[7]).delay(7000).animate({left: "100%"})	

		userCard1 = userPile[0];
		userCard2 = userPile[1];
		userCard3 = userPile[2];
		userCard4 = userPile[3];

		compCard1 = compPile[0];
		compCard2 = compPile[1];
		compCard3 = compPile[2];
		compCard4 = compPile[3];

		compPile.push(userCard1, userCard2, userCard3, userCard4);
		compPile.push(compCard1, compCard2, compCard3, compCard4);

		compPile.splice(0, 4);
		userPile.splice(0, 4);	

		$($('img')[7]).hide("slow", function(){
			$('#CB1').remove();
			$('#CB2').remove();
			$('#UB1').remove();
			$('#UB2').remove();			
			$('#WB1').remove();	
			$('#WB2').remove();	
			$('#WB3').remove();	
			$($('img')[7]).removeClass("CF3");
			$($('img')[7]).addClass("rightAlign");
			$($('img')[7]).removeAttr("style");
			$($('img')[7]).show()
			$('#computer').append($($('img')[7]));
			$($('img')[6]).hide("slow", function(){
				$($('img')[6]).removeClass("CF2");
				$($('img')[6]).addClass("rightAlign");
				$($('img')[6]).removeAttr("style");
				$($('img')[6]).show()
				$('#computer').append($($('img')[6]));
				$($('img')[5]).hide("slow", function(){
					$($('img')[5]).removeClass("CF1");
					$($('img')[5]).addClass("rightAlign");
					$($('img')[5]).removeAttr("style");
					$($('img')[5]).show()
					$('#computer').append($($('img')[5]));
						$($('img')[4]).hide("slow", function(){
							$($('img')[4]).removeClass("topR");
							$($('img')[4]).addClass("rightAlign");
							$($('img')[4]).removeAttr("style");
							$($('img')[4]).show()
							$('#computer').append($($('img')[4]));
							$($('img')[3]).hide("slow", function(){
								$($('img')[3]).removeClass("UF3");
								$($('img')[3]).addClass("rightAlign");
								$($('img')[3]).removeAttr("style");
								$($('img')[3]).show()
								$('#computer').append($($('img')[3]));
								$($('img')[2]).hide("slow", function(){
									$($('img')[2]).removeClass("UF2");
									$($('img')[2]).addClass("rightAlign");
									$($('img')[2]).removeAttr("style");
									$($('img')[2]).show()
									$('#computer').append($($('img')[2]));
									$($('img')[1]).hide("slow", function(){
										$($('img')[1]).removeClass("UF1");
										$($('img')[1]).addClass("rightAlign");
										$($('img')[1]).removeAttr("style");
										$($('img')[1]).show()
										$('#computer').append($($('img')[1]));
										$($('img')[0]).hide("slow", function(){
											$($('img')[0]).removeClass("topL");
											$($('img')[0]).addClass("rightAlign");
											$($('img')[0]).removeAttr("style");
											$($('img')[0]).show()
											$('#computer').append($($('img')[0]));
											$('#turn').show();
											userScore = userPile.length
											compScore = compPile.length
											$('#userScore').html(userScore)
											$('#compScore').html(compScore)		
											$('h1').removeClass("warning");		
											$('h1').html("War")
									
										})
									})
								})
							})
						})
					})
			})
		})



	}
}

var userCard1 = "";
var userCard2 = "";
var userCard3 = "";
var userCard4 = "";

var compCard1 = "";
var compCard2 = "";
var compCard3 = "";
var compCard4 = "";


