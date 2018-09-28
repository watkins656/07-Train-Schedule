var $schedule = $('#schedule-tbody');
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDfn8MvmuZT8h2hnBP4ah00LyWvXTenqmY",
    authDomain: "train-scheduler-d4e9b.firebaseapp.com",
    databaseURL: "https://train-scheduler-d4e9b.firebaseio.com",
    projectId: "train-scheduler-d4e9b",
    storageBucket: "",
    messagingSenderId: "325152668287"
};

firebase.initializeApp(config);

var database = firebase.database();
var trainsRef = database.ref('/Trains')
$('#add-train').on('click', function (event) {
    event.preventDefault();

    // grab user input
    var name = $('#train-name').val().trim();
    var destination = $('#train-destination').val().trim();
    var frequency = $('#train-frequency').val().trim();
    var firstTime = $('#train-first-time').val().trim();

    // create a new train
    var newTrain = {
        name: name,
        destination: destination,
        frequency: frequency,
        firstTime: firstTime
    };
    trainsRef.push(newTrain);  
    alert("Train Successfully Added!")

    // Clear Form
    $('#train-name').val("");
    $('#train-destination').val("");
    $('#train-frequency').val("");
    $('#train-first-time').val("");
})

trainsRef.on('child_added', function(childSnapshot){
var trainName = childSnapshot.val().name;
var firstTime = childSnapshot.val().firstTime;
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
var trainFrequency = childSnapshot.val().frequency;
var timeRemainder = diffTime %trainFrequency;
console.log(timeRemainder);
var trainDestination = childSnapshot.val().destination;
var trainMinutesAway=trainFrequency - timeRemainder;
var trainNextArrival = moment().add(trainMinutesAway, 'minutes').format("hh:mm a");

var train = `
<tr>
    <td scope="row">${trainName}</td>
    <td>${trainDestination}</td>
    <td>${trainFrequency}</td>
    <td>${trainNextArrival}</td>
    <td>${trainMinutesAway}</td>
    </tr>
    `
    $schedule.append(train);
})

