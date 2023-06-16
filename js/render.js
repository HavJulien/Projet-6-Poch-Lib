import {callGoogleBooksAPI} from "./api.js";
import {getBookmarkedBooks, handleBookmarkClick, isBookmarked} from "./state.js";


// Structure HTML du rendu dynamique de la page
let bookFormDiv;
let bookSearchDiv;
export let bookSearchResultDiv;
let bookPaginationNav;
export let bookMarkedDiv;

// Variables de gestion de la pagination
let currentBooksSearched = null;
let maxBookPage;
let currentPage;

function initVars(){
    const hr = document.querySelectorAll("hr")[0];
    bookFormDiv = document.createElement("div");
    hr.parentElement.insertBefore(bookFormDiv, hr);

    bookSearchDiv = document.createElement("div");
    hr.parentElement.insertBefore(bookSearchDiv, hr.nextSibling);
    bookPaginationNav = document.createElement("nav");
    bookPaginationNav.classList.add("pagination");
    bookSearchDiv.parentNode.insertBefore(bookPaginationNav, bookSearchDiv.nextSibling);

    const h2Content = document.querySelectorAll("#content h2")[0];
    bookMarkedDiv = document.createElement("div");
    bookMarkedDiv.classList.add("booklist");
    h2Content.parentNode.insertBefore(bookMarkedDiv, h2Content.nextSibling);
}

function renderPagination () {
    let offset = 2;
    bookPaginationNav.innerHTML = "";
    if (currentBooksSearched == null) return;

    const prevButton = document.createElement("button");
    prevButton.id = "prev-button";
    prevButton.innerText = "<";
    prevButton.title = "Previous page";
    prevButton.value = (currentPage - 1) < 1 ? 1 : currentPage - 1;
    prevButton.classList.add("pagination__button");
    prevButton.addEventListener("click", async () => {
        renderNewResultByPage(prevButton.value)
    });

    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.innerText = ">";
    nextButton.title = "Next page";
    nextButton.value = (currentPage + 1) > maxBookPage ? maxBookPage : currentPage + 1;
    nextButton.classList.add("pagination__button");

    nextButton.addEventListener("click", async () => {
        renderNewResultByPage(nextButton.value)
    });

    var span = document.createElement("span");
    span.innerText = "...";

    bookPaginationNav.appendChild(prevButton);
    appendPageNumber(1);
    if (currentPage > 3) addSpan();
    renderPaginationNumbers(offset);
    if (currentPage < maxBookPage - 2) addSpan();
    appendPageNumber(maxBookPage);
    bookPaginationNav.appendChild(nextButton);
}

function addSpan(){
    var span = document.createElement("span");
    span.innerText = "...";
    bookPaginationNav.appendChild(span);
}

function appendPageNumber(index) {
    const pageNumber = document.createElement("button");
    pageNumber.innerHTML = index;
    pageNumber.value = index;
    pageNumber.classList.add("pagination__button");
    if (pageNumber.value == currentPage) {
        pageNumber.classList.add("pagination__button--active");
    }
    bookPaginationNav.appendChild(pageNumber);

    pageNumber.addEventListener("click", async () => {
        renderNewResultByPage(pageNumber.value)
    });
}

async function renderNewResultByPage(pageNumber){
    const inputTitle = document.getElementById("title");
    const inputAuthor = document.getElementById("author");
    var data = await callGoogleBooksAPI(inputTitle.value, inputAuthor.value, pageNumber);
    setMaxPage(data);
    currentBooksSearched = getBooks(data);
    renderSearch(currentBooksSearched);
    currentPage = parseInt(pageNumber);
    renderPagination();
}

function renderPaginationNumbers (offset) {
    for (let i = 1; i <= maxBookPage; i++) {
        if (i === 1 || i === maxBookPage) continue;
        if (i < currentPage - offset || i > currentPage + offset){
            continue;
        }
        appendPageNumber(i);
    }
};

function renderSearch(books){
    if (books == null) return;

    bookSearchDiv.innerHTML = "";
    const titleSearch = document.createElement("h2");
    titleSearch.innerText = "Résultats de la recherche";
    bookSearchDiv.appendChild(titleSearch);

    if (books == null){
        const noResult = document.createElement("p");
        noResult.innerText = "Aucun livre n’a été trouvé";
        bookSearchDiv.appendChild(noResult);
        return;
    }
    bookSearchResultDiv = document.createElement("div");
    bookSearchResultDiv.classList.add("booklist");
    bookSearchDiv.appendChild(bookSearchResultDiv);

    renderBooks(books, bookSearchResultDiv);
}

function getBookmarkStyle(sectionContent){
    if (sectionContent === bookMarkedDiv) return ["fa-solid", "fa-trash"];
    if (sectionContent === bookSearchResultDiv) return ["fa-solid", "fa-bookmark"];
    return [""];
}

function renderBooks(books, sectionContent){
    sectionContent.innerHTML = "";
    if (books == null) return;

    let bookmarkStyle = getBookmarkStyle(sectionContent);
    console.log(bookmarkStyle);
    // Récupération des données
    for (let i = 0; i < books.length; i++) {

        const book = books[i];
        
        // Création d’une balise dédiée à un livre
        const bookElement = document.createElement("article");
        bookElement.classList.add("booklist__book");

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = book.volumeInfo.imageLinks?.smallThumbnail ?? "./images/unavailable.png";

        const nomElement = document.createElement("h3");
        nomElement.innerText = "Titre : " + book.volumeInfo?.title ?? "Pas de titre";

        const bookmarkElement = document.createElement("i");
        bookmarkElement.classList.add(...bookmarkStyle);
        
        const divTitleWrapper = document.createElement("div");
        divTitleWrapper.classList.add("booklist__book__title");
        divTitleWrapper.appendChild(nomElement);
        divTitleWrapper.appendChild(bookmarkElement);
        const idElement = document.createElement("h4");
        idElement.innerText = "ID : " + book.id;

        const authorElement = document.createElement("h4");
        authorElement.innerText = "Auteur : " + book.volumeInfo.authors?.[0] ?? "Auteur inconnu";

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = setDescription(book.volumeInfo?.description);
        
        // On rattache la balise book a la section Fiches
        sectionContent.appendChild(bookElement);
        bookElement.appendChild(divTitleWrapper);
        bookElement.appendChild(idElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(descriptionElement);
        bookElement.appendChild(imageElement);

        bookmarkElement.addEventListener("click", () => {
            handleBookmarkClick(book, sectionContent);
            renderBooks(getBookmarkedBooks(), bookMarkedDiv);
        });

     }
}

function renderButtonAddBook(){
    // Création du bouton d'ajout de livre
    const buttonAddBook = document.createElement("button");
    buttonAddBook.innerText = "Ajouter un livre";
    buttonAddBook.classList.add("searchDiv__button");
    // On rattache la balise buttonAddBook a la section Books
    bookFormDiv.appendChild(buttonAddBook);

    buttonAddBook.addEventListener("click", () => {
        bookFormDiv.innerHTML = "";
        renderNewBookForm();
    });
}

function renderNewBookForm(){
    //Création d'une balise dédiée au formulaire
    const formNewBook = document.createElement("form");
    formNewBook.classList.add("searchDiv__form");
    //Création d'une balise dédiée au label du titre
    const labelTitle = document.createElement("label");
    labelTitle.innerText = "Titre";
    labelTitle.setAttribute("for", "title");
    //Création d'une balise dédiée au champ du titre
    const inputTitle = document.createElement("input");
    inputTitle.id = "title";
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("name", "title");
    inputTitle.setAttribute("placeholder", "Titre du livre");
    //Création d'une balise dédiée au label de l'auteur
    const labelAuthor = document.createElement("label");
    labelAuthor.innerText = "Auteur";
    labelAuthor.setAttribute("for", "author");
    //Création d'une balise dédiée au champ de l'auteur
    const inputAuthor = document.createElement("input");
    inputAuthor.id = "author";
    inputAuthor.setAttribute("type", "text");
    inputAuthor.setAttribute("name", "author");
    inputAuthor.setAttribute("placeholder", "Auteur du livre");

    //Création du bouton de recherche
    const buttonSearch = document.createElement("button");
    buttonSearch.innerText = "Rechercher";
    buttonSearch.id = "search";
    buttonSearch.setAttribute("type", "button");
    buttonSearch.classList.add("searchDiv__button");


    //Création du bouton d'annulation
    const buttonCancel = document.createElement("button");
    buttonCancel.id = "cancel";
    buttonCancel.innerText = "Annuler";
    buttonCancel.setAttribute("type", "reset");
    buttonCancel.classList.add("searchDiv__button", "searchDiv__button--red");



    // Rajout des éléments dans la page
    bookFormDiv.appendChild(formNewBook);
    formNewBook.appendChild(labelTitle);
    formNewBook.appendChild(inputTitle);
    formNewBook.appendChild(labelAuthor);
    formNewBook.appendChild(inputAuthor);
    formNewBook.appendChild(buttonSearch);
    formNewBook.appendChild(buttonCancel);

    buttonSearch.addEventListener("click", async () => {
        renderNewResultByPage(1)
    });

    buttonCancel.addEventListener("click", function () {
        bookFormDiv.innerHTML = "";
        bookSearchDiv.innerHTML = "";
        bookPaginationNav.innerHTML = "";
        currentBooksSearched = null;
        maxBookPage = null;
        renderButtonAddBook();
    });
}

export function initializePage(){
    initVars();
    renderButtonAddBook();
    renderBooks(getBookmarkedBooks(), bookMarkedDiv);
}


function getBooks(data){
    if (data == null) return null;
    return data["items"];
}

function setMaxPage(data){
    if (data == null){
        maxBookPage = 1;
        return;
    };
    maxBookPage = Math.ceil(data["totalItems"] / 10);
}

function setDescription(text){
    if (text == null){
        return "Information manquante.";
    }
    if (text.length > 200){
        return text.substring(0, 200) + "...";
    }
    return text;
}
