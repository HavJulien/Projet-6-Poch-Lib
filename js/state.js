// sessionStorage.clear();
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

export function handleBookmarkClick(book){
    isBookmarked(book) ? removeBookMark(book.id) : saveBookMark(book);
}

function initState(){
    return sessionStorage.getItem('state') != null ? JSON.parse(sessionStorage.state) : {pochList: {}};
}