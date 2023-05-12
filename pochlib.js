const sectionBooks = document.querySelector("#myBooks");

function initializePage(){
    baseHTML();
    showNewBookForm();
    showDivContent();
}

function baseHTML(){
    // Création d’une balise dédiée au titre Nouveau Livre
    const titleNewBook = document.createElement("h2");
    titleNewBook.innerText = "Nouveau Livre";
    titleNewBook.classList.add("h2");
    // On rattache la balise titleNewBook a la section Books
    sectionBooks.appendChild(titleNewBook);
}

function showDivContent(){
    // Création d'une balise dédiée au séparateur
    const separator = document.createElement("hr");
    // Création d'une balise dédiée au contenu
    const content = document.createElement("div");
    content.id = "content";
    // Création d'une balise dédiée au titre Ma poch'liste
    const titleMyBooks = document.createElement("h2");
    titleMyBooks.innerText = "Ma poch'liste";

    // On rattache la balise separator a la section Books
    sectionBooks.appendChild(separator);
    // On rattache la balise content a la section Books
    sectionBooks.appendChild(content);
    // On rattache la balise titleMyBooks a la section content
    content.appendChild(titleMyBooks);
}

function showAddBook(){
    // Création du bouton d'ajout de livre
    const buttonAddBook = document.createElement("button");
    buttonAddBook.innerText = "Ajouter un livre";
    // On rattache la balise buttonAddBook a la section Books
    sectionBooks.appendChild(buttonAddBook);

    buttonAddBook.addEventListener("click", function () {
        sectionBooks.innerHTML = "";
        baseHTML();
        showNewBookForm();
        showDivContent();
    });
}


function showNewBookForm(){
    //Création d'une balise dédiée au formulaire
    const formNewBook = document.createElement("form");
    formNewBook.id = "formNewBook";
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
    buttonSearch.setAttribute("type", "submit");

    //Création du bouton d'annulation
    const buttonCancel = document.createElement("button");
    buttonCancel.id = "cancel";
    buttonCancel.innerText = "Annuler";
    buttonCancel.setAttribute("type", "reset");

    // Rajout des éléments dans la page
    sectionBooks.appendChild(formNewBook);
    formNewBook.appendChild(labelTitle);
    formNewBook.appendChild(inputTitle);
    formNewBook.appendChild(labelAuthor);
    formNewBook.appendChild(inputAuthor);
    formNewBook.appendChild(buttonSearch);
    formNewBook.appendChild(buttonCancel);

    buttonCancel.addEventListener("click", function () {
        sectionBooks.innerHTML = "";
        baseHTML();
        showAddBook();
        showDivContent();
    });
}

document.querySelector("#myBooks").innerHTML = "";
initializePage();
