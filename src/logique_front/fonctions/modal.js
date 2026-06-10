import apiRequest from '../fonctions/api.js';
import Article from '../classes/Article.js';
import config from '../config.js';
import { dateFormat } from '../fonctions/tools.js'

// Data
const articlesFetch = await apiRequest(`${config}/articles`, 'GET', { 'Content-Type': 'application/json' })
const articleContainer = document.querySelector('.article_modal_container-js')
const tpl = document.querySelector('#tpl').content

// Modal
const openSearchModal = document.querySelector('.searchModal')
const container = document.querySelector('.modal_container-js')
const wraper = document.querySelector('.modal_wrapper-js')
const resultCount = document.querySelector('.result_of_searching-js')
const closeModalButton = document.querySelector('.close_modal-js')

export async function modal() {
    // Gestion ouverture/fermeture
    function openModal(e) {
        document.body.classList.add('modal-open')
        container.removeAttribute('style')
        wraper.querySelector('input.inputSearch').focus()
    }
    function closeModal(e) {
        document.body.classList.remove('modal-open')
        container.setAttribute('style', 'display: none')
    }
    function stopPropagation(e) {
        e.stopPropagation()
    }

    openSearchModal.addEventListener('click', openModal)
    closeModalButton.addEventListener('click', closeModal)
    container.addEventListener('click', closeModal)
    wraper.addEventListener('click', stopPropagation)

    window.addEventListener('keydown', (event) => {
        // Vérifier que Control est enfoncé ET que la touche est 'k' (ou 'K')
        if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K')) {
            event.preventDefault(); 
            openModal(event);     
        } 

        if(event.key === 'Escape' || event.key === 'Esc'){
            event.preventDefault(); 
            closeModal(event)
        }
    });
    

    // Configuration d'affichage
    const showArticle = [
        [{ tagName: 'a' }, { contentType: 'href' }, { prop: '' }],
        [{ tagName: 'span.publishedAt' }, { contentType: 'text' }, { prop: 'date' }],
        [{ tagName: 'span.title' }, { contentType: 'text' }, { prop: 'title' }]
    ]

    function inSearching(e) {
        const input = e.target
        const searchValue = input.value.toLowerCase().trim()
        
        // Vider le conteneur AVANT la boucle
        articleContainer.innerHTML = ''
        
        if (searchValue === '') {
            resultCount.textContent = '0'
            return
        }

        let matchedCount = 0

        articlesFetch.forEach(article => {
            const titleMatch = article.title?.toLowerCase().includes(searchValue)
            const contentMatch = article.tags?.join(' ').toLowerCase().includes(searchValue)
            
            if (titleMatch || contentMatch) {
                matchedCount++
                // Créer une copie de l'article avec la date formatée
                const articleCopy = {
                    ...article,
                    date: dateFormat(article.publishedAt) // à adapter selon ta fonction
                }
                new Article(articleCopy, showArticle, tpl, articleContainer)
            }
        })

        resultCount.textContent = matchedCount
    }

    function debounce(callback, delay) {
        let timer
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(() => callback.apply(this, args), delay)
        }
    }

    const searchInput = document.querySelector('input.inputSearch')
    searchInput.addEventListener('click', stopPropagation)
    searchInput.addEventListener('input', debounce(inSearching, 300))
}