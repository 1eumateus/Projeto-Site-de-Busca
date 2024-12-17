document.getElementById('registerForm').onsubmit = async function (event) {
    event.preventDefault();

    const firstName = document.getElementById('registerFirstName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // console.log('Dados capturados do formulário:', { firstName, email, password, confirmPassword });

    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, email, password })
        });

        const result = await response.json();
        console.log('Resposta do servidor:', result);

        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.message || 'Erro ao registrar usuário');
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o servidor:', error);
    }
};
