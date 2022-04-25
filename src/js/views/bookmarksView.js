import View from './View';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  //publisher event listener to render bookmarks as soob the page is loaded
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  //prettier-ignore
  _generateMarkup() {
  const id = window.location.hash.slice(1); //GET THE HASH and then the ID
    return this._data.map(book => //i will loop over every bookmark to render it
       ` <li class="preview">
            <a class="preview__link ${book.id === id ? 'preview__link--active' : ''}" href="#${book.id}">
              <figure class="preview__fig">
                <img src="${book.image}" alt="${book.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${book.title}</h4>
                <p class="preview__publisher">${book.publisher}</p>
                </div>
              </div>
            </a>
          </li> `
    ).join(''); //join all the results
  }
} //prettier-ignore

export default new BookmarksView();
