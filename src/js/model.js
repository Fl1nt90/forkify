import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export const state = {
  //the state containing all the app data
  recipe: {},
  search: {
    query: '', //include search query itself, will be usefull
    results: [], //empty array, will be filled after fetchig search result
    page: 1, //by default
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//refactor code to reassin property name
const createRecipeObject = function (data) {
  //destructure object
  const { recipe } = data.data;
  //this is just to reassing property names, as in the previous lecture
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //add the "key" property conditionnally. Not every recipe has it, but i want to preserve it in case
    ...(recipe.key && { key: recipe.key }),
  };
}; //prettier-ignore

//prettier-ignore
export const loadRecipe = async function (id) { //i HAVE TO PASS THE ID now
    try{
  const data = await AJAX(`${API_URL}/${id}?key=${KEY}`); //await and store the getJSON async function (promise)
//set data to the STATE, after reassign properties name
  state.recipe = createRecipeObject(data); 

//check if selected recipe was already in the bookmarks, and in case re-add bookmarked property
  if (state.bookmarks.some(book => book.id === id)) {
    state.recipe.bookmarked = true;
  } else state.recipe.bookmarked = false;

} catch (err) {
  throw err; //re-throw error for the controller.js module 
  }
}; //prettier-ignore

////////////////////////////
////////////////////////////

//prettier-ignore
export const loadSearchResult = async function (query) { //i HAVE TO PASS search query
    try{
  //store the "search query" into the stata.
      state.search.query = query;

  //API call
      const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); //await and store the getJSON async function (promise)

  //changing properties to every recipe/search result and store the resulting array into the state
      state.search.results = data.data.recipes.map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
    //add the "key" property conditionnally. Necessary to display user icon in the search results
          ...(rec.key && { key: rec.key }),
        };
      });
  //reset page results after loading the results to avoid bugs
      state.search.page = 1; 

} catch (err) {
  throw err; //re-throw error for the controller.js module 
  }
}; //prettier-ignore

export const getSearchResultsPage = function (page = state.search.page) {
  //by default is 1
  //STORE actual page in the "state", for future use
  state.search.page = page;

  //calculate start and end value for the slice method on search results
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage; //remember slice method doesn't include last value we pass
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    //loop over and manipulate quantities in the ingredients array
    ing => (ing.quantity = (ing.quantity / state.recipe.servings) * newServings)
  );
  //also update the servings in the state
  state.recipe.servings = newServings;
};

//localStorage store bookmarks
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); //first parameter is the KEY
};

export const addBookmark = function (recipe) {
  //add bookmark and check if the current recipe is already bookmarked
  state.bookmarks.push(recipe);

  //mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //find the index of the element i want to delete
  const index = state.bookmarks.findIndex(book => book.id === id);
  //delete element from array using splice method
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false; //and set to false bookmarked property

  persistBookmarks();
};

////
////

export const uploadRecipe = async function (newRecipe) {
  try {//necessary the try..catch block if i want to throw the error to the controller.js
    const ingredients = Object.entries(newRecipe)
    .filter(//FILTER first element starts with ingredients and second element is not empty
      entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {//loop over the second element, split by comma and delete whitespaces
      const ingArr = ing[1].replaceAll(' ', '').split(',');
    //CHECK IF USER INPUT IS CORRECT
      if(ingArr.length !== 3) throw new Error('Wrong ingredient format!')
//DESTRUCTURING
      const [quantity, unit, description] = ingArr;
// RETURN FROM THE MAP() METHOD, STILL INSIDE THE MAP() METHOD
    //NOTE: convert quantity to number and return "null" if quantity doesn't exist
      return { quantity: quantity ? +quantity : null, unit, description }; 
    });

//create the object to upload and format properties
const recipe = {
  title: newRecipe.title,
  source_url: newRecipe.sourceUrl,
  image_url: newRecipe.image,
  publisher: newRecipe.publisher,
  cooking_time: +newRecipe.cookingTime, //these have to be numbers
  servings: +newRecipe.servings,
  ingredients,
};

//FINALLY UPLOAD TO API. Remember to await and store the data sent back
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
//set data to the STATE, after reassign properties name
  state.recipe = createRecipeObject(data); 
//add just uploaded recipe to bookmarks
  addBookmark(state.recipe);
  } catch(err){
    throw(err) //re-throw the error for the controller.js
  };
}; //prettier-ignore

//////////////////
/////////////////

//localStorage GET bookmarks
const init = function () {
  const localStorageBookmarks = JSON.parse(localStorage.getItem('bookmarks')); //remember parse string
  if (localStorageBookmarks) state.bookmarks = localStorageBookmarks; //only if there are data
};
init(); //call the function as soon the page is loaded
