

// Imports (communs à tout le projet)
import apiRequest from './logique_front/fonctions/api.js';
import config from './logique_front/config.js';
import { top, recently, readTimeNormalize, message, dateFormat } from './logique_front/fonctions/tools.js';
import Article from './logique_front/classes/Article.js';
import Pagination from './logique_front/classes/Pagination.js';

// Déclarations (communs à tout le projet)
const articlesFetch = await apiRequest(`${config}/articles`, 'GET', {'Content-Type': 'application/json'})
const categoriesFetch = await apiRequest(`${config}/categories`, 'GET', {'Content-Type': 'application/json'})
const commentsFetch = await apiRequest(`${config}/comments`, 'GET', {'Content-Type': 'application/json'})
const partnershipFetch = await apiRequest(`${config}/partnerships`, 'GET', {'Content-Type': 'application/json'})
const staffFetch = await apiRequest(`${config}/staff`, 'GET', {'Content-Type': 'application/json'})
const statsFetch = await apiRequest(`${config}/users/stats`, 'GET', {'Content-Type': 'application/json'})

// ==================== PAGE HOME ====================
export async function home() {
    // Déclarations
    const laUneContainer = document.querySelector('.la_une_container-js')
    const laUneTpl = document.querySelector('#la_une_article-js').content
    const catContainer = document.querySelector('.category_container-js')
    const catElement = document.querySelector('#category_element-js').content
    const recentArticleContainer = document.querySelector('.recent_article_container-js')
    const recentArticleElement = document.querySelector('#recent_article_element-js').content
    const commentElement = document.querySelector('#comment_element-js').content
    const commentContainer = document.querySelector('.comment_container-js')
    const newsLetterForm = document.querySelector('#newsletter-form')
    const partnershipElement = document.querySelector('#partnership_element-js').content
    const partnershipContainer = document.querySelector('.partnership_container-js')

    // Les chiffres
    const articlesPub = document.querySelector('.articlesPub')
    articlesPub.innerText = statsFetch.articlesPublished
    const lecteurs = document.querySelector('.lecteurs')
    lecteurs.innerText = statsFetch.lecteurs
    const authors = document.querySelector('.auteurs')
    authors.innerText = statsFetch.auteurs

    // Les articles à la une
    const laUne = top(5, 'views', articlesFetch)  // Avant d'appeler cette fonction on doit recupere sur une periode, les articles recents
    const showStatsLaune = [
        [ {tagName : 'a'}, {contentType : 'href'}, {prop : ''} ],
        [ {tagName : 'img'}, {contentType : 'src'}, {prop : 'featuredImage'} ],
        [ {tagName : 'h3'}, {contentType : 'text'}, {prop : 'title'} ],
        [ {tagName : 'p.resume'}, {contentType : 'text'}, {prop : 'excerpt'} ]
    ]
    Array.from(laUne).forEach((art)=>{
        new Article(art, showStatsLaune, laUneTpl, laUneContainer)
    })
    laUneContainer.firstElementChild.classList.add('md:col-span-2', 'md:row-span-2') // forcer le premier a prendre 2 colonnes et 2 lignes


    // création des categories
    categoriesFetch.forEach((cat)=>{
        const newCatTpl = catElement.cloneNode(true);
        const slug = cat.name.toLowerCase().replace(/\s+/g, '-');

        const link = newCatTpl.querySelector('a');

        if (link) {
            link.setAttribute('href', `/src/public/category.html?id=${slug}`);
            link.textContent = cat.name;
        }

        catContainer.appendChild(newCatTpl);
    })

    // les aticles recents  
    const recentArticles = recently(6, articlesFetch)
    const showStatsRecently = [
        [ {tagName : 'a'}, {contentType : 'href'}, {prop : ''} ],
        [ {tagName : 'img'}, {contentType : 'src'}, {prop : 'featuredImage'} ],
        [ {tagName : 'span.cat'}, {contentType : 'text'}, {prop : 'categoryId'}, {sousProp : 'name'} ],
        [ {tagName : 'span.readTime'}, {contentType : 'text'}, {prop : 'readingTime'} ],
        [ {tagName : 'h2'}, {contentType : 'text'}, {prop : 'title'} ],
        [ {tagName : 'p.resume'}, {contentType : 'text'}, {prop : 'excerpt'} ]
    ]
    recentArticles.forEach((a)=> {
        new Article(a, showStatsRecently, recentArticleElement, recentArticleContainer)
    })
    readTimeNormalize(recentArticleContainer, '.recent_article_element', 'span.readTime')                               


    // Abonnment au newsletter
    const subscription = async function (e){
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const result = await apiRequest(`${config}/newsletter`, 'POST', 
            { 'Content-Type': 'application/json' }, 
            { email: formData.get('email') }
        );

        if (result.success) {
            console.log('Inscription réussie', result.data);
            message(
                result.status, 
                'Votre abonnement a été un succès. <br> Merci de votre interêt !',
                newsLetterForm,
                'beforebegin'
            )
        } else {
            console.error('Erreur', result.status, result.error);
            message(
                result.status, 
                'Votre abonnement a malheureusement échoué. <br> Merci d\'essayer à nouveau interêt !',
                newsLetterForm,
                'beforebegin'
            )
        }
    }
    newsLetterForm.addEventListener('submit', subscription)


    // Les commentaires
    const showStatsComment = [
        [ {tagName : 'p.auteur'}, {contentType : 'text'}, {prop : 'userId'}, {sousProp : 'username'} ],
        [ {tagName : 'p.message'}, {contentType : 'text'}, {prop : 'content'} ]
    ]
    commentsFetch.forEach((a)=> {
        new Article(a, showStatsComment, commentElement, commentContainer)
    })

    // Partnerships
    const showStatsPartnership = [
        [ {tagName : 'img'}, {contentType : 'src'}, {prop : 'logoUrl'} ],
        [ {tagName : 'span.name'}, {contentType : 'text'}, {prop : 'name'} ]
    ]
    partnershipFetch.forEach((a)=> {
        new Article(a, showStatsPartnership, partnershipElement, partnershipContainer)
    })
}

// ==================== PAGE CATEGORY ====================
export async function category() {
    const articleContainer = document.querySelector('.recent_article_container-js')
    const articleElement = document.querySelector('#recent_article_element-js').content
    const showStatsaAticleByCat = [
        [ {tagName : 'a'}, {contentType : 'href'}, {prop : ''} ],
        [ {tagName : '#idArticle'}, {contentType : 'data-categoryid'}, {prop : ''} ],
        [ {tagName : '#idArticle'}, {contentType : 'data-authorid'}, {prop : ''} ],
        [ {tagName : 'img'}, {contentType : 'src'}, {prop : 'featuredImage'} ],
        [ {tagName : 'span.cat'}, {contentType : 'text'}, {prop : 'categoryId'}, {sousProp : 'name'} ],
        [ {tagName : 'span.readTime'}, {contentType : 'text'}, {prop : 'readingTime'} ],
        [ {tagName : 'h2'}, {contentType : 'text'}, {prop : 'title'} ],
        [ {tagName : 'p.resume'}, {contentType : 'text'}, {prop : 'excerpt'} ]
    ]
    const categoryElement = document.querySelector('#category_element-js').content
    const categoryContainer = document.querySelector('.category_container-js')
    const auteurElement = document.querySelector('#auteur_element-js').content
    const auteurContainer = document.querySelector('.auteur_container-js')

    articlesFetch.forEach((a)=> { 
        new Article(a, showStatsaAticleByCat, articleElement, articleContainer)
    })

    // création des filtres (Categories)
    // ======================================================================
    const showStatsCategory = [
        [ {tagName : 'label'}, {contentType : 'id'}, {prop : ''} ],
        [ {tagName : 'span.name'}, {contentType : 'text'}, {prop : 'name'} ]
    ]
    let allAttachedArticle = 0
    categoriesFetch.forEach((c)=> {
        new Article(c, showStatsCategory, categoryElement, categoryContainer)
    })
    categoryContainer.querySelectorAll('label').forEach((label)=>{
        if(label.getAttribute('id') === 'all') return
        let articleAtached = 0

        articlesFetch.forEach((a)=>{
            if(label.getAttribute('id') === a.categoryId._id){
                articleAtached++
            }
        })

        label.querySelector('span.attached').innerText = articleAtached
        allAttachedArticle += articleAtached
    })
    categoryContainer.querySelector('.allAttached .countCategory').innerText = allAttachedArticle


    // création des filtres (Auteur)
    // ======================================================================
    const showStatsAuteur = [
        [ {tagName : 'label'}, {contentType : 'id'}, {prop : ''} ],
        [ {tagName : 'span.username'}, {contentType : 'text'}, {prop : 'fullName'} ]
    ]
    let allAttachedAuteur = 0
    staffFetch.forEach((u)=> {
        new Article(u, showStatsAuteur, auteurElement, auteurContainer)
    })
    auteurContainer.querySelectorAll('label').forEach((label)=>{
        if(label.getAttribute('id') === 'all') return
        let articleAtached = 0

        articlesFetch.forEach((a)=>{
            if(label.getAttribute('id') === a.authorId){
                articleAtached++
            }
        })

        label.querySelector('span.attached').innerText = articleAtached
        allAttachedAuteur += articleAtached
    })
    auteurContainer.querySelector('.allAttached .countAuteur').innerText = allAttachedAuteur

    // ======================================================================
    // Condition de sélection et de désélection des categories et des auteurs
    // ======================================================================
    const allCat = categoryContainer.querySelector('input.allCategory')
    const otherCats = categoryContainer.querySelectorAll('input.thisCat')
    const allAuthor = auteurContainer.querySelector('input.allAuthor')
    const otherAuthors = auteurContainer.querySelectorAll('input.thisAuthor')

    /** Cherche à savoir si tous les autres input (category) sont cochés
     * ou s'il y a au moins un décoché
     */
    function allCkecked (nodeList){
        const inArray = Array.from(nodeList)
        let trie = []
        nodeList.forEach((input) => {
            input.checked ? trie.push(true) : trie.push(false)
        })
        if(trie.includes(false)) return false
        return true
    }
    /** Cherche à savoir si tous les autres input (category) sont décochés 
     * ou s'il y a au moins un coché
     */
    function noneCkecked (nodeList){
        const inArray = Array.from(nodeList)
        let trie = [] 
        nodeList.forEach((input) => {
            !input.checked ? trie.push(true) : trie.push(false)
        })
        if(trie.includes(false)) return false
        return true
    }

    // CATEGORIES
    // ==================
    allCat.addEventListener('click', (e)=>{
        otherCats.forEach((cat)=>{
            cat.checked = true
        })
        e.target.checked = true
    })
    
    otherCats.forEach((input) => {
        input.addEventListener('click', (e)=>{
            if (!allCkecked(otherCats)){
                if(allCat.checked) allCat.checked = false
                if(noneCkecked (otherCats)) allCat.checked = true
            }else{
                allCat.checked = true
            }
        })
    })

    // AUTHORS
    // ==================
    allAuthor.addEventListener('click', (e)=>{
        otherAuthors.forEach((cat)=>{
            cat.checked = true
        })
        e.target.checked = true
    })
    
    otherAuthors.forEach((input) => {
        input.addEventListener('click', (e)=>{
            if (!allCkecked(otherAuthors)){
                if(allAuthor.checked) allAuthor.checked = false
                if(noneCkecked(otherAuthors)) allAuthor.checked = true
            }else{
                allAuthor.checked = true
            }
        })
    })




    const paginationContainer = document.querySelector('.paginationBox')
    const pagination = new Pagination(
        6,                              
        articleContainer,             
        categoryContainer,           
        auteurContainer,           
        paginationContainer             
    );
}

// ==================== PAGE À PROPOS ====================
export async function about() {
    const staffElement = document.querySelector('#staff_element-js').content
    const staffContainer = document.querySelector('.staff_container-js')
    const showStatsaStaff = [
        [ {tagName : 'img'}, {contentType : 'src'}, {prop : 'authorAvatar'} ],
        [ {tagName : 'h3'}, {contentType : 'text'}, {prop : 'fullName'} ],
        [ {tagName : 'p.bio'}, {contentType : 'text'}, {prop : 'bio'} ]
    ]
    staffFetch.forEach((a)=> {
        new Article(a, showStatsaStaff, staffElement, staffContainer)
    })

    // Les chiffres
    const articlesPub = document.querySelector('.articlesPub')
    articlesPub.innerText = statsFetch.articlesPublished
    const lecteurs = document.querySelector('.lecteurs')
    lecteurs.innerText = statsFetch.lecteurs
    const authors = document.querySelector('.auteurs')
    authors.innerText = statsFetch.auteurs
}
