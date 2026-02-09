 function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userInput = document.getElementById('userInput').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked');
            
            if (!role) {
                alert('Please select your role');
                return;
            }
            
            console.log('Login attempt:', {
                user: userInput,
                role: role.value
            });
            
            alert(`Login successful as ${role.value}!`);
        });

        // Auto-select first role on mobile for better UX
        if (window.innerWidth < 768) {
            document.getElementById('farmer').checked = true;
        }
    