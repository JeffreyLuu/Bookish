function readLogin(form){
    var username = form.username.value;
    var password = form.password.value;

    let xhttp = new XMLHttpRequest();
    const url = 'http://localhost:3000/CheckingDetails?username=' + username + '&password=' + password;
    xhttp.open("POST", url, true);
    xhttp.onload = function() {
        const token = JSON.parse(xhttp.response).token;
        const username = JSON.parse(xhttp.response).username;
        if (token){
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
        // const userurl = 'http://localhost:3000/User?authenticate=' + token;
            window.location.assign('http://localhost:3000/User');
        }
        else if (JSON.parse(xhttp.response).message){
            document.getElementById("list").innerHTML = JSON.parse(xhttp.response).message;
        }
        else {
            document.getElementById("list").innerHTML = 'Error occurred.';
        }
    }
    xhttp.send()
}