/**
 * @file authManager.js
 * @description Maneja la autenticación de usuarios.
 */

/**
 * @class AuthManager
 * @description Gestiona la autenticación de usuarios.
 */
export class AuthManager {
    /**
     * @constructor
     * @param {Object} supabase - Cliente de Supabase inicializado.
     */
    constructor(supabase) {
        this.supabase = supabase;
        this.loginBtn = document.getElementById('loginBtn');
        this.registerBtn = document.getElementById('registerBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.authModal = document.getElementById('authModal');
        this.authForm = document.getElementById('authForm');
        this.authFormTitle = document.getElementById('authFormTitle');
        this.nameInput = document.getElementById('name');
        this.nameDisplay = document.getElementById('nameDisplay');
        this.closeModalBtn = document.getElementById('closeAuthFormButton');
    }

    /**
     * @method initializeAuth
     * @description Inicializa los elementos de autenticación y añade event listeners.
     */
    initializeAuth() {
        this.loginBtn.addEventListener('click', () => {
            this.showAuthModal('login');
            this.authFormTitle.textContent = 'Iniciar sesión';
        });
        this.registerBtn.addEventListener('click', () => {
            this.showAuthModal('register');
            this.authFormTitle.textContent = 'Registrarse';
        });
        this.logoutBtn.addEventListener('click', () => this.logout());
        this.authForm.addEventListener('submit', (e) => this.handleAuth(e));
        this.closeModalBtn.addEventListener('click', () => this.authModal.style.display = 'none');
        this.authForm.addEventListener('click', (e) => e.stopPropagation());
        this.authModal.addEventListener('click', () => this.authModal.style.display = 'none');
        
        this.checkAuthStatus();
    }

    /**
     * @method checkAuthStatus
     * @description Verifica el estado de autenticación del usuario.
     */
    async checkAuthStatus() {
        localStorage.getItem('supabase.auth.token') && await this.supabase.auth.setSession(JSON.parse(localStorage.getItem('supabase.auth.token')));
        const { data: { user } } = await this.supabase.auth.getUser();
        if (user) {
            console.log(user);
            this.nameDisplay.innerHTML = `Hola, ${user?.identities?.[0]?.identity_data.username}`;
            this.nameDisplay.style.display = 'inline-flex';
            this.loginBtn.style.display = 'none';
            this.registerBtn.style.display = 'none';
            this.logoutBtn.style.display = 'inline';
        }
    }

    /**
     * @method showAuthModal
     * @description Muestra el modal de autenticación.
     * @param {string} type - Tipo de autenticación ('login' o 'register').
     */
    showAuthModal(type) {
        this.authModal.style.display = 'block';
        if (type === 'register') {
            this.nameInput.style.display = 'block';
        } else {
            this.nameInput.style.display = 'none';
        }
    }

    /**
     * @method handleAuth
     * @description Maneja el proceso de autenticación (login o registro).
     * @param {Event} e - Evento del formulario.
     */
    async handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = this.nameInput.value;

        if (this.nameInput.style.display === 'block') {
            // Registro
            await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, username: name })
            });
            alert('Registro exitoso. Por favor, verifica tu email.');
        } else {
            // Inicio de sesión
            const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert('Error en el inicio de sesión: ' + error.message);
            } else {
                alert('Inicio de sesión exitoso');
                this.authModal.style.display = 'none';
                this.checkAuthStatus();
                localStorage.setItem('supabase.auth.token', JSON.stringify(data));
            }
        }
    }

    /**
     * @method logout
     * @description Cierra la sesión del usuario.
     */
    async logout() {
        await this.supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        this.loginBtn.style.display = 'block';
        this.registerBtn.style.display = 'block';
        this.logoutBtn.style.display = 'none';
        this.nameDisplay.style.display = 'none';
    }
}