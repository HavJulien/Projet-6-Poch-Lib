import API_KEY_BOOKS from './apikey.js';

export async function callGoogleBooksAPI (inputTitle, inputAuthor, page) {
    if (inputTitle == "" && inputAuthor == "") return null;
    var formatReq = () => {
        let req = "https://www.googleapis.com/books/v1/volumes?q=";
        if (inputTitle != "") {
            req += "intitle:" +inputTitle + "+";
        }
        if (inputAuthor != "") {
            req += "inauthor:" + inputAuthor;
        }
        return req.charAt(req.length - 1) === '+' ? req.slice(0, -1) : req;
    }
    var startIndex = (page-1) * 10;

    var req = formatReq();
    req += "&startIndex=" + startIndex;
    req += "&key=" + API_KEY_BOOKS+ "&projection=full";

    const response = await fetch(req);
    var data = await response.json();
    return data;
};