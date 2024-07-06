
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Fetch form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare data object for POST request
    const data = { username, email, password };

    try {
        // Send POST request to signup API
        const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Signup successful!'); // Inform user about successful signup
            // Redirect to the login page
            window.location.href = 'http://127.0.0.1:3001/index.html#';
        } else {
            alert(responseData.error); // Display error message from server
        }
    } catch (error) {
        console.error('Error signing up:', error.message);
        alert('An error occurred. Please try again later.');
    }
});