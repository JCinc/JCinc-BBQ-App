'use strict';

// Notes
// Make an AJAX call that will loop through itself and the ingredient ID's
// That call will then return an array of the stores with that ID (item) in stock

// We also need to add an about section and smooth-scroll

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
			maxResult: 100
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

var ajaxCalls = function ajaxCalls(meatSelected, veggieSelected, veggieArray, drinkSelected) {
	return {
		getRecipeData: $.ajax({
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
		}),
		// LCBO API call
		getDrinkData: $.ajax({
			url: BBQApp.drinksApiUrl,
			method: 'GET',
			dataType: 'json',
			data: {
				// Currently searching for beer, will change according to user input
				q: drinkSelected,
				// Filtering the results per page below
				per_page: '100',
				// Being appended to the url
				access_key: BBQApp.drinksKey
			}
		})
	};
};
// LBCO Inventory variables
BBQApp.drinksInventory = 'http://lcboapi.com/stores';
BBQApp.storeIdAndName = [];

// obtain user postal code - var userlocation
// obtain product_ID
// check stores that have it

// PROMISES
// LCBO API CALL
BBQApp.getLCBO = function (userPostal) {
	$.ajax({
		url: BBQApp.drinksInventory,
		method: 'GET',
		dataType: 'json',
		data: {
			geo: userPostal,
			per_page: '5',
			access_key: BBQApp.drinksKey
		}
	}).then(function (res) {
		// console.log(res);
		BBQApp.nearestLCBO(res);
	});
};
// A call to get the inventory in our 5 closist LCBO's
BBQApp.getLCBOinventory = function (locationId) {
	$.ajax({
		url: BBQApp.drinksInventory + '/' + locationId + '/products/' + BBQApp.drinkId + '/inventory',
		method: 'GET',
		dataType: 'json',
		data: {
			access_key: BBQApp.drinksKey
		}
	}).then(function (res) {
		BBQApp.putLCBOOnPage(res.result.store_id);
	});
};

// Compare the objects returned in BBQApp.getLCBOinventory to the objects stored in BBQApp.storeIdAndName array

BBQApp.putLCBOOnPage = function (hasStock) {
	for (var i = 0; i < BBQApp.storeIdAndName.length; i++) {
		var finalStore = BBQApp.storeIdAndName[i].locationId;

		if (finalStore === hasStock) {
			console.log("success");
		}
	}
};

// Storing object items in a variable
BBQApp.nearestLCBO = function (location) {
	var locationObjects = location.result;
	for (var i = 0; i < locationObjects.length; i++) {
		var locationName = locationObjects[i].name;
		var locationAddressLine = locationObjects[i].address_line_1;
		var locationId = locationObjects[i].id;
		var store = { locationName: locationName, locationId: locationId, locationAddressLine: locationAddressLine };
		// console.log(locationId);
		var pushLocationObject = function pushLocationObject() {

			BBQApp.storeIdAndName.push(store);
		};
		pushLocationObject();
		BBQApp.getLCBOinventory(locationId);
	}
	console.log(BBQApp.storeIdAndName);
};
// Adding the search for postal onto the page

BBQApp.postalSearch = function () {
	$('.postalIntro').append('<h2>Find your nearest store</h2>');
	$('.postalSearch').append('<form class="postalCodeForm"><input type="text" placeholder="e.g. A1A1A1" id="txtPostalCode" maxlength="6"><button type="submit" class="btn" id="btnSearchStores">Search</button></form>');
	// On submit of the postal code, we store the result in a variable
	$('.postalCodeForm').on('submit', function (e) {
		e.preventDefault();
		var userPostal = $('input[id=txtPostalCode]').val();
		console.log(BBQApp.drinkId);
		BBQApp.getLCBO(userPostal);
	});
};

// Get users meat choice and pass value to Ajax call
BBQApp.getUserSelection = function () {

	$('form').on('submit', function (e) {
		e.preventDefault();
		// This will empty the results section on submit
		$('.results').empty();
		// $('.find').empty();
		// And the postal area will appear
		$('.find').removeClass('hide');
		// meatSelected will be the value of what the user checked
		var meatSelected = $('input[name=meat]:checked').val();
		// And if it's equal to nothing, it will default to "vegetarian"
		if (typeof meatSelected === "undefined") {
			meatSelected = " vegetarian";
		}
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
		// console.log(veggieArray);
		// we collect multiple veggieSelected choices and put them in the veggieArray
		// and make them into a value
		var drinkSelected = $('input[name=drink]:checked').val();

		// 	BBQApp.getMixedDrinkData();
		// }
		// else {	
		// 	BBQApp.getDrinkData(drinkSelected);
		// }
		// $('input[name=drink]').on('click')
		var dataCall = ajaxCalls(meatSelected, veggieSelected, veggieArray, drinkSelected);
		$.when(dataCall.getRecipeData, dataCall.getDrinkData).done(function (res1, res2) {
			console.log(res1);
			console.log(res2);
			BBQApp.displayFoodResults(res1[0]);
			BBQApp.displayDrinkResults(res2[0]);
		});
		console.log(drinkSelected);
		// getRecipeData(meatSelected, veggieArray);
		// Once a recipe is generated, output a random drink from the LCBO API
		// BBQApp.postalSearch();
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
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
};

// Displaying results for food and drinks below
BBQApp.displayFoodResults = function (results) {
	// Yummly
	// recipeObjects goes into the object and stops at the "matches" key
	var recipeObjects = results.matches;
	// console.log(results);
	// We then shuffle those results
	recipeObjects = BBQApp.shuffle(recipeObjects);
	if (recipeObjects.length > 0) {
		// loop through the results' length
		for (var i = 0; i < 1; i++) {
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
BBQApp.foodOntoPage = function (i, recipeName, recipeImage, recipeLink, recipeCookTime) {
	// This if/else statement will allow for us to have a 'show more content' button
	if (i < 3) {
		$('.results').append('<div id="food-item' + i + '" class="food"></div>');
	}
	// Hiding the other 10, to be displayed later on
	else {
			$('.results').append('<div id="food-item' + i + '" class="food hidden"></div>');
		}
	// Add a div, then add an image as the background-image of that div
	$('#food-item' + i).append('<img src="' + recipeImage + '"/>');
	// And then a name
	$('#food-item' + i).append("<h2>" + recipeName + "</h2>");
	// Then a link
	$('#food-item' + i).append("<a target='_blank' href=" + recipeLink + ">" + "<p>View recipe</p>" + "</a>");
	// Then the cook time
	var foodDiv = $('#food-item' + i).append("<p>Ready in " + recipeCookTime + " minutes</p>");

	// BBQApp.drinksOntoPage(foodDiv);
};

BBQApp.displayDrinkResults = function (results) {
	// LCBO
	// We go into the drinkObjects object and stop at the 'result' key
	var drinkObjects = results.result;
	console.log(drinkObjects);
	// We then shuffle through it
	drinkObjects = BBQApp.shuffle(drinkObjects);
	BBQApp.drinkOptions = [];
	if (drinkObjects.length > 0) {
		// loop through the results' length
		for (var i = 0; i < 1; i++) {
			// We store the drink name in a variable
			var drinkName = drinkObjects[i].name;

			BBQApp.drinkId = drinkObjects[i].id;

			// And the same for the category of drink
			var drinkLink = "http://www.lcbo.com/lcbo/search?searchTerm=" + BBQApp.drinkId;
			// We then log them
			// console.log(drinkName);
			// console.log(drinkLink);
			// Now we call the BBQApp.drinksOntoPage() function, which will implement our content onto the page
			// BBQApp.drinksOntoPage(i, drinkName);
			$('#food-item' + i).append("<h3>" + "Pairs this with: " + drinkName + "</h3>");
			$('#food-item' + i).append("<a href='" + drinkLink + "' target='_blank'>See LCBO's website</a>");
		}
	}
	BBQApp.postalSearch();
};

// INIT and DOCUMENT READY BELOW
BBQApp.init = function () {
	// Keep this clean, only call functions in here
	// BBQApp.getPostalCode();
	// BBQApp.getLCBOinventory();
	BBQApp.getUserSelection();
};

$(document).ready(function () {
	BBQApp.init();
});