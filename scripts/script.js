const loginModal = document.getElementById("loginModal");
// Função para registrar usuário
document.getElementById('registerForm').onsubmit = async function (event) {
    event.preventDefault();
    const firstName = document.getElementById('registerFirstName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, email, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        registerModal.style.display = 'none';
    } else {
        alert(result.message);
    }
}