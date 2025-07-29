export function isAuthenticated() {
    // Implement your authentication logic here
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
}

export function setToken(token) {
    // implement your logic to set the token
    if (!token) {
        throw new Error('Token is required');
    }
    localStorage.setItem('token', token);
}

export function logout() {
    // implement your logic to remove the token
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to home page after logout
}