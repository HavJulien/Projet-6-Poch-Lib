const sectionBooks = document.querySelector("#myBooks");
import {bookSearchDiv, bookMarkedDiv, initializePage, renderBooks} from "./render.js";
import {callGoogleBooksAPI} from "./api.js";

initializePage();

