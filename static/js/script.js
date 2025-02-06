let current_user = JSON.parse(localStorage.getItem('current_user'));

function changePage(link){
  window.location.href = link;
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
    return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function checkAccess() {
    console.log("yippee", current_user)
    if (current_user === null) {
        console.log("not good")
        window.location.href = '/login';
    } else {
        console.log('all good');
    }
}

function logoutUser() {
    current_user = null;
}