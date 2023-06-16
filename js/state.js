import {bookSearchResultDiv, bookMarkedDiv} from './render.js';
export const state = initState();

export function saveBookMark(book) {
    state.pochList[book.id] = book;
    sessionStorage.setItem('state', JSON.stringify(state));
}

export function removeBookMark(bookId) {
    delete state.pochList[bookId];
    sessionStorage.setItem('state', JSON.stringify(state));
}

export function isBookmarked(book){
    return state.pochList[book.id] != null ? true : false;
}

export function getBookmarkedBooks(){
    const books = [];
    for (var book in state.pochList) {
        books.push(state.pochList[book]);
    }
    return books;
}

function showErrorBookmarked(book){
    let alertMsg = `The book ${book.volumeInfo.title}, ID : ${book.id} is already bookmarked.`;
    alert(alertMsg);
}

export function handleBookmarkClick(book, sectionContent){
    if (sectionContent == bookSearchResultDiv) {
        isBookmarked(book) ? showErrorBookmarked(book) : saveBookMark(book);
        return;
    }
    if (sectionContent == bookMarkedDiv) {
        removeBookMark(book.id);
        return;
    }
}

function initState(){
    return sessionStorage.getItem('state') != null ? JSON.parse(sessionStorage.state) : {pochList: {}};
}