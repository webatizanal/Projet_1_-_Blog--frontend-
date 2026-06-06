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
const baliseName = document.querySelector('span.username')
const baliseLogout = document.querySelector('button.logout')
if(tokenData) {
    baliseName.innerText = `${userName}`
} 
baliseLogout.addEventListener('click', logout)



// =================dashboard================
export async function dashboard(){

    //-----------------------------------
    const articleTpl = document.querySelector('#article_template-js').content
    const articleContainer = document.querySelector('.article_container-js')
    const articlesPublished = document.querySelector('.articlesPublished')
    const drafts = document.querySelector('.drafts')
    const views = document.querySelector('.views')
    const comments = document.querySelector('.comments')

    // Les stats
    let publishedCount = 0
    let draftCount = 0
    let viewsCount = 0
    let commentsCount = 0
    articlesRequest.forEach((a)=>{
        if(a.status === 'published'){
            publishedCount++
        }
        if(a.status === 'draft'){
            draftCount++
        }
        viewsCount += a.views

        commentsRequest.forEach((c)=>{
            if(c.articleId._id === a._id) commentsCount++
        })
    })
    articlesPublished.innerText = publishedCount
    drafts.innerText = draftCount
    views.innerText = viewsCount
    viewsNormalize(views)
    comments.innerText = commentsCount


    // Liste d'articles
    const showStatsArticle = [
        [
            {tagName : 'img.articleCover'},
            {contentType : 'src'},  // href/src/text
            {prop : 'featuredImage'}  
        ],
        [
            {tagName : '.publishedAt'},
            {contentType : 'text'},  // href/src/text
            {prop : 'publishedAt'}  
        ],
        [
            {tagName : '.status'},
            {contentType : 'text'},  // href/src/text
            {prop : 'status'}  
        ],
        [
            {tagName : '.title'},
            {contentType : 'text'},  // href/src/text
            {prop : 'title'}  
        ],
        [
            {tagName : '.excerpt'},
            {contentType : 'text'},  // href/src/text
            {prop : 'excerpt'}
        ],
        [
            {tagName : 'a.comments'},
            {contentType : 'comments'},  // href/src/text
            {baseUrl : '/src/user/comments.html'}
        ],
        [
            {tagName : 'a.update'},
            {contentType : 'update'},  // href/src/text
            {baseUrl : '/src/user/edit-article.html'}
        ],
    ]
    articlesRequest.forEach((art)=>{
        new Article(art, showStatsArticle, articleTpl, articleContainer)
    })
    articleContainer.querySelectorAll('.publishedAt').forEach((a)=>{
        const newDate = dateFormat(a.innerText)
        a.innerText = newDate
    })


}

export async function commentsByarticle(){

    const url = new URL(window.location.href)
    const id = url.searchParams.get('id')
    console.log(id)

    let commentsCount = 0
    let commentForThis = []
    articlesRequest.forEach((a)=>{

        commentsRequest.forEach((c)=>{
            if(c.articleId._id === a._id) commentsCount++
        })
    })
}