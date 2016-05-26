// Notes
// - Api calls have successfully been made
// - Pseudo code has been partially implemented 
// - Now we need to allow the query on our API calls to be controlled by user input
// 

// -- START --

// YUMMLY API CALL
var BBQApp = {
	// Empty object, will hold all of our Yummly and LCBO content
};
// Recipe Finder variables, storing the url, key and ID
BBQApp.recipeApiUrl = 'http://api.yummly.com/v1/api/recipes';
BBQApp.recipeKey = 'adb94000e8a9955814a483ef0ca4592b';
BBQApp.recipeID = '6cebcd5a';
// Now our AJAX call


// Get users meat choice and pass value to Ajax call
BBQApp.getUserSelection = function() {
	$('form').on('submit', function(e){
		e.preventDefault();
		var meatSelected = $('input[name=meat]:checked').val();

		
		var veggieSelected = $('input[name=veggie]:checked').val();
		
		var veggieArray = [];

		veggieArray.push(veggieSelected).val();

		console.log(veggieArray);

		BBQApp.getRecipeData(meatSelected);
	});
}


BBQApp.getRecipeData = function(userchoice) {
	$.ajax({
		url: BBQApp.recipeApiUrl,
		data: {
			_app_key: BBQApp.recipeKey,
			_app_id: BBQApp.recipeID,
			// Currently searching for steak, will be changed to user input
			q: " barbeque",
			// Below line will filter through, only showing results with pictures
			requirePictures: true,
			// Limiting the results to a set number
		    maxResult: 5
		},
		method: 'GET',
		dataType: 'json'
	})
	.then(function(res) {
		console.log(res);
	}, function(err) {
		console.log(err)
	});
};

// Drink Finder variables, storing the Key and URL (which I've concatenated together)
BBQApp.drinksKey = 'MDo0NjQ5MjEzNC0yMWY4LTExZTYtYTIxNy01ZjMzOTgzMzVmODU6djFobWhkNTlrWFhnTVBPemI4VWZHUUlFZE5IQUtTSlJUYmE3';
BBQApp.drinksApiUrl = 'http://lcboapi.com/products';

// Drink Finder AJAX call
BBQApp.getDrinkData = function() {
	$.ajax({
		url: BBQApp.drinksApiUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			// Currently searching for beer, will change according to user input
			q: "beer",
			// Filtering the results per page below
			per_page: '10',
			// Being appended to the url
			access_key: BBQApp.drinksKey
		}
	})
	.then(function(res) {
		console.log(res);
	}, function(err) {
		console.log(err)
	});
};

// INIT and DOCUMENT READY BELOW
BBQApp.init = function() {
	// Keep this clean, only call functions in here
	BBQApp.getUserSelection();
	BBQApp.getDrinkData();
	BBQApp.getRecipeData();
}

$(document).ready(function (){
	BBQApp.init();
});