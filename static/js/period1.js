let currentThreadId = null;

// Load Threads from API
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

// Open a Thread (Show Comments)
function openThread(id, title, content) {
    currentThreadId = id;
    document.getElementById("thread-title-display").innerText = title;
    document.getElementById("thread-content-display").innerText = content;
    document.getElementById("thread-details").style.display = "block";
    document.getElementById("thread-list").style.display = "none";
    document.getElementById("thread-form").style.display = "none";
    loadComments(id);
}

// Load Comments for a Thread

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

// Mark a Comment as Helpful
function markHelpful(commentId) {
    fetch(`/api/helpful/${commentId}`, { method: 'POST' })
        .then(response => response.json())
        .then(() => loadComments(currentThreadId)); // Reload comments
}

// Load Users
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

// Call loadUsers when the page loads
window.onload = function() {
    loadComments(currentThreadId); // Existing function to load comments
    loadUsers(); // Load users
};



// Create a New Thread
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

// Add a Comment to the Current Thread
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

// Close Thread View
function closeThread() {
    document.getElementById("thread-details").style.display = "none";
    document.getElementById("thread-list").style.display = "block";
    document.getElementById("thread-form").style.display = "block";
    currentThreadId = null;
}

// Load Threads on Page Load
document.addEventListener("DOMContentLoaded", loadThreads);

// Open a Thread (Show Comments)
function openThread(id, title, content) {
    currentThreadId = id;
    document.getElementById("thread-title-display").innerText = title;
    document.getElementById("thread-content-display").innerText = content;

    // Show thread details
    document.getElementById("thread-details").style.display = "block";

    // Hide thread list and form
    document.getElementById("thread-list").style.display = "none";
    document.getElementById("thread-form").style.display = "none";

    // Hide the "Threads" header
    document.getElementById("threads-header").style.display = "none";

    // Hide "Create a New Thread" section
    document.getElementById("create-thread-header").style.display = "none";

    loadComments(id);
}

// Close Thread View (Go Back to Threads)
function closeThread() {
    document.getElementById("thread-details").style.display = "none";
    document.getElementById("thread-list").style.display = "block";
    document.getElementById("thread-form").style.display = "block";

    // Show headers again
    document.getElementById("threads-header").style.display = "block";
    document.getElementById("create-thread-header").style.display = "block";

    currentThreadId = null;
}
let userListVisible = false; // State to track visibility

// Toggle User List Visibility
function toggleUserList() {
    const userList = document.getElementById("user-list");
    userListVisible = !userListVisible; // Toggle the visibility state

    if (userListVisible) {
        userList.style.display = "block"; // Show the user list
    } else {
        userList.style.display = "none"; // Hide the user list
    }
}

// Load Users
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

// Call loadUsers when the page loads
window.onload = function() {
    loadComments(currentThreadId); // Existing function to load comments
    loadUsers(); // Load users
};