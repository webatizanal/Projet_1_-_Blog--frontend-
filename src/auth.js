import apiRequest from './logique_front/fonctions/api.js';
import { message, formData } from './logique_front/fonctions/tools.js';
import config from './logique_front/config.js'



/**
 * @param {SubmitEvent} e 
 */
async function login(e){ 
    e.preventDefault()   
    const form = e.currentTarget
    const data = formData(e)

    // signup
    const result = await apiRequest(`${config}/users/login`, 'POST', 
        { 'Content-Type': 'application/json' }, 
        data
    );

    if (result.success) {
        console.log('Inscription réussie', result.data);
        message(
            result.status, 
            'Connexion réussie !',
            form,
            'beforebegin'
        )

        const userId = result.dataResponse.userId
        const token = result.dataResponse.token
        const userRole = result.dataResponse.userRole
        const userName = result.dataResponse.userName
        const userMail = result.dataResponse.userMail

        window.localStorage.setItem('token', JSON.stringify({
            token: token,
            userId: userId,
            userRole: userRole,
            userName: userName,
            userMail: userMail
        }));
        // const tokenData = JSON.parse(localStorage.getItem('token'));
            
        if (userRole === 'admin') {
            window.location.href = '/src/admin/users';
        } else if (userRole === 'auteur'){
            window.location.href = '/src/user/dashboard';
        }else{
            window.location.href = '/src/lecteur/profile';
        }

    } else {
        console.error('Erreur', result.status, result.error);
        message(
            result.status, 
            'Connexion échouée !',
            form,
            'beforebegin'
        )
    }
}
// ================ DECLANCHEUR =================
export async function loginRequest() {
    const tokenData = localStorage.getItem('token');
    
    if (tokenData) {
        try {
            const { userRole } = JSON.parse(tokenData);
            let dashboardPath = '';
            
            if (userRole === 'admin') {
                dashboardPath = '/src/admin/users';
            } else if (userRole === 'auteur'){
                dashboardPath = '/src/user/dashboard';
            }else{
                dashboardPath = '/src/lecteur/profile';
            }

            console.log('Utilisateur connecté !')

            window.location.href = dashboardPath;
            return; // Important : on arrête l’exécution pour ne pas attacher l’écouteur
        } catch (e) {
            console.error('Token invalide', e);
            localStorage.removeItem('token');
        }
    }
    
    // Si pas de token ou token invalide, on attache l’écouteur
    const form = document.querySelector('#login-form');
    if (form) {
        form.addEventListener('submit', login);
    }
}

 
/**
 * @param {SubmitEvent} e 
 */
async function signup(e){
    console.log(e)
    e.preventDefault()   
    const form = e.currentTarget
    const data = formData(e)

    // 
    const result = await apiRequest(`${config}/users/signup`, 'POST', 
        { 'Content-Type': 'application/json' }, 
        data
    );

    if (result.success) {
        console.log('Inscription réussie', result.data);
        message(
            result.status, 
            'Connexion réussie !',
            form,
            'beforebegin'
        )

        window.location.href = '/src/public/login';
    } else {
        console.error('Erreur', result.status, result.error);
        message(
            result.status, 
            'Connexion échouée !',
            form,
            'beforebegin'
        )
    }
}
// ================ DECLANCHEUR =================
export async function logoutRequest (){
    document.querySelector('#register-form').addEventListener('submit', signup)
}


export function logout(){
    const tokenData = localStorage.getItem('token');

    if(tokenData){
        window.localStorage.removeItem('token')
    }

    window.location.href = '/src/public/login'
}


export async function tokenCheck() {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    if (!tokenData || !tokenData.token) {
        window.location.href = '/src/public/login';
        return;
    }

    const result = await apiRequest(`${config}/users/token`, 'GET', 
        { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.token}`
        }
    );

    if (result && result.valid) {
        console.log('Utilisateur connecté');
    } else {
        console.error('Token invalide');
        localStorage.removeItem('token');
        window.location.href = '/src/public/login';
    }
} 