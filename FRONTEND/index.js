
        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the form from submitting normally

            // Fetch form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Prepare data object for POST request
            const data = { email, password };

            try {
                // Send POST request to login API
                const response = await fetch('http://localhost:5000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                if (response.ok) {
                    alert('Login successful!'); // Inform user about successful login
                    // Save the token to localStorage or sessionStorage
                    localStorage.setItem('token', responseData.token);
                    
                    // Redirect to a protected page or dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    alert(responseData.error); // Display error message from server
                }
            } catch (error) {
                console.error('Error logging in:', error.message);
                alert('An error occurred. Please try again later.');
            }
        });
