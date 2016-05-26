// Notes
// - we now need to focus on inputting the results on the page

// -- START --

// YUMMLY API CALL
var BBQApp = {
	// Empty object, will hold all of our Yummly and LCBO content
};
// Recipe Finder variables, storing the url, key and ID
BBQApp.recipeApiUrl = 'http://api.yummly.com/v1/api/recipes';
BBQApp.recipeKey = 'adb94000e8a9955814a483ef0ca4592b';
BBQApp.recipeID = '6cebcd5a';

BBQApp.getRecipeData = function (meatSelected, veggieArray) {
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
	}).then(function (res) {
		BBQApp.displayFoodResults(res);
		// console.log(res);
	}, function (err) {
		console.log(err);
	});
};

// Drink Finder variables, storing the Key and URL (which I've concatenated together)
BBQApp.drinksKey = 'MDo0NjQ5MjEzNC0yMWY4LTExZTYtYTIxNy01ZjMzOTgzMzVmODU6djFobWhkNTlrWFhnTVBPemI4VWZHUUlFZE5IQUtTSlJUYmE3';
BBQApp.drinksApiUrl = 'http://lcboapi.com/products';

// LCBO API call
BBQApp.getDrinkData = function (drinkChoice) {
	$.ajax({
		url: BBQApp.drinksApiUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			// Currently searching for beer, will change according to user input
			q: drinkChoice,
			// Filtering the results per page below
			per_page: '5',
			// Being appended to the url
			access_key: BBQApp.drinksKey
		}
	}).then(function (res) {
		BBQApp.displayDrinkResults(res);
		console.log(res);
	}, function (err) {
		console.log(err);
	});
};


// Get users meat choice and pass value to Ajax call
BBQApp.getUserSelection = function () {

	$('form').on('submit', function (e) {
		e.preventDefault();
		// meatSelected will be the value of what the user checked
		var meatSelected = $('input[name=meat]:checked').val();
		// And if it's equal to nothing, it will default to "vegetarian"
		if (typeof meatSelected === "undefined") {
			meatSelected = " vegetarian";
		};
		// console.log(meatSelected);
		// veggieSelected will be equal to what the user checked
		var veggieSelected = $('input[name=veggie]:checked');
		// Holding it in an empty array, since there could be multiple selections
		var veggieArray = [];
		veggieSelected.each(function (i, el) {
			// i is required the index of the element in the array
			// .each() is a jquery method
			// console.log(el);
			// We then push that value into the array
			veggieArray.push($(el).val());
		});
		console.log(veggieArray);
		// we collect multiple veggieSelected choices and put them in the veggieArray
		// and make them into a value
		var drinkSelected = $('input[name=drink]:checked').val();
		// $('input[name=drink]').on('click')
		console.log(drinkSelected);
		BBQApp.getRecipeData(meatSelected, veggieArray);
		// Once a recipe is generated, output a random drink from the LCBO API
		BBQApp.getDrinkData(drinkSelected);
	});
};

// Shuffle function, which will choose a random result 
BBQApp.shuffle = function (array) {
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

// Displaying results for food and drinks below
BBQApp.displayFoodResults = function (results) {
	// Yummly
	// recipeObjects goes into the object and stops at the "matches" key
	var recipeObjects = results.matches;
	// We then shuffle those results
	recipeObjects = BBQApp.shuffle(recipeObjects);
	if (recipeObjects.length > 0) {
		// loop through the results' length
		for (var i = 0; i < recipeObjects.length; i++) {
			// We store the recipes name in a variable
			var recipeName = recipeObjects[i].recipeName;
			// And the recipes image in a variable
			var recipeImage = recipeObjects[i].smallImageUrls[0].replace(/s90/g, 's250');
			// Also the link to the recipes url in a variable
			var recipeLink = "http://www.yummly.com/recipe/" + recipeObjects[i].id;
			// And finally we store the cooking time a variable
			var recipeCookTime = recipeObjects[i].totalTimeInSeconds / 60;
			// And we log the results
			// console.log(recipeName);
			// console.log(recipeImage);
			// console.log(recipeLink);
			// console.log(recipeCookTime);

			// Now we call the BBQApp.foodOntoPage() function, which will implement our content onto the page
			BBQApp.foodOntoPage(i, recipeName, recipeImage, recipeLink, recipeCookTime);
		}
	}
};

// BBQApp.foodOntoPage() will allow for us to implement our recipe items onto the page
BBQApp.foodOntoPage = function(i, recipeName, recipeImage, recipeLink, recipeCookTime) {
	// This if/else statement will allow for us to have a 'show more content' button
	if(i < 3) {
		$('.results').append('<div id="food-item' + i + '" class="food"></div>')
	}
	// Hiding the other 10, to be displayed later on
	else {
		$('.results').append('<div id="food-item' + i + '" class="food hidden"></div>')
	}
	// Add a div, then add an image as the background-image of that div
	$('#food-item' + i).append('<img src="' + recipeImage + '"/>');
	// And then a name
	$('#food-item' + i).append("<h2>" + recipeName + "</h2>");
	// Then a link
	$('#food-item' + i).append("<a target='_blank' href=" + recipeLink + ">" + "<p>View recipe</p>" + "</a>");
	// Then the cook time
	var foodDiv = $('#food-item' + i).append("<h5>Ready in " + recipeCookTime + " minutes</h5>");

	BBQApp.drinksOntoPage(foodDiv);
}

BBQApp.displayDrinkResults = function (results) {
	// LCBO
	// We go into the drinkObjects object and stop at the 'result' key
	var drinkObjects = results.result;
	// We then shuffle through it
	drinkObjects = BBQApp.shuffle(drinkObjects);
	if (drinkObjects.length > 0) {
		// loop through the results' length
		for (var i = 0; i < drinkObjects.length; i++) {
			// We store the drink name in a variable
			var drinkName = drinkObjects[i].name;
			// And the same for the category of drink
			var drinkCategory = drinkObjects[i].secondary_category;
			// We then log them
			console.log(drinkName);
			console.log(drinkImage);
			console.log(drinkCategory);
			// Now we call the BBQApp.drinksOntoPage() function, which will implement our content onto the page
			BBQApp.drinksOntoPage(drinkName);
		}
	}
};

 // BBQApp.drinksOntoPage() will allow for us to implement our recipe items onto the page
BBQApp.drinksOntoPage = function(i) {
	// And then a name
	$(i).append("<h1>" + drinkName[i] + "</h1>");
};


// INIT and DOCUMENT READY BELOW
BBQApp.init = function () {
	// Keep this clean, only call functions in here
	BBQApp.getUserSelection();
};

$(document).ready(function () {
	BBQApp.init();
	console.log('TEST');
});