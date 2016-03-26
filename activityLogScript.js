//need to change javascript alerts to jquery mobile popups.
//add logout button.
//add crossed out button

var currentUser;

function addListItem(){

	var actName = $("#new-activity").val();
	var actTime1 = $("#startTime").val();
	var actTime2 = $("#endTime").val();
	var date = $("#actDate").val();
	var note = $("#note").val();
	
	if (date == "" || actName == "")
	{ //must enter at least a date and name of activity
		alert("Please enter something into all of the fields!");
	} else {
	
	//check if date exists in database or not:
	
	if (localStorage.getItem("date" + currentUser+date) == null)
	{ //if date doesn't exist, add the date to database

		localStorage.setItem("date"+currentUser+date, date); //date
		localStorage.setItem(currentUser+date+"count", 0); //count
		
	} 
	
	//increment the count for that date:
	
	countOld = localStorage.getItem(currentUser+date+"count");
	var intermediate = parseInt(countOld) + 1;
	countNew = (intermediate.toString());
	localStorage.setItem(currentUser+date+"count", countNew);

	//Now add the activity to the database
	//store the following at the key for the activity:
	// activityname~starttime~endtime~note
	//also store y/n to say if it is a complete task or not.
	localStorage.setItem(currentUser+date+countNew, actName+"~"+actTime1+"~"+actTime2+"~"+note);		
	localStorage.setItem(currentUser+date+countNew+"complete", "n");
	
	updateDates();	
	
	$("#actLog").listview('refresh');
	
	$("#new-activity").val('');
	$("#startTime").val('');
	$("#endTime").val('');
	$("#date").val('');
	$("#note").val('');
	}
	$("#actList").listview('refresh');
	$("#dateList").listview('refresh');
	
}

function deleteItem(){
	
	//$(this).remove(); //removes the item you click on with class delete.
	
}

function expandDate(){ //done
	
	//need to go through database and append all these items to listStyleType
	//start by removing all items, end with a list refresh

	$("#actList").empty();
	
	localStorage.setItem("mostRecentDate", this.id);
	
	var dateClicked = this.id;

	var numOfItems = localStorage.getItem(currentUser + dateClicked + "count");
	
	for (i = 1; i <= numOfItems; i++)
	{
		var activity = ((localStorage.getItem(currentUser+dateClicked+i)).split("~"))[0];
		if (localStorage.getItem(currentUser+dateClicked+i+"complete") == "n"){
			$("#actList").append('<li data-icon = "arrow-d" class = "expandActivity" id = "' + activity + '">'+activity+'<a href = "#moreInfo" data-transition = "slidedown"></a></li>');		
		} else { //if the task is completed, append with strike.
			$("#actList").append('<li data-icon = "arrow-d" class = "expandActivity" id = "' + activity + '"><strike>'+activity+'</strike><a href = "#moreInfo" data-transition = "slidedown"></a></li>');		
		}
	}
	
	$("#actList").listview('refresh');
		
}

function updateActivities() {
	
	$("#actList").empty();
	
	var dateClicked = localStorage.getItem("mostRecentDate");
	
	var numOfItems = localStorage.getItem(currentUser + dateClicked + "count");
	
	for (i = 1; i <= numOfItems; i++)
	{
		var activity = ((localStorage.getItem(currentUser+dateClicked+i)).split("~"))[0];
		if (localStorage.getItem(currentUser+dateClicked+i+"complete") == "n"){
			$("#actList").append('<li data-icon = "arrow-d" class = "expandActivity" id = "' + activity + '">'+activity+'<a href = "#moreInfo" data-transition = "slidedown"></a></li>');		
		} else { //if the task is completed, append with strike.
			$("#actList").append('<li data-icon = "arrow-d" class = "expandActivity" id = "' + activity + '"><strike>'+activity+'</strike><a href = "#moreInfo" data-transition = "slidedown"></a></li>');		
		}
	}
	
	$("#actList").listview('refresh');
		
}

function dateFormChanger(oldDate)
{
	console.log(oldDate);
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	oldDateBroken = oldDate.split("-");
	
	var newDate = months[oldDateBroken[1]-1] + " " + oldDateBroken[2] + ", " + oldDateBroken[0];
	
	return newDate;
	
}

function addNewAccount(){ //done

var username = $("#newUsername").val();
var pass = $("#newPassword").val();
if (pass == "") 
{
	alert("Please enter a password");
} else { 
	if (localStorage.getItem(username) == null)
	{//then there isn't an account with this username yet.
		if (pass == $("#retypePass").val() && username.indexOf("~") == -1)
		{ //passwords match, then create account.
			localStorage.setItem(username, pass);
			alert("Account created successfully.");
			window.location.href = "activityLogIndex.html";
		} else { alert("The passwords do not match, or you entered an invalid character."); }
	} else 
	{ //already an account with this name
		alert("There is already an account with this name.");
	}
	
}
	

//retrieve: -- document.getElementById("result").innerHTML = localStorage.getItem("lastname");
	
}

function loginCheck(){ //done
	
	username = $("#username").val();
	pass = $("#password").val();
	
	if (localStorage.getItem(username) == null)
	{
		alert("Incorrect username or password");
		window.location.href = "activityLogIndex.html";
	} else {
		
		if (localStorage.getItem(username) != pass) 
		{
			alert("Incorrect username or password");
			window.location.href = "activityLogIndex.html";
		} else {
			
			currentUser = username;
			localStorage.setItem("mostRecentUser", username);
			//load all dates to #dateList UL
			updateDates();
		}
		
	}
	
}

function updateDates()
{
	
	$("#dateList").empty();
	if (currentUser) {
			for (var key in localStorage)
			{
				if (key.substring(0,4 + currentUser.length) == ("date" + currentUser))
				{	
					
					var date = localStorage.getItem(key);
					$("#dateList").append('<li data-icon = "arrow-d" class = "expandDate" id = '+ date + '><a href="#activities" data-transition="slidedown">'+dateFormChanger(date)+'</a></li>');
				}
								
			}
			
			$("#dateList").listview('refresh');
	}
}

function expandActivity(){
	//expand activity means:
	//make the title of activity the header
	//make the start time and end times shown if available.
	//make the note shown just below that.
	//button to see if task is completed. 
	
	//sets this as the most recent activity for loading purposes.
	localStorage.setItem("mostRecentActivity", this.id);

	updateActivity();
	
}

function updateActivity(){
			
	var activity = localStorage.getItem("mostRecentActivity");
	
	var date = localStorage.getItem("mostRecentDate");
	
	var numOfItems = localStorage.getItem(currentUser + date + "count");
	
	var start;
	var end;
	var note;
	
	var correctKey;
	//find the correct activity in storage:

	for (key in localStorage) {
		
		var item = localStorage.getItem(key);
		var grabActivity = item.split("~");
		
		if (grabActivity[0] == activity)
		{ //found the correct activity.
			console.log("found");
			start = grabActivity[1];
			end = grabActivity[2];
			note = grabActivity[3];
			localStorage.setItem("lastKey", key);
			break;
		}
		
	}

	//with all of the information gathered, begin setting the

	console.log(activity, start, end, note);
	
	console.log($("#moreInfoTitle").html());
	
	$("#moreInfoTitle").html(activity);
	$("#stt").html('<label for = "stt" > Start time: </label>' + start);
	$("#ent").html('<label for = "stt" > End time: </label>' + end);
	$("#nt").html('<label for = "stt" > Additional Information: </label>' + note);
			
}

function completionUpdate() {
	
var mostRecentKey = localStorage.getItem("lastKey");

//swap completion key:
if (localStorage.getItem(mostRecentKey + "complete") == "y"){
localStorage.setItem(mostRecentKey + "complete", "n");
} else { 
	localStorage.setItem(mostRecentKey + "complete", "y");
}

updateActivities();
	
}

function logoutFunc(){
	window.location.href = "activityLogIndex.html";
}

$(function(){
	
	$("#add").on('click', addListItem);
	$(document.body).on('click', ".remove", deleteItem);
	$("#newAcc").on('click', addNewAccount);
	$("#loginButton").on('click', loginCheck);
	$(document.body).on('click', ".expandDate", expandDate);
	
	$(document.body).on('click', ".expandActivity", expandActivity);
	
	$("#comp").on('click', completionUpdate);
	
	$("#logoutButton").on('click', logoutFunc);
	
	updateDates();
	
	//refresh reloads of data
	if (localStorage.getItem("mostRecentUser") != null){
	currentUser = localStorage.getItem("mostRecentUser");
	}
	
	if ((window.location.href).split("#")[1] == "mainpage")
	{
		//run function to update dates
		updateDates();
	}
	
	if ((window.location.href).split("#")[1] == "login")
	{
		currentUser = ""; //reset current user.
	}
	
	if ((window.location.href).split("#")[1] == "activities")
	{
		updateActivities();
		updateDates();
	}
	
	if ((window.location.href).split("#")[1] == "moreInfo")
	{
		updateActivity();
		updateActivities();
		updateDates();
	}
	
});


//possible code to manipulate back button.
