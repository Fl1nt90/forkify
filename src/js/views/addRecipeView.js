import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe Uploaded!';

  _window = document.querySelector('.add-recipe-window ');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  //initialize the class here, since methods won't be called by the external controller
  constructor() {
    super(); //copy everything from parent class
    this._addHandlerShowWindow(); //initialize the event listener for MODAL WINDOW
  }
  //create an external method, othewise problem using this keyword inside event listener
  toggleWindow() {
    this._overlay.classList.toggle('hidden'); //toggle method works best in these cases
    this._window.classList.toggle('hidden');
  }
  //the event listener to OPEN MODAL window
  _addHandlerShowWindow() {
    //OPEN MODAL window
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    //CLOSE MODAL window
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); //click on the page to close modal
  }

  //the event listener for UPLOAD button (upload the recipe)
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); //as usuale, to prevent page reloading
      const formData = [...new FormData(this)];
      const formDataObject = Object.fromEntries(formData);
      handler(formDataObject); //passing form retrieved data to the controller.js
    });
  }

  //the method to restore HTML code, after replacing it in the various renderError/renderSuccess
  restoreModal() {
    const markup = `
      <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST" required name="title" type="text" />
          <label>URL</label>
          <input
            value="https://android.hdblog.it/"
            required
            name="sourceUrl"
            type="text"
          />
          <label>Image URL</label>
          <input
            value="https://asroma2-cloudinary.corebine.com/asroma2-production/image/upload/c_fill,dpr_1.0,f_jpg,h_565,w_1080/v1/asroma2-prod/card_corporate_usxevp"
            required
            name="image"
            type="text"
          />
          <label>Publisher</label>
          <input value="TEST" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>`;

    this._clearAndIsert(markup);
  }
  /////////////////////
}

export default new AddRecipeView();
