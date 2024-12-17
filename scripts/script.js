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



// Função para logar usuário
document.getElementById('loginForm').onsubmit = async function (event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log(email);
    console.log(password);

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (response.ok) {

        // localStorage.setItem('token', result.token);
        // localStorage.setItem('firstName', result.firstName);

        // showUserName(result.firstName);
        // loginModal.style.display = 'none';
        console.log("entrou");
    } else {
        alert(result.message);
    }
    // console.log(localStorage.getItem('token'));
    // console.log(localStorage.getItem('firstName'));
}
