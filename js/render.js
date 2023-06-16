/*
    Ce fichier contient les fonctions permettant de générer le rendu dynamique de la page.
*/

import {callGoogleBooksAPI} from "./api.js";
import {getBookmarkedBooks, handleBookmarkClick, isBookmarked} from "./state.js";


// Variables de la structure dynamique de la page
let bookFormDiv; // Section du formulaire de recherche
let bookSearchDiv; // Section globale des résultats de recherche
export let bookSearchResultDiv; // Section des livres recherchés
let bookPaginationNav; 
export let bookMarkedDiv;

// Variables de gestion de la pagination
let currentBooksSearched = null;
let maxBookPage;
let currentPage;


// Initialisation des variables de rendu
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

// Fonction de rendu de la pagination
function renderPagination () {
    if (currentBooksSearched == null) return;

    let offset = 2; // Nombre de pages affichées de chaque côté de la page courante
    bookPaginationNav.innerHTML = "";

    //Création du bouton Previous Page
    const prevButton = document.createElement("button");
    prevButton.id = "prev-button";
    prevButton.innerText = "<";
    prevButton.title = "Previous page";
    prevButton.value = (currentPage - 1) < 1 ? 1 : currentPage - 1;
    prevButton.classList.add("pagination__button");

    prevButton.addEventListener("click", async () => {
        renderNewResultByPage(prevButton.value)
    });

    //Création du bouton Next Page
    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.innerText = ">";
    nextButton.title = "Next page";
    nextButton.value = (currentPage + 1) > maxBookPage ? maxBookPage : currentPage + 1;
    nextButton.classList.add("pagination__button");

    nextButton.addEventListener("click", async () => {
        renderNewResultByPage(nextButton.value)
    });

    //On rajoute toujours le bouton Previous Page en premier
    bookPaginationNav.appendChild(prevButton);
    //On ajoute la page 1
    appendPageNumber(1);
    //On ajoute les ... si nécessaire
    if (currentPage > (offset+2)) addThreeDotsSpan();
    //On ajoute les pages entre la page 1 et la page courante en fonction de l'offset
    renderPaginationNumbers(offset);
    //On ajoute les ... si nécessaire
    if (currentPage < maxBookPage - (offset + 1)) addThreeDotsSpan();
    //On rajoute la dernière page
    appendPageNumber(maxBookPage);
    //On finit par le bouton Next Page
    bookPaginationNav.appendChild(nextButton);
}

// Fonction d'ajout des ... dans la pagination
function addThreeDotsSpan(){
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

// Fonction d'ajout des numéros de page dans la pagination
function renderPaginationNumbers (offset) {
    for (let i = 1; i <= maxBookPage; i++) {
        if (i === 1 || i === maxBookPage) continue;
        if (i < currentPage - offset || i > currentPage + offset){
            continue;
        }
        appendPageNumber(i);
    }
};

// Fonction de rendu des résultats de recherche en fonction de la page
async function renderNewResultByPage(pageNumber){
    const inputTitle = document.getElementById("title");
    const inputAuthor = document.getElementById("author");

    var data = await callGoogleBooksAPI(inputTitle.value, inputAuthor.value, pageNumber);
    
    currentBooksSearched = getBooks(data);
    currentPage = parseInt(pageNumber);

    setMaxPage(data);
    renderSearch(currentBooksSearched);
    renderPagination();
}

// Fonction de rendu de la recherche
function renderSearch(books){
    bookSearchDiv.innerHTML = "";
    const titleSearch = document.createElement("h2");
    titleSearch.innerText = "Résultats de la recherche";
    bookSearchDiv.appendChild(titleSearch);

    // Si aucun livre n'est trouvé, on affiche un message
    if (books == null){
        const noResult = document.createElement("p");
        noResult.innerText = "Aucun livre n’a été trouvé";
        bookSearchDiv.appendChild(noResult);
        return;
    }

    // On crée la section des résultats de recherche des livres
    bookSearchResultDiv = document.createElement("div");
    bookSearchResultDiv.classList.add("booklist");
    bookSearchDiv.appendChild(bookSearchResultDiv);

    // On affiche les livres trouvés
    renderBooks(books, bookSearchResultDiv);
}

// Renvoit le style du bouton de bookmark en fonction de la section dans laquelle il se trouve
function getBookmarkStyle(sectionContent){
    if (sectionContent === bookMarkedDiv) return ["fa-solid", "fa-trash"];
    if (sectionContent === bookSearchResultDiv) return ["fa-solid", "fa-bookmark"];
    return [""];
}

// Fonction de rendu des livres
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
        // Si l'image n'est pas disponible, on affiche une image par défaut
        imageElement.src = book.volumeInfo.imageLinks?.smallThumbnail ?? "./images/unavailable.png";

        //Titre
        const nomElement = document.createElement("h3");
        nomElement.innerText = "Titre : " + book.volumeInfo?.title ?? "Pas de titre";

        //Bookmark
        const bookmarkElement = document.createElement("i");
        bookmarkElement.classList.add(...bookmarkStyle);
        
        //Wrapper pour Titre et Bookmark -> Permet de les afficher sur la même ligne
        const divTitleWrapper = document.createElement("div");
        divTitleWrapper.classList.add("booklist__book__title");
        divTitleWrapper.appendChild(nomElement);
        divTitleWrapper.appendChild(bookmarkElement);

        //ID
        const idElement = document.createElement("h4");
        idElement.innerText = "ID : " + book.id;

        //Auteur
        const authorElement = document.createElement("h4");
        authorElement.innerText = "Auteur : " + book.volumeInfo.authors?.[0] ?? "Auteur inconnu";

        //Description
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

// Fonction de rendu du bouton d'ajout de livre
function renderButtonAddBook(){
    // Création du bouton d'ajout de livre
    const buttonAddBook = document.createElement("button");
    buttonAddBook.innerText = "Ajouter un livre";
    buttonAddBook.classList.add("searchDiv__button");
    bookFormDiv.appendChild(buttonAddBook);

    // Lors du clic sur le bouton, on affiche le formulaire d'ajout de livre
    buttonAddBook.addEventListener("click", () => {
        bookFormDiv.innerHTML = "";
        renderNewBookForm();
    });
}

// Fonction de rendu du formulaire de recherche de livre
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

    // Lors du clic sur le bouton de recherche, on affiche les résultats de la recherche à la page 1
    buttonSearch.addEventListener("click", async () => {
        renderNewResultByPage(1)
    });

    // Lors du clic sur le bouton d'annulation, on réinitialise la page
    buttonCancel.addEventListener("click", function () {
        bookFormDiv.innerHTML = "";
        bookSearchDiv.innerHTML = "";
        bookPaginationNav.innerHTML = "";
        currentBooksSearched = null;
        maxBookPage = null;
        renderButtonAddBook();
    });
}

// Fonction d'initialisation de la page
export function initializePage(){
    // On initialise les variables de rendu
    initVars();
    // On affiche seulement le bouton d'ajout de livre
    renderButtonAddBook();
    // On affiche les livres déjà bookmarkés
    renderBooks(getBookmarkedBooks(), bookMarkedDiv);
}

// Fonction de récupération des livres depuis le JSON de l'API
function getBooks(data){
    if (data == null) return null;
    return data["items"];
}

// Fonction pour définir le nombre de pages maximum
function setMaxPage(data){
    if (data == null){
        maxBookPage = 1;
        return;
    };
    // totalItems correspond au nombre de livres trouvés, valeur renvoyée par l'API
    maxBookPage = Math.ceil(data["totalItems"] / 10);
}

// Fonction pour définir la description d'un livre
function setDescription(text){
    if (text == null){
        return "Information manquante.";
    }
    // Si la description est trop longue, on la tronque
    if (text.length > 200){
        return text.substring(0, 200) + "...";
    }
    return text;
}
