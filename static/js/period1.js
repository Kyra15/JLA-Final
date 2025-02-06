let currentThreadId = null;

// loads threads from API
function loadThreads() {
    fetch('/api/threads')
        .then(response => response.json())
        .then(data => {
            const threadList = document.getElementById("thread-list");
            threadList.innerHTML = "";
            data.forEach(thread => {
                const div = document.createElement("div");
                div.classList.add("thread");
                div.innerHTML = `<strong>${thread.title}</strong>`;
                div.onclick = () => openThread(thread.id, thread.title, thread.content);
                threadList.appendChild(div);
            });
        });
}

// opens a thread (comments)
function openThread(id, title, content) {
    currentThreadId = id;
    document.getElementById("thread-title-display").innerText = title;
    document.getElementById("thread-content-display").innerText = content;
    document.getElementById("thread-details").style.display = "block";
    document.getElementById("thread-list").style.display = "none";
    document.getElementById("thread-form").style.display = "none";
    loadComments(id);
}

// loads comments for the elected thread

function loadComments(threadId) {
    fetch(`/api/comments/${threadId}`)
        .then(response => response.json())
        .then(data => {
            const commentList = document.getElementById("comment-list");
            commentList.innerHTML = "";
            data.forEach(comment => {
                const div = document.createElement("div");
                div.classList.add("comment");
                div.innerHTML = `
                    <p>${comment.content}</p>
                    <button class="button" style="background-color: #fe9fab; border: 0" onclick="markHelpful(${comment.id})">This is helpful (${comment.helpful_count})</button>
                `;
                commentList.appendChild(div);
            });
        });
}

// helpful marker buttong
function markHelpful(commentId) {
    fetch(`/api/helpful/${commentId}`, { method: 'POST' })
        .then(response => response.json())
        .then(() => loadComments(currentThreadId)); // reloads comments
}

//loads user list
function loadUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById("users");
            userList.innerHTML = ""; // clears current users
            data.forEach(user => {
                const li = document.createElement("li");
                li.innerHTML = `${user.name} (${user.role}) - ${user.email}`;
                userList.appendChild(li);
            });
        });
}

// calls load users when the page loads
window.onload = function() {
    loadComments(currentThreadId); 
    loadUsers(); 
};



// creates a new thread
document.getElementById("thread-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("thread-title").value;
    const content = document.getElementById("thread-content").value;

    fetch('/api/add_thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(() => {
        loadThreads();
        document.getElementById("thread-title").value = "";
        document.getElementById("thread-content").value = "";
    });
});

// adds a comment to thread
document.getElementById("comment-form").addEventListener("submit", function(event) {
    event.preventDefault();
    if (currentThreadId === null) return;

    const content = document.getElementById("comment-content").value;

    fetch(`/api/add_comment/${currentThreadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(() => {
        loadComments(currentThreadId);
        document.getElementById("comment-content").value = "";
    });
});

// closes thread
function closeThread() {
    document.getElementById("thread-details").style.display = "none";
    document.getElementById("thread-list").style.display = "block";
    document.getElementById("thread-form").style.display = "block";
    currentThreadId = null;
}

// loads threads
document.addEventListener("DOMContentLoaded", loadThreads);

// opens a thread
function openThread(id, title, content) {
    currentThreadId = id;
    document.getElementById("thread-title-display").innerText = title;
    document.getElementById("thread-content-display").innerText = content;
    document.getElementById("thread-details").style.display = "block";
    document.getElementById("thread-list").style.display = "none";
    document.getElementById("thread-form").style.display = "none";
    document.getElementById("threads-header").style.display = "none";
    document.getElementById("create-thread-header").style.display = "none";

    loadComments(id);
}

// closes a thread
function closeThread() {
    document.getElementById("thread-details").style.display = "none";
    document.getElementById("thread-list").style.display = "block";
    document.getElementById("thread-form").style.display = "block";

    document.getElementById("threads-header").style.display = "block";
    document.getElementById("create-thread-header").style.display = "block";

    currentThreadId = null;
}
let userListVisible = false;

// toggles user visibility
function toggleUserList() {
    const userList = document.getElementById("user-list");
    userListVisible = !userListVisible; 

    if (userListVisible) {
        userList.style.display = "block"; 
    } else {
        userList.style.display = "none";
    }
}


function loadUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById("users");
            userList.innerHTML = ""; // Clear existing users
            data.forEach(user => {
                const li = document.createElement("li");
                li.innerHTML = `${user.name} (${user.role}) - ${user.email}`;
                userList.appendChild(li);
            });
        });
}

window.onload = function() {
    loadComments(currentThreadId); 
    loadUsers(); 
};

// back up functions /\
