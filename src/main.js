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
    const lecteurs = document.querySelector('.lecteurs')
    const auteurs = document.querySelector('.auteurs')
    const noteMoyenne = document.querySelector('.noteMoyenne')

    // Les articles à la une
    const laUne = top(5, 'views', articlesFetch)  // Avant d'appeler cette fonction on doit recupere sur une periode, les articles recents
    const showStatsLaune = [
        [
            {tagName : 'a'},
            {contentType : 'href'},  // href/src/text
            {prop : ''}  
        ],
        [
            {tagName : 'img'},
            {contentType : 'src'},  // href/src/text
            {prop : 'featuredImage'}  
        ],
        [
            {tagName : 'h3'},
            {contentType : 'text'},  // href/src/text
            {prop : 'title'}  
        ],
        [
            {tagName : 'p.resume'},
            {contentType : 'text'},  // href/src/text
            {prop : 'excerpt'}
        ]
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
        [
            {tagName : 'a'},
            {contentType : 'href'},  // href/src/text
            {prop : ''}  
        ],
        [
            {tagName : 'img'},
            {contentType : 'src'},  // href/src/text
            {prop : 'featuredImage'}  
        ],
        [
            {tagName : 'span.cat'},
            {contentType : 'text'},  // href/src/text
            {prop : 'categoryId'},
            {sousProp : 'name'},
        ],
        [
            {tagName : 'span.readTime'},
            {contentType : 'text'},  // href/src/text
            {prop : 'readingTime'}  
        ],
        [
            {tagName : 'h2'},
            {contentType : 'text'},  // href/src/text
            {prop : 'title'}
        ],
        [
            {tagName : 'p.resume'},
            {contentType : 'text'},  // href/src/text
            {prop : 'excerpt'}
        ]
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
        [
            {tagName : 'p.auteur'},
            {contentType : 'text'},  // href/src/text
            {prop : 'userId'},
            {sousProp : 'username'},
        ],
        [
            {tagName : 'p.message'},
            {contentType : 'text'},  // href/src/text
            {prop : 'content'}
        ]
    ]
    commentsFetch.forEach((a)=> {
        new Article(a, showStatsComment, commentElement, commentContainer)
    })

    // Partnerships
    const showStatsPartnership = [
        [
            {tagName : 'img'},
            {contentType : 'src'},  // href/src/text
            {prop : 'logoUrl'}
        ],
        [
            {tagName : 'span.name'},
            {contentType : 'text'},  // href/src/text
            {prop : 'name'}
        ]
    ]
    partnershipFetch.forEach((a)=> {
        new Article(a, showStatsPartnership, partnershipElement, partnershipContainer)
    })
}

// ==================== PAGE ARCHIVE ====================
export async function archive() {
    // Déclarations 
    const archiveElement = document.querySelector('#archive_element-js').content
    const archiveContainer = document.querySelector('.archive_container-js')
    const articlesArchiver = articlesFetch
    const selectCategory = document.querySelector('.selectCategory')
    const showStatsArchive = [
        [
            {tagName : 'div'},
            {contentType : 'data-categoryId'},  // href/src/text
            {prop : ''}   
        ],
        [
            {tagName : 'a'},
            {contentType : 'href'},  // href/src/text
            {prop : ''}  
        ],
        [
            {tagName : 'img'},
            {contentType : 'src'},  // href/src/text
            {prop : 'featuredImage'}  
        ],
        [
            {tagName : 'span.publishedAt'},
            {contentType : 'text'},  // href/src/text
            {prop : 'publishedAt'}  
        ],
        [
            {tagName : 'span.cat'},
            {contentType : 'text'},  // href/src/text
            {prop : 'categoryId'},
            {sousProp : 'name'},
        ],
        [
            {tagName : 'span.readTime'},
            {contentType : 'text'},  // href/src/text
            {prop : 'readingTime'}  
        ],
        [
            {tagName : 'h2'},
            {contentType : 'text'},  // href/src/text
            {prop : 'title'}
        ],
        [
            {tagName : 'p.resume'},
            {contentType : 'text'},  // href/src/text
            {prop : 'excerpt'}
        ]
    ]

    // categories
    categoriesFetch.forEach((cat)=>{
        let newOption = document.createElement('option')
        newOption.innerText = cat.name
        newOption.classList.add('catOption')
        newOption.setAttribute('id', `${cat._id}`)
        // if(categoriesFetch[0]._id === `${cat._id}`){
        //     newOption.classList.add('selected')
        // } 
        selectCategory.appendChild(newOption)
    })

    articlesArchiver.forEach((a)=> {
        new Article(a, showStatsArchive, archiveElement, archiveContainer)
    })
    readTimeNormalize(archiveContainer, '.archive_element', 'span.readTime')  
    archiveContainer.querySelectorAll('.publishedAt').forEach((el)=>{
        const ancienneDate = el.innerText
        el.innerHTML = dateFormat(ancienneDate)
    })

    // const pagination = new Pagination(
    //     4,                              
    //     archiveContainer,             
    //     '.archive_element',           
    //     selectCategory,           
    //     '.catOption',              
    //     '.paginationBox'             
    // );
}

// ==================== PAGE CATEGORY ====================
export async function category() {
    const recentArticleContainer = document.querySelector('.recent_article_container-js')
    const recentArticleElement = document.querySelector('#recent_article_element-js').content
    const showStatsaAticleByCat = [
        [
            {tagName : 'a'},
            {contentType : 'href'},  // href/src/text
            {prop : ''}  
        ],
        [
            {tagName : 'img'},
            {contentType : 'src'},  // href/src/text
            {prop : 'featuredImage'}  
        ],
        [
            {tagName : 'span.cat'},
            {contentType : 'text'},  // href/src/text
            {prop : 'categoryId'},
            {sousProp : 'name'},
        ],
        [
            {tagName : 'span.readTime'},
            {contentType : 'text'},  // href/src/text
            {prop : 'readingTime'}  
        ],
        [
            {tagName : 'h2'},
            {contentType : 'text'},  // href/src/text
            {prop : 'title'}
        ],
        [
            {tagName : 'p.resume'},
            {contentType : 'text'},  // href/src/text
            {prop : 'excerpt'}
        ]
    ]
    const categoryElement = document.querySelector('#category_element-js').content
    const categoryContainer = document.querySelector('.category_container-js')


    articlesFetch.forEach((a)=> { 
        new Article(a, showStatsaAticleByCat, recentArticleElement, recentArticleContainer)
    })

    // création des filtres
    const showStatsCategory = [
        [
            {tagName : 'label'},
            {contentType : 'id'},  // href/src/text
            {prop : ''}  
        ],
        [
            {tagName : 'span.name'},
            {contentType : 'text'},  // href/src/text
            {prop : 'name'}  
        ],
        [
            {tagName : 'span.attached'},
            {contentType : 'text'},  // href/src/text
            {prop : 'attached_article'}
        ]
    ]

    let allAttachedArticle = 0
    categoriesFetch.forEach((a)=> {
        if(a.attached_article) allAttachedArticle += a.attached_article
        new Article(a, showStatsCategory, categoryElement, categoryContainer)
    })
    categoryContainer.querySelector('.allAttached .count').innerText = allAttachedArticle
}

// ==================== PAGE À PROPOS ====================
export async function about() {
    const staffElement = document.querySelector('#staff_element-js').content
    const staffContainer = document.querySelector('.staff_container-js')
    const showStatsaStaff = [
        [
            {tagName : 'img'},
            {contentType : 'src'},  // href/src/text
            {prop : 'userId'},
            {sousProp : 'avatarUrl'},  
        ],
        [
            {tagName : 'h3'},
            {contentType : 'text'},  // href/src/text
            {prop : 'userId'},
            {sousProp : 'username'}
        ],
        [
            {tagName : 'p.bio'},
            {contentType : 'text'},  // href/src/text
            {prop : 'bio'}
        ]
    ]
    staffFetch.forEach((a)=> {
        new Article(a, showStatsaStaff, staffElement, staffContainer)
    })
}
