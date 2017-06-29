// same as $(document).ready(function())
$(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAHpqQ8DOSnaAmhmwfrJdyFaSvKPr5_PBE",
    authDomain: "rps-multiplayer-2411c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-2411c.firebaseio.com",
    projectId: "rps-multiplayer-2411c",
    storageBucket: "rps-multiplayer-2411c.appspot.com",
    messagingSenderId: "637181866141"
  };

  firebase.initializeApp(config); 

  var database = firebase.database();

  var playersRef = database.ref("/players");

  var isEndGame = false;
  
  var player1 = {
    id: 1,
    name: undefined,
    losses: 0,
    wins: 0,
    rps: undefined,
    isWinner: false
  };

  var player2 = {
    id: 2,
    name: undefined,
    losses: 0,
    wins: 0,
    rps: undefined,
    isWinner: false
  };

  var currentPlayer = {
    id: -1, //  -1, is not in game, 1 for player 1, 2 for player 2
    name: undefined,
    losses: 0,
    wins: 0,
    rps: undefined,
    isWinner: false
  };

  var UI = {
    // any related user interface
    nameForm: $(".name-form"),
    submitName: $(".name-submit"),
    player1Greeting: $("#player1-greeting"),
    player1Turn: $("#player1-turn"),
    player1Name: $("#player1-name"),
    player1Score: $("#player1-score"),
    player1RpsOptions: $("#player1-rps-options"),
    player1RpsButton: $("#player1-rps-options button"),
    player1RpsChoice: $("#player1-rps-choice"),
    player2Greeting: $("#player2-greeting"),
    player2Turn: $("#player2-turn"),
    player2Name: $("#player2-name"),
    player2Score: $("#player2-score"),
    player2RpsOptions: $("#player2-rps-options"),
    player2RpsChoice: $("#player2-rps-choice"),
    player2RpsButton: $("#player2-rps-options button"),
    displayResult: $(".result")
  };

  function displayPlayer1Info() {
    UI.player1Name.text(player1.name);
    UI.player1Score.text("Win: " + player1.wins + " Losses: " + player1.losses);
  };

  function displayPlayer2Info() {
    UI.player2Name.text(player2.name);
    UI.player2Score.text("Win: " + player2.wins + " Losses: " + player2.losses);
  };

  function updateUI() {

    if (!player1.name) { // if player1 does not exist
      UI.player1Name.text("Waiting for Player 1");
      UI.player1Score.empty();
    }

    if (!player2.name) { // if player2 does not exist
      UI.player2Name.text("Waiting for Player 2");
      UI.player2Score.empty();
    }

    if (currentPlayer.id !== -1) { // if the currentPlayer is either player1 or player2
      UI.nameForm.hide(); // hide the name form
    };

    if (player1.name && currentPlayer.id === 1) { // if player1 exists and the currentPlayer is player1
      UI.player1Greeting.text("Hi " + currentPlayer.name + "! You are Player " + currentPlayer.id + "!"); // say hi
    }

    if (player2.name && currentPlayer.id === 2) { // if player2 exists and the currentPlayer is player2
      UI.player2Greeting.text("Hi " + currentPlayer.name + "! You are Player " + currentPlayer.id + "!"); // say hi
    }

    if (player1.name && player2.name && currentPlayer.id !== -1) { // if player1 and player2 exist and the currentPlayer is either player1 or player2

      if (!player1.rps && currentPlayer.id === 1) { // if player1 has not picked RPS and the currentPlayer is player1
        UI.player1Turn.text("It's your turn!"); // tell player1 it is his/her turn
        UI.player1RpsOptions.show(); // show the RPS options for player1
      }

      if (!player1.rps && currentPlayer.id === 2) { // if player1 has not picked RPS and the currentPlayer is player2
        UI.player2Turn.text("Waiting for " + player1.name + " to choose."); // tell player2 he/she is waiting for player1
      }

      if (player1.rps && currentPlayer.id === 1) { // if player1 has picked RPS and the currentPlayer is player1
        UI.player1RpsOptions.hide(); // hide the RPS options for player1
        UI.player1RpsChoice.text(player1.rps); // display player1's RPS to player1
      }

      if (player1.rps && !player2.rps && currentPlayer.id === 1) { // if player1 has picked RPS but player2 has not picked RPS and the currentPlayer is player1
        UI.player1Turn.text("Waiting for " + player2.name + " to choose."); // tell player1 he/she is waiting for player2
      }

      if (player1.rps && !player2.rps && currentPlayer.id === 2) { // if player1 has picked RPS but player2 has not picked RPS and the currentPlayer is player2
        UI.player2Turn.text("It's your turn!");
        UI.player2RpsOptions.show(); // show the RPS options for player2
      }

      if (player1.rps && player2.rps) { // if player1 and player2 has picked RPS
        UI.player1Turn.empty(); // waiting for results
        UI.player2Turn.empty(); // waiting for results
        console.log(player1.rps);
        console.log(player2.rps);
        UI.player2RpsOptions.hide(); // hide the RPS options for player2 - no need to do for player1 since it will be triggered in the second if statement
        UI.player1RpsChoice.text(player1.rps); // display player1's RPS to player1 and player2
        UI.player2RpsChoice.text(player2.rps); // display player2's RPS to player1 and player 2

        if (player1.isWinner) { // if player1 is winner 
          UI.displayResult.text(player1.name + " Wins!"); // display player1 is winner
        } else if (player2.isWinner) { // if player2 is winner
          UI.displayResult.text(player2.name + " Wins!"); // display player2 is winner
        } else { // if neither player1 nor player2 wins
          UI.displayResult.text("Tie!") // display it is a tie
        }
        setTimeout(reset, 3000);
      }
    };

    // regardless of the currentPlayer's id, will still display player1 and player2's info unless they do not exist
    if (player1.name) { // if player1 exists
      displayPlayer1Info(); 
    }

    if (player2.name) { // if player2 exists
      displayPlayer2Info();
    }

  };

  function reset() {

    // new round of RPS
    currentPlayer.rps = null;
    currentPlayer.isWinner = false;
    player1.rps = null; // removes player1.rps from Firebase
    player1.isWinner = false;
    player2.rps = null; // removes player2.rps from Firebase
    player2.isWinner = false;
    isEndGame = false;

    UI.displayResult.empty(); // clear results
    UI.player1RpsChoice.empty(); // clear player1's RPS choice
    UI.player2RpsChoice.empty(); // clear player2's RPS choice

    // update Firebase player1 and player2 rps to undefined
    updates = {};
    updates["/player-1/rps"] = player1.rps;
    updates["/player-2/rps"] = player2.rps;
    playersRef.update(updates);

    updateUI();

  };

  // we would be grabbing player1.wins and player1.losses from Firebase since it will be updated every time the wins/losses are changed
  // by this function 
  playersRef.on("value", function(snapshot) {   

    playersRef.child("player-" + currentPlayer.id).onDisconnect().remove();

    if (snapshot.child("player-1").exists()) {
    // sync player1 variable with Firebase
      player1.name = snapshot.child("player-1").child("name").val();
      player1.wins = snapshot.child("player-1").child("wins").val();
      player1.losses = snapshot.child("player-1").child("losses").val();
      player1.rps = snapshot.child("player-1").child("rps").val();
    };

    if (snapshot.child("player-2").exists()) {
    // sync player2 variable with Firebase
      player2.name = snapshot.child("player-2").child("name").val();
      player2.wins = snapshot.child("player-2").child("wins").val();
      player2.losses = snapshot.child("player-2").child("losses").val();
      player2.rps = snapshot.child("player-2").child("rps").val();
    };

    switch (currentPlayer.id) { // look at currentPlayer's id as the condition of what to run next
      case -1: // if currentPlayer.id === -1, then the currentPlayer is a spectator and is only able to leave comments
        // spectator only able to leave comment
        break;
      case 1: // if currentPlayer.id === 1, then the currentPlayer is player1
        // sync currentPlayer with player1
        currentPlayer.name = player1.name;
        currentPlayer.wins = player1.wins;
        currentPlayer.losses = player1.losses;
        currentPlayer.rps = player1.rps;
        break;
      case 2: // if currentPlayer.id === 2, then the currentPlayer is player2
        // sync currentPlayer with player2
        currentPlayer.name = player2.name;
        currentPlayer.wins = player2.wins;
        currentPlayer.losses = player2.losses;
        currentPlayer.rps = player2.rps;
        break;
    };

    // !isEndGame to prevent run this logic multiple time
    if (!isEndGame && player1.rps && player2.rps) {
      console.log(player1.rps);
      console.log(player2.rps);
      if (player1.rps === "Rock" && player2.rps === "Scissors") {
        player1.wins++; 
        player2.losses++;

        player1.isWinner = true;
        player2.isWinner = false;
      
        isEndGame = true;
      } else if (player1.rps === "Rock" && player2.rps === "Paper") {
        player1.losses++;
        player2.wins++;

        player1.isWinner = false;
        player2.isWinner = true;
        
        isEndGame = true;
      } else if (player1.rps === "Scissors" && player2.rps === "Rock") {
        player1.losses++;
        player2.wins++;

        player1.isWinner = false;
        player2.isWinner = true;
        
        isEndGame = true;
      } else if (player1.rps === "Scissors" && player2.rps === "Paper") {
        player1.wins++;
        player2.losses++;

        player1.isWinner = true;
        player2.isWinner = false;
        
        isEndGame = true;
      } else if (player1.rps === "Paper" && player2.rps === "Rock") {
        player1.wins++;
        player2.losses++;

        player1.isWinner = true;
        player2.isWinner = false;
        
        isEndGame = true;
      } else if (player1.rps === "Paper" && player2.rps === "Scissors") {
        player1.losses++;
        player2.wins++;

        player1.isWinner = false;
        player2.isWinner = true;
        
        isEndGame = true;
      } else if (player1.rps === player2.rps) { // draw
        isEndGame = true;
      }
      
      // after update UI, post-process
      // sync with firebase
      updates = {};
      updates["/player-1/losses"] = player1.losses;
      updates["/player-1/wins"] = player1.wins;
      updates["/player-2/losses"] = player2.losses;
      updates["/player-2/wins"] = player2.wins;
      playersRef.update(updates);

    };
    
    // all models are sync from firebase
    updateUI();

  });


  UI.submitName.on("click", function(event) {

    // stop the page from refreshing
    event.preventDefault();

    const inputName = $("#name-input").val();
    console.log("Name: " + inputName);

    // TODO
    if (!inputName) { // if user submits an empty name
    }

    if (player1.name && player2.name) { // if player1 and player2 already exist, then alert the user that they cannot play
      alert("Sorry, the game is full. Please try again later.");
      currentPlayer = {
        id: -1, // -1 is not in game , 1 for player 1, 2 for player 2
        name: inputName,
        losses: 0,
        wins: 0,
        rps: undefined
      };
    } else if (player1.name) { // if player1 exists, the currentPlayer will be player2
      currentPlayer = {
        id: 2, 
        name: inputName,
        losses: 0,
        wins: 0,
        rps: undefined
      };
    } else if (player2.name) { // if player2 exists, the currentPlayer will be player1
      currentPlayer = {
        id: 1, 
        name: inputName,
        losses: 0,
        wins: 0,
        rps: undefined
      };
    } else { // if player1 and player2 do not exist, assign to player 1
      currentPlayer = {
        id: 1, 
        name: inputName,
        losses: 0,
        wins: 0,
        rps: undefined
      };
    };

    // only update Firebase if the currentPlayer is player1 or player2
    if (currentPlayer.id !== -1) {
      playersRef.child("player-" + currentPlayer.id).update({
        name: currentPlayer.name, 
        losses: currentPlayer.losses,
        wins: currentPlayer.wins
      });
    }

    updateUI();

  });

  UI.player1RpsButton.on("click", function() {

    currentPlayer.rps = $(this).attr("name");
    player1.rps = currentPlayer.rps;
    playersRef.child("player-1").update({
      rps: currentPlayer.rps
    });

    updateUI();
  });

  UI.player2RpsButton.on("click", function() {

    currentPlayer.rps = $(this).attr("name");
    player2.rps = currentPlayer.rps;
    playersRef.child("player-2").update({
      rps: currentPlayer.rps
    });

    updateUI();
  });

});
