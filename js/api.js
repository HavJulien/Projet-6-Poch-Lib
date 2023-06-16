import API_KEY_BOOKS from './apikey.js';

// Fonction qui appelle l'API Google Books
export async function callGoogleBooksAPI (inputTitle, inputAuthor, page) {
    // Si les deux champs sont vides, on ne fait rien car on ne peut pas faire de recherche
    if (inputTitle == "" && inputAuthor == "") return null;
    // Fonction qui formate la requête, on autorise un champ vide
    var formatReq = () => {
        let req = "https://www.googleapis.com/books/v1/volumes?q=";
        if (inputTitle != "") {
            req += "intitle:" +inputTitle + "+";
        }
        if (inputAuthor != "") {
            req += "inauthor:" + inputAuthor;
        }
        // Si le dernier caractère est un +, on le supprime
        return req.charAt(req.length - 1) === '+' ? req.slice(0, -1) : req;
    }
    // On calcule l'index de départ (page -1 car l'index google commence à 0)
    // Possible TODO : gérer le cas où la page est négative ou nulle (ne devrait pas arriver)
    var startIndex = (page-1) * 10;

    
    var req = formatReq();
    req += "&startIndex=" + startIndex;
    req += "&key=" + API_KEY_BOOKS+ "&projection=full";

    const response = await fetch(req);
    var data = await response.json();
    return data;
};