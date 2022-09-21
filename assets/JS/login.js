/* called in login.html. */
function login() {

    username = document.getElementById("user").value
    s = document.getElementById("role")
    role = s.options[s.selectedIndex].text
    

    users = JSON.parse(localStorage.getItem("users"))
    if (users == null) {
        users = {}
        user_id = 1
        users[username] = [user_id, role]
    } else {
        if ( !(username in users) ) {
            // if it's a new user
            user_id = Object.keys(users).length
            user_id += 1
            users[username] = [user_id, role]
        }
    }
    
    localStorage.setItem("curUser", username)
    localStorage.setItem("users", JSON.stringify(users))
}


/* Locate the comment in the video. Notice that the id is annotation id (not comment id)
@ annotId: a String.
*/
function locateComment(annotId) {

    // open annotation
    plugin.fire('openAnnotation', { id: annotId });
}