/*
    This file contains and manipulates the state of the application.
*/

import {bookSearchResultDiv, bookMarkedDiv} from './render.js';
export const state = initState();

// Adds the book to the state and saves it to the session storage
export function saveBookMark(book) {
    state.pochList[book.id] = book;
    sessionStorage.setItem('state', JSON.stringify(state));
}

// Removes the book from the state and saves it to the session storage
export function removeBookMark(bookId) {
    delete state.pochList[bookId];
    sessionStorage.setItem('state', JSON.stringify(state));
}

// Returns true if the book is bookmarked, false otherwise
export function isBookmarked(book){
    return state.pochList[book.id] != null ? true : false;
}

// Returns an array of all the bookmarked books
export function getBookmarkedBooks(){
    const books = [];
    for (var book in state.pochList) {
        books.push(state.pochList[book]);
    }
    return books;
}

// Alerts the user that the book is already bookmarked
function showErrorBookmarked(book){
    let alertMsg = `The book ${book.volumeInfo.title}, ID : ${book.id} is already bookmarked.`;
    alert(alertMsg);
}

// Handles the logic after a bookmark button is clicked
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

// Returns the state from the session storage if it exists, otherwise returns an empty state
function initState(){
    return sessionStorage.getItem('state') != null ? JSON.parse(sessionStorage.state) : {pochList: {}};
}