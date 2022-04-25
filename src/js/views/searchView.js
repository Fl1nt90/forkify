class SearchView {
  #parentElement = document.querySelector('.search'); //the search container

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {//method to get and return the value from the search field (child of .search container)
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  } //prettier-ignore

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); //prevent default behaviour, otherwise page will reload
      handler(); //the handler is passed by controller.js
    });
  }
} //prettier-ignore

export default new SearchView();
