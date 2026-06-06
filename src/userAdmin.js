// Imports communs
import apiRequest from './logique_front/fonctions/api.js';
import { message, formData } from './logique_front/fonctions/tools.js';
import config from './logique_front/config.js'
import { logout, tokenCheck } from './auth.js'


// Déclarations communes
// ...


// =================dashboard================
export async function users(){
    // Verification d'usage et de sécurité
    tokenCheck()
    const tokenData = JSON.parse(localStorage.getItem('token'));
    const userName = tokenData?.userName;
    const baliseName = document.querySelector('span.username')
    const baliseLogout = document.querySelector('button.logout')

    if(tokenData) {
        baliseName.innerText = `${userName}`
    } 
    
    baliseLogout.addEventListener('click', logout)
    //-----------------------------------
}