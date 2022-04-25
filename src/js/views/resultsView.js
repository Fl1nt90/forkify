import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;
  _successMessage = '';

  //prettier-ignore
  _generateMarkup() {
  //get current id to conditionally add active class on selected recipe
  const id = window.location.hash.slice(1); //GET THE HASH and then the ID
    return this._data.map(res => //i will loop over every search result
       ` <li class="preview">
            <a class="preview__link ${res.id === id ? 'preview__link--active' : ''}" href="#${res.id}">
              <figure class="preview__fig">
                <img src="${res.image}" alt="${res.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${res.title}</h4>
                <p class="preview__publisher">${res.publisher}</p>
                </div>
                 <div class="preview__user-generated ${res.key ? '' : 'hidden'}">
                <svg>
                 <use href="${icons}#icon-user"></use>
                </svg>
               </div>
              </div>
            </a>
          </li> `
    ).join(''); //join all the results
  }
} //prettier-ignore

export default new ResultsView();
