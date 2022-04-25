//icons are necessary to be imported also here
import icons from 'url:../../img/icons.svg';

export default class View {
  //the parent class that will be exported
  _data;

  //refactor code to clear container and insert HTML markup
  _clearAndIsert(markup) {
    //CANCEL INITIAL MESSAGE and  INSERT HTML MARKUP
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(msg = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>`;

    this._clearAndIsert(markup); //insert in the page
  }

  renderError(msg = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>`;

    this._clearAndIsert(markup); //insert in the page
  }

  render(data) {
    this._data = data; //receiving data from controller.js ans setting to private field #data

    const markup = this._generateMarkup(); //call function to render recipe
    this._clearAndIsert(markup); //insert in the page
  } //prettier-ignore

  update(data) { //the algorithm to update the DOM
    this._data = data; //also here we want to update the _data
  //only GENERATE the new markup (not render it this time)
    const newMarkup = this._generateMarkup();
  //convert the newMarkup (a string at the moment) to a virtual DOM object in the memory
    const newDom = document.createRange().createContextualFragment(newMarkup);
  //selecting all the elements in the newDom (and convert into an array)
    const newElements = Array.from(newDom.querySelectorAll('*'));
  //create a DOM object for the CURRENT ELEMENTS
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))
  //loop over the newElements to compare all the elements
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
    //replace the curEl with newEl TEXT, if different and if the element contain text
    if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
      curEl.textContent = newEl.textContent;
    }
    //replace DATA ATTRIBUTE
    if(!newEl.isEqualNode(curEl)) {
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value))
    }
    })
  } //prettier-ignore

  //render spinner
  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;

    this._clearAndIsert(markup); //insert in the page
  }
}
