import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

//the PUBLISHER for events handler
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault(); //prevent default behaviour, otherwise page will reload
//using EVENT DELEGATION to listen for a click on the buttons. Will select their common parent
    const btn = e.target.closest('.btn--inline'); //NOW i need to know which button is pressed
//GUARD CLAUSE to avoid handle clicks in the whole container
    if (!btn) return;
    const goToPage = +btn.getAttribute('data-goto'); //get data attribute from clicked button and convert to number
 
    handler(goToPage); //pass the desired page to the controller.js
    });
  }



//prettier-ignore
  _generateMarkup() { 
  //compute number of the page, rounding to the closest higher integer
    const totPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
  //refactor actual page, because will be used used frequently
    const curPage = this._data.page;
    console.log(curPage);
    

  // Page 1, there are other pages
    if (curPage === 1 && totPages > 1) {
      return `      <button class="btn--inline pagination__btn--current">
            <span>${curPage}</span>
          
          </button>


      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    
  // any middle page
    if (curPage < totPages) {
      return ` <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> `
    }

  // Last Page
    if (curPage === totPages && totPages > 1) {
      return ` <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }

  //those three "if" covers all scenario already..otherwise, means we are of page 1 and no other pages
    return `` //don't want to show buttons, so return nothig!

  }
} //prettier-ignore

export default new PaginationView();
