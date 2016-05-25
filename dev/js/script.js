// Notes
// - Api calls have succesfully been made
// - Psuedo code has been implemented
// - Now we need to allow the query on our API calls to be controlled by user input
// 

// -- START --

// YUMMLY API CALL
var BBQApp = {
	// Empty object, will hold all of our Yummly content
};
// Recipe Finder variables, storing the url, key and ID
BBQApp.recipeApiUrl = 'http://api.yummly.com/v1/api/recipes';
BBQApp.recipeKey = 'adb94000e8a9955814a483ef0ca4592b';
BBQApp.recipeID = '6cebcd5a';
// Now our AJAX call
BBQApp.getRecipeData = function() {
	$.ajax({
		url: BBQApp.recipeApiUrl,
		data: {
			_app_key: BBQApp.recipeKey,
			_app_id: BBQApp.recipeID,
			q: "steak",
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
			q: "beer",
			// Filtering the results per page below
			per_page: '10',
			access_key: BBQApp.drinksKey
		}
	})
	.then(function(res) {
		console.log(res);
	});
};

// INIT and DOCUMENT READY BELOW
BBQApp.init = function() {
	// Keep this clean, only call functions in here
	BBQApp.getDrinkData();
	BBQApp.getRecipeData();
}

$(document).ready(function (){
	BBQApp.init();
});