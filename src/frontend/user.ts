const xhttpUser = new XMLHttpRequest();
let userToken = localStorage.getItem('token');
let username = localStorage.getItem('username');
let userUrl = 'http://localhost:3000/GettingUser?username=' + username;

// console.log(userToken);
xhttpUser.open("GET", userUrl, true);
xhttpUser.setRequestHeader('Authorization', 'bearer ' + userToken);
xhttpUser.onload = function(){
    document.getElementById("welcome").innerHTML = 'Welcome ' + username;
    let userTransaction = JSON.parse(xhttpUser.response);
    
    let transactionString = `<tr><th>Book name</th><th>Due Date</th></tr>`;
    for (let trans of userTransaction){
        transactionString += '<tr><td>' + trans.name + '</td> <td>' + trans['due_date'] + '</td> </tr>';
    }
    document.getElementById("borrowedBooks").innerHTML = transactionString
}
xhttpUser.send();