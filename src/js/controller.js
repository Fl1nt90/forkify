//import from modules
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';

import 'core-js/stable';
import 'regenerator-runtime/runtime'; //this is to polyfill async/await
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';


////////////////////////////////////////////////////////////////////////////////////////////
//prettier-ignore
const controlRecipes = async function () {//function to controll recipe render
  try {
    const id = window.location.hash.slice(1); //GET THE HASH and then the ID

    if (!id) return; //guard clause in case page is loaded without any ID
    recipeView.renderSpinner(); //call imported render the spinner from recipeView

    //0) update results view with active class [301]
    resultsView.update(model.getSearchResultsPage());

    //1) FETCHING API MOVED TO model.js
    await model.loadRecipe(id); //remember this is an async function, so promise so need AWAIT

    /* -->data are fetched in the model.js, and set to the "state" -->"state" is the exported-imported
  in the controller.js, and i will take data from "state" and send to the recipeView.js to render
  the recipe */

    //2) rendering recipe
    recipeView.render(model.state.recipe); //passing data to recipeView CLASS

    //[303] update bookmarks container in order to highlight the current recipe/bookmark
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.log(err);
      recipeView.renderError();
}
}; //prettier-ignore

/////
/////

//prettier-ignore
const controlSearchResult = async function () {//function to control search
  try {
    const query = searchView.getQuery(); //get the query from searchView.js
    if (!query) return; //guard clause in case query search is empty
    resultsView.renderSpinner(); //call imported render the spinner from resultsView

  //FETCHING API to get search result
    await model.loadSearchResult(query); //remember this is an async function, so promise so need AWAIT
    const results = model.state.search.results; //STORE INTO A VARIABLE, EASIER

    //check if results array is not empty, otherwise render the error and stop the code
    if (!results || (Array.isArray(results) && results.length === 0)) 
      return resultsView.renderError(`No recipes found for <b>${query}</b>. Please try again!`);
  
  //call method to render results, passing the search results data.
    resultsView.render(model.getSearchResultsPage()); //fixed the bug in the model.js

  //PAGINATION BUTTONS /////////////////////////////////////////////////////////////////////////////
   paginationView.render(model.state.search); //render button and pass all the data i need

  } catch (err) {}
}; //prettier-ignore

////
////

const controlPagination = function (goToPage) { //receiving back clicked button data
//call method to render results, passing the search results data.
    resultsView.render(model.getSearchResultsPage(goToPage));
  //PAGINATION BUTTONS /////////////////////////////////////////////////////////////////////////////
    paginationView.render(model.state.search); //render button and pass all the data i need

    
}; //prettier-ignore

/////
/////

const controlServings = function (upadatedServings) { 
    model.updateServings(upadatedServings); //manipulate STATE in the model.js
  //then, render recipe again with updated servings and quantities
    recipeView.update(model.state.recipe); //passing data to recipeView CLASS
}; //prettier-ignore

/////
/////

const controlAddBookmark = function () {
//check to decide wheter add or delete the bookmark
  if (!model.state.recipe.bookmarked) { //if recipe is not already in the bookmarks, add to bookmarks
    model.addBookmark(model.state.recipe); 
  } else model.deleteBookmark(model.state.recipe.id); //otherwise, call function to delete (passing the ID)

  //update the bookmark button icon using the DOM algorithm
  recipeView.update(model.state.recipe);

//render the bookmars
  if (model.state.bookmarks.length === 0) { 
    bookmarksView.renderError();
  } else bookmarksView.render(model.state.bookmarks);

}; //prettier-ignore
/////
/////
const controlRenderBookmarks = function () {
  //render bookmars array at runtime, avoid bugs
  bookmarksView.render(model.state.bookmarks);
  /*check if there are no bookmarks and render error message (necessary because original HTML has 
    already been overwritten by the previous method call) */
  if (model.state.bookmarks.length === 0) bookmarksView.renderError();
};

const controlAddRecipe = async function (newRecipe) {// RECEIVE recipe data from the form from addRecipeView.js
  try {
    await model.uploadRecipe(newRecipe); //send data to the model.js that will upload to API  
  //render the just uploaded recipe and CLOSE THE MODAL WINDOW after DISPLAYING A MESSAGE
    recipeView.render(model.state.recipe);
  //show success message when uploading 
    addRecipeView.renderSuccess();
  //re-render bookmars panel (bookmarks container)
    bookmarksView.render(model.state.bookmarks);
  //HISTORY API (to change ID/mutate url/mutate link/change link/change url)
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

  //close modal window AND restore the form after display the success message
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.restoreModal(); 
    }, MODAL_CLOSE_SEC); //time constant in the configurator.js
    
  } catch(err) { //in case of error, display message, and re-display form to upload recipe after a while
    addRecipeView.renderError(err.message);
  //restore the form after display the error message
    setTimeout(function () {
     addRecipeView.restoreModal(); 
    }, MODAL_CLOSE_SEC); //time constant in the configurator.js

  }
}; //prettier-ignore

//[293] the PUBLISH-SUBSCRIBER pattern
const init = function () {
  bookmarksView.addHandlerRender(controlRenderBookmarks); //has to be the first
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe); //submit recipe handler
};

//initialize the SUBSCRIBER
init();


console.log('diouija');
