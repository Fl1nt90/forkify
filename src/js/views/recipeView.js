import View from './View';

import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
import { mark } from 'regenerator-runtime';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe'); //select the parent element to attach html
  _errorMessage = 'No recipes found for your query. Please try again!';
  _successMessage = '';

 

  //the PUBLISHER-SUBSCRIBER PATTERN fo events handler
  addHandlerRender(handler) { //event listener for recipes selection
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
//PUBLISHER FOR SERVINGS
  addHandlerUpdateServings(handler) { //event listener for SERVINGS
    this._parentElement.addEventListener('click', function(e){
      e.preventDefault();
    //event delegation
      const btn = e.target.closest('.btn--update-servings');

    //guard clause to prevent clicks outside the buttons 
      if (!btn) return;
    //retrieve serving from BUTTONS DATA ATTRIBUTE
      const updateTo = +btn.getAttribute('data-updateTo');
    //pass the desidered serving to the controller.js, which will re-render the recipe
      if (updateTo > 0) handler(updateTo);
    });
  }
//PUBLISHER FOR BOOKMARKS
  addHandlerAddBookmark(handler) { //event listener for SERVINGS
    this._parentElement.addEventListener('click', function(e){
      e.preventDefault();
    //event delegation
      const btn = e.target.closest('.btn--bookmark');
    //guard clause to prevent clicks outside the buttons 
      if (!btn) return;
      handler();
    });
  }


  //generate the HTML
  _generateMarkupIngredients(ing) {
    //refactor function for ingredients
    return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
             <div class="recipe__quantity">${
               ing.quantity ? fracty(ing.quantity).toString() : ''
             }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button data-updateTo="${this._data.servings - 1}" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-updateTo="${this._data.servings + 1}" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(ing => this._generateMarkupIngredients(ing))
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>`;
  }
} //prettier-ignore

//export (to controller.js) the object created from the class
export default new RecipeView();
