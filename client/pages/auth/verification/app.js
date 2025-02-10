// Function to navigate without reloading
function navigate(event, path) {
    event.preventDefault();
    window.history.pushState({}, "", path);
    loadPage();
}

// Function to load content based on route
function loadPage() {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    console.log(pathSegments);
    // if (pathSegments[0] === "user" && pathSegments[1]) {
    //     const userId = pathSegments[1];
    //     const user = users[userId];

    //     if (user) {
    //         document.getElementById("app").innerHTML = `
    //             <h2>${user.name}</h2>
    //             <p>Age: ${user.age}</p>
    //             <p>Email: ${user.email}</p>
    //             <a href="/" onclick="navigate(event, '/')">Go Back</a>
    //         `;
    //     } else {
    //         document.getElementById("app").innerHTML = `<h2>User Not Found</h2>`;
    //     }
    // } else {
    //     document.getElementById("app").innerHTML = `<h2>Welcome to Home Page</h2>`;
    // }
}

// Listen for popstate (browser back/forward)
window.addEventListener("popstate", loadPage);
window.addEventListener("load", loadPage);