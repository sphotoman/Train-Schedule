$(document).ready(function() {
	 $('select').material_select();

// link to FireBase
  // Initialize Firebase
	var config = {
	    apiKey: "AIzaSyDq148PeiqYmTMuQgZBDvYIL_Go4D5GH_w",
	    authDomain: "magic-train-schedule-aa18b.firebaseapp.com",
	    databaseURL: "https://magic-train-schedule-aa18b.firebaseio.com",
	    projectId: "magic-train-schedule-aa18b",
	    storageBucket: "magic-train-schedule-aa18b.appspot.com",
	    messagingSenderId: "757185477282"
	};
	firebase.initializeApp(config);

	var database=firebase.database();

	// var trainData = new FireBase("https://magic-train-schedule-aa18b.firebaseio.com/");



// gather data from form and assign to variables

    $('#myNewTrainButton').click(function() {
       event.preventDefault()
       
 		var trainName = $("#trainNameInput").val().trim();
 		var destinationInput =$("#destinationInput").val().trim();
 		var firstTrainTimeInput =$("#firstTrainTimeInput").val().trim();
 		var frequencyInput =$("#frequencyInput").val().trim();

// Test for variables entered
		// console.log("New Train: " + trainName);
		// console.log("New Destination: " + destinationInput);
		// console.log("Initial Run: " + firstTrainTimeInput);
		// console.log("How Often: " + frequencyInput);

		var convertedTime = moment(firstTrainTimeInput, "HH:mm")
		// console.log(convertedTime);
		// console.log(convertedTime.format("h:mm a"))


// structure data for firebase
		var newTrain = {
			name: trainName,
			destination: destinationInput,
			firstTrain: firstTrainTimeInput,
			frequency: frequencyInput
		}
//pust to FireBase
		database.ref().push(newTrain);

// clear text boxes
// prevent page reload
	});

// work with firebase
// get data back - snapshots? assigned to variables
	database.ref().on("child_added", function(snapshot) {
		var newPost = snapshot.val()
		// console.log(newPost.name);
		// console.log(newPost.destination);
		// console.log(newPost.firstTrain);
		// console.log(newPost.frequency);

		var tFrequency = newPost.frequency;
		var firstTime = newPost.firstTrain;


		// First Time (pushed back 1 year to make sure it comes before current time)
	    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
	    console.log(firstTimeConverted);

	    // Current Time
	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    // Difference between the times
	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    // Time apart (remainder)
	    var tRemainder = diffTime % tFrequency;
	    console.log(tRemainder);

	    // Minute Until Train
	    var tMinutesTillTrain = tFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	    // Next Train
	    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
	
	// send all the data back to the html and display for page viewer.

		$("#trainTable > tbody").append("<tr><td>" + newPost.name + "</td><td>" + newPost.destination + "</td><td>" + tFrequency + " mins" + "</td><td>" + nextTrain.format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");


	})

})