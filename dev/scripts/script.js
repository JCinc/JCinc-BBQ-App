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

// Get users meat choice and pass value to Ajax call
BBQApp.getUserSelection = function() {
	
	$('form').on('submit', function(e){
		e.preventDefault();

		var meatSelected = $('input[name=meat]:checked').val();

		if (typeof(meatSelected) === "undefined"){
			meatSelected = " vegetarian";
		};
		// console.log(meatSelected);
		
		var veggieSelected = $('input[name=veggie]:checked');
		
		var veggieArray = [];
		veggieSelected.each(function(i,el){
			// i is required the index of the element in the array
			// .each() is a jquery method
			// console.log(el);
			veggieArray.push($(el).val());
		});
		// console.log(veggieArray);
		// we collect multiple veggieSelected choices and put them in the veggieArray
		// and make them into a value
		
		var drinkSelected = $('input[name=drink]:checked').val();
		// $('input[name=drink]').on('click')
		console.log(drinkSelected);



		BBQApp.getRecipeData(meatSelected, veggieArray);

// Once a recipe is generated, output a random drink from the LCBO API
		BBQApp.getDrinkData(drinkSelected);
	
	});
	
}

BBQApp.shuffle = function(array){
	var counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// pick a random index
		var index = Math.floor(Math.random() * counter);

		// decrease counter by 1

		counter--;

		// and swap the last element with it

		var temp = array[counter];
		array[counter] - array[index];
		array[index] = temp;
	}

	return array;
};

BBQApp.displayFoodResults = function(results) {
	// Yummly
	var recipeObjects = results.matches;
	recipeObjects = BBQApp.shuffle(recipeObjects);
	if(recipeObjects.length > 0) {
		// loop through the results
		for (var i=0; i < recipeObjects.length; i++) {
			var recipeName = recipeObjects[i].recipeName;
			var recipeImage = recipeObjects[i].smallImageUrls[0].replace(/s90/g, 's250');
			var recipeLink = "http://www.yummyly.com/recipe/" + BBQApp.recipeID;
			var recipeCookTime = recipeObjects[i].totalTimeInSeconds / 60;
		// console.log(recipeName);
		// console.log(recipeImage);
		// console.log(recipeLink);
		// console.log(recipeCookTime);
		}
	}
};

BBQApp.displayDrinkResults = function(results) {
	// LCBO
	var drinkObjects = results.result;
	drinkObjects = BBQApp.shuffle(drinkObjects);
	if(drinkObjects.length > 0) {
		// loop through the results
		for (var i=0; i < drinkObjects.length; i++) {
			var drinkName = drinkObjects[i].name;
			var drinkImage = drinkObjects[i].image_url;
			var drinkCategory = drinkObjects[i].secondary_category;
			console.log(drinkName);
			console.log(drinkImage);
			console.log(drinkCategory);
		}
	}
};


BBQApp.getRecipeData = function(meatSelected, veggieArray) {
	$.ajax({
		url: BBQApp.recipeApiUrl,
		data: {
			_app_key: BBQApp.recipeKey,
			_app_id: BBQApp.recipeID,
			// Currently searching for steak, will be changed to user input
			q: " barbeque" + meatSelected + veggieArray,
			// Below line will filter through, only showing results with pictures
			requirePictures: true,
			// Limiting the results to a set number
		    maxResult: 5
		},
		method: 'GET',
		dataType: 'json'
	})
	.then(function(res) {
		BBQApp.displayFoodResults(res);
		// console.log(res);
	}, function(err) {
		console.log(err)
	});
};


// Drink Finder variables, storing the Key and URL (which I've concatenated together)
BBQApp.drinksKey = 'MDo0NjQ5MjEzNC0yMWY4LTExZTYtYTIxNy01ZjMzOTgzMzVmODU6djFobWhkNTlrWFhnTVBPemI4VWZHUUlFZE5IQUtTSlJUYmE3';
BBQApp.drinksApiUrl = 'http://lcboapi.com/products';

// Drink Finder AJAX call
BBQApp.getDrinkData = function(drinkChoice) {
	$.ajax({
		url: BBQApp.drinksApiUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			// Currently searching for beer, will change according to user input
			q: drinkChoice,
			// Filtering the results per page below
			per_page: '10',
			// Being appended to the url
			access_key: BBQApp.drinksKey
		}
	})
	.then(function(res) {
		BBQApp.displayDrinkResults(res);
		console.log(res);
	}, function(err) {
		console.log(err)
	});
};

// INIT and DOCUMENT READY BELOW
BBQApp.init = function() {
	// Keep this clean, only call functions in here
	BBQApp.getUserSelection();
	// BBQApp.getDrinkData();
	// BBQApp.getRecipeData();
	// BBQApp.displayFoodResults();
}

$(document).ready(function (){
	BBQApp.init();
	console.log('TEST')
});