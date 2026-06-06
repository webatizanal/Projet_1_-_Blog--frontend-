import apiRequest from '../fonctions/api.js';
import { message, dateFormat, formData } from '../fonctions/tools.js';
import Article from './Article.js'
import config from '../config.js'


const url = new URL(window.location.href)
const id = url.searchParams.get('id')
const getOne = await apiRequest(`${config}/articles/${id}`, 'GET', {'Content-Type': 'application/json'})
const comments = await apiRequest(`${config}/comments`, 'GET', {'Content-Type': 'application/json'})
const showStatInBalise = [
    [
        {tagName : '.category-js'},
        {contentType : 'text'}, 
        {prop : 'categoryId'},
        {sousProp : 'name'}
    ],
    [
        {tagName : '.title-js'},
        {contentType : 'text'}, 
        {prop : 'title'}
    ],
    [
        {tagName : '.bigTitle-js'},
        {contentType : 'text'}, 
        {prop : 'title'}
    ],
    [
        {tagName : '.auteur-js'},
        {contentType : 'text'}, 
        {prop : 'userId'},
        {sousProp : 'username'}
    ],
    [
        {tagName : '.date-js'},
        {contentType : 'text'}, 
        {prop : 'publishedAt'}
    ],
    [
        {tagName : '.reaTime-js'},
        {contentType : 'text'}, 
        {prop : 'readingTime'}
    ],
    [
        {tagName : '.views-js'},
        {contentType : 'text'}, 
        {prop : 'views'}
    ],
    [
        {tagName : '.cover-js'},
        {contentType : 'src'}, 
        {prop : 'featuredImage'}
    ],
    [
        {tagName : '.content-js'},
        {contentType : 'text'}, 
        {prop : 'content'}
    ],
    [
        {tagName : '.name-js'},
        {contentType : 'text'}, 
        {prop : 'userId'},
        {sousProp : 'username'}
    ],
    [
        {tagName : '.bio-js'},
        {contentType : 'text'}, 
        {prop : 'bio'}
    ],
    [
        {tagName : '.bio-js'},
        {contentType : 'text'}, 
        {prop : 'bio'}
    ],
]            
const showStatsComment = [
    [
        {tagName : '.user_comment-js'},
        {contentType : 'text'},  // href/src/text
        {prop : 'userId'},
        {sousProp : 'username'},
    ],
    [
        {tagName : 'img.avatar'},
        {contentType : 'src'},  // href/src/text
        {prop : 'userId'},
        {sousProp : 'avatarUrl'},
    ],
    [
        {tagName : '.comment_date-js'},
        {contentType : 'text'},  // href/src/text
        {prop : 'createdAt'}
    ],
    [
        {tagName : '.message_comment-js'},
        {contentType : 'text'},  // href/src/text
        {prop : 'content'}
    ]
]
const tagContainer = document.querySelector('.tag_container-js')        
const commentElement = document.querySelector('#comment_element-js').content      
const commentContainer = document.querySelector('.comment_container-js')       


export default class Reading {
    article
    showStatInBalise
    comments

    constructor() {
        this.article = getOne
        this.showStatInBalise = showStatInBalise 
        this.#insertToTagElement(this.article, this.showStatInBalise)
        this.#tag(tagContainer, this.article)
        this.comments = comments
        this.#comments()
        document.querySelector('#comment-form').addEventListener('submit', this.#formComment)
        document.querySelector('#formNewsLertter').addEventListener('submit', this.#newsLetter)
    }

    /**
     * Pour remplir les balises deja presentes dans le document
     * @param {object} data 
     * @param {Array} structure 
     */
    #insertToTagElement = (data, structure) => {        
        structure.forEach((value) => {
            const tagName = value[0]?.tagName;
            const contentType = value[1]?.contentType;
            const prop = value[2]?.prop;
            
            if (!tagName) return;
            
            const element = document.querySelector(tagName);
            if (!element) {
                console.warn(`Élément ${tagName} non trouvé dans le template`);
                return;
            }

            switch (contentType) {
                case "id":
                    element.setAttribute('id', `${this.article._id}`);
                    break;
                case "href":
                    element.setAttribute('href', `/src/public/article.html?id=${this.article._id}`);
                    break;
                case "src":
                    if (prop && this.article[prop] && typeof(this.article[prop]) !== 'object') {
                        element.setAttribute('src', this.article[prop]);
                    }
                    if (prop && this.article[prop] && typeof(this.article[prop]) === 'object') {
                        const sousProp = value[3]?.sousProp
                        element.setAttribute('src', this.article[prop][sousProp]);
                    }
                    break;
                case "text":
                    if (prop && this.article[prop] && typeof(this.article[prop]) !== 'object') {
                        element.innerHTML = this.article[prop];
                    }
                    if (prop && this.article[prop] && typeof(this.article[prop]) === 'object') {
                        const sousProp = value[3]?.sousProp
                        element.innerHTML = this.article[prop][sousProp];
                    }
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * @param {DocumentFragment} tpl balise (span) pour les tags
     * @param {HTMLElement} container tags
     * @param {object} data 
     */
    #tag = (container, data) => {
        const tags = data.tags;
        if (!tags || tags.length === 0) return;

        tags.forEach((t) => {
            let span = document.createElement('span')
            span.innerText = `${t}`
            span.classList.add('bg-blue-100', 'text-blue-800', 'text-xs', 'px-3', 'py-1', 'rounded-full')
            container.appendChild(span)
        });
    };

    #comments = () =>{
        comments.forEach((c)=>{
            if(c.articleId._id === this.article._id){
                new Article(c, showStatsComment, commentElement, commentContainer)
            }

        })
    }

    #formComment = async (e) =>{
        const {token} = JSON.parse(localStorage.getItem('token'));
        e.preventDefault()
        const data = formData(e)

        const result = await apiRequest(`${config}/comments/${id}`, 'POST', 
            { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }, 
            data
        );

        if (result.success) {
            console.log('Inscription réussie', result.data);
            message(
                result.status, 
                'Votre commentaire a été soummis avec succès. <br>En raison de l\'infiltraion des agents sur tout le web, Il sera examiner par le Staff !',
                e.target,
                'beforebegin'
            )
        } else {
            console.error('Erreur', result.status, result.error);
            message(
                result.status, 
                'Votre commentaire a malheureusement échoué. <br> Merci d\'essayer à nouveau !',
                e.target,
                'beforebegin'
            )
        }
    }

    #newsLetter = async (e) =>{
        e.preventDefault()
        const form = e.currentTarget
        const email = new FormData(form).get('email')

        const result = await apiRequest(`${config}/newsletter`, 'POST', 
            { 'Content-Type': 'application/json' }, 
            { email: email }
        );

        if (result.success) {
            console.log(form)
            console.log('Inscription réussie', result.data);
            message(
                result.status, 
                'Votre abonnement a été un succès. <br> Merci de votre interêt !',
                form,
                'beforebegin'
            )
        } else {
            console.log(form)
            console.error('Erreur', result.status, result.error);
            message(
                result.status, 
                'Votre abonnement a malheureusement échoué. <br> Merci d\'essayer à nouveau interêt !',
                form,
                'beforebegin'
            )
        }
    }
}



// =============================INSTANCE=========================
const reading = new Reading()


// ===========================FORMAT DATE========================
let ancienneDate = document.querySelectorAll('.date-js, .comment_date-js').forEach((d)=>{
    const date = d.innerText
    d.innerHTML = dateFormat(date)
})

