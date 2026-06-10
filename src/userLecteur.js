 // Imports communs
import apiRequest from './logique_front/fonctions/api.js';
import { message, formData, dateFormat, viewsNormalize } from './logique_front/fonctions/tools.js';
import config from './logique_front/config.js'
import {logout, tokenCheck} from './auth.js'
import Article from './logique_front/classes/Article.js'


// Déclarations communes
const tokenData = JSON.parse(localStorage.getItem('token'));
if(tokenData){
    tokenCheck()
}else{
    window.location.href = '/src/public/login.html';
}
const articlesRequest = await apiRequest(`${config}/articles/dashboard`, 'GET', 
    { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.token}`
    }
);    
const commentsRequest = await apiRequest(`${config}/comments`, 'GET', 
    { 'Content-Type': 'application/json' }
);    
const userName = tokenData?.userName;
const baliseName = document.querySelector('h2.username')
const baliseLogout = document.querySelector('button.logout')
if(tokenData) {
    baliseName.innerText = `${userName}`
} 
baliseLogout.addEventListener('click', logout)



// =================dashboard================
export async function profile(){
    console.log('Lecteur connecté !')
    const userMail = tokenData.userMail

    document.querySelector('.userMail').innerText = `${userMail}`

    // Update password
    async function updatePassword(e){
        e.preventDefault()
        const data = formData(e)

        const result = await apiRequest(`${config}/users/update-pwd`, 'PUT', 
            { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}`
            }, 
            data
        );

        if (result.success) {
            console.log('Modification réussie', result.data);
            console.log(e)
            message(
                result.status, 
                'Votre mot de passe a été modifié avec succès !',
                e.target,
                'beforebegin'
            )

            
        } else {
            console.error('Erreur', result.status, result.error);
            message(
                result.status, 
                'Une erreur s\'est produit !',
                e.target,
                'beforebegin'
            )
        }
    }
    document.querySelector('#password-form').addEventListener('submit', updatePassword)

    // Suppression de son compte
    async function deleteAccount(e){
        const userConfirmed = confirm('⚠️ Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est irréversible. Tous vos articles et commentaires seront supprimés.');

        if (!userConfirmed) {
            return;
        }

        const result = await apiRequest(`${config}/users/account`, 'DELETE', 
            { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}`
            }
        );

        if (result.success) {
            console.log('Suppression réussie');
            logout()
        } else {
            console.error('Erreur', result.status, result.error);
        }
    }
    document.querySelector('#delete-account-btn').addEventListener('click', deleteAccount)
}