const xhttp = new XMLHttpRequest();

let url = 'http://localhost:3000/GettingAllBooks';
// let token = localStorage.getItem('token');
// console.log(token);
xhttp.open("GET", url, true);
// xhttp.setRequestHeader('Authorization', 'bearer ' + token);
xhttp.onload = function(){
    const books = JSON.parse(xhttp.response);
    let bookString = `<h1>Books</h1>
    <table style="width:100%" id = 'table'> <tr><th>Book name</th><th>Author</th> <th>ISBN</th></tr>`;
    for (let book of books){
        bookString += '<tr><td>' + book.name + '</td> <td>' + book.author + '</td> <td>' + book.ISBN + '</td> </tr>';
    }
    bookString+= '</table>'
    document.getElementById("table").innerHTML = bookString;
}
xhttp.send();