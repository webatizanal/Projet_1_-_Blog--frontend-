/**
 * Filtre le nombre d'articles selon un critère
 * @param {number} n - Nombre d'articles à retourner
 * @param {string} critere - Propriété de tri (ex: 'views', 'likes')
 * @param {Array} data - Tableau d'articles
 * @returns {Array}
 */
export function top(n, critere, data) {
    let articles = null;
    if (!Array.isArray(data)) {
        return articles = Array.from(data)
    }else{
        articles = data
    }

    // Tri décroissant
    const tries = articles.sort((a, b) => {
        return b[critere] - a[critere];
    });

    // Si n n'est pas défini ou est 0, retourner tout
    if (!n || n <= 0) {
        return tries;
    }

    // Retourner les n premiers
    return tries.slice(0, n);
}



/**
 * Nb: Je compte ajouter un declage de temps pour trier
 *     les les article de 30 jour au max par exemple.
 * Filtre le nombre d'article le plus rencent
 * @param {number} n 
 * @param {Array} data
 * @return {Array}
 */
export function recently (n, data){
    const articles = data

    articles.sort((a, b) => {
        const dateA = new Date(a.publishedAt)
        const dateB = new Date(b.publishedAt)

        return dateA - dateB 
    })

    // Si n n'est pas défini ou est 0, retourner tout
    if (!n || n <= 0) {
        return articles;
    }

    // Retourner les n premiers
    return articles.slice(0, n);
}



/**
 * --GESTION de la DURÉe
 * @param {HTMLElement} container  le container des articles
 * @param {string} className   le selecteur de chaque articleCarde
 * @param {string} spanName   le selecteur de la balise qui contient la durée
 */
export function readTimeNormalize(container, className, spanName){
    container.querySelectorAll(`${className}`).forEach((a)=>{
        const minutes = Number(a.querySelector(`${spanName}`).innerHTML)
        if(minutes < 60){
            a.querySelector('span.readTime').innerHTML += " min"
            return
        }

        let min = minutes % 60
        let hours = (minutes - min) / 60
        a.querySelector(`${spanName}`).innerHTML = `${hours}h${min}min`
    })
}

/**
 * --GESTION des views
 * @param {HTMLElement} container  le container des articles du nombre des vues
 */
export function viewsNormalize(container){
    const views = Number(container.textContent)

    if(views >= 1000 && views < 1000000){
        const normalize = views / 1000
        container.innerText = `${normalize}k`
        return
    }

    if(views >= 1000000){
        const normalize = Math.random(views / 1000000)
        container.innerText = `${normalize}M`
        return
    }

    container.innerText = views
}




/**
 * Generer un message apres une requête de l'utilisateur
 * @param {boolean} type La reponse directe du message
 * @param {string} message 
 * @param {HTMLElement} elementAdjacent  Element de repère pour le "insertAdjacentElement"
 * @param {String} position  La position du "insertAdjacentElement"
 */
export function message(type, message, elementAdjacent, position) {
    let paraMessage = document.createElement('p');
    paraMessage.innerHTML = message;
    paraMessage.classList.add('p-2', 'bg-white', 'text-sm', 'rounded-lg', 'my-2');

    if (type) {
        paraMessage.classList.add('text-green-700');   
        // document.querySelector('.inletter').value = ""

        if(elementAdjacent){
            elementAdjacent.querySelectorAll('input, textarea').forEach((input) =>{
                input.value = ''
                if(input.getAttribute('type') === 'checkbox' && input.getAttribute('checked')){
                    input.setAttribute('checked', false)
                }
            })     
        }

    } else {
        paraMessage.classList.add('text-red-700');        
    }

    elementAdjacent.insertAdjacentElement(position, paraMessage);


    // ⏱️ Disparaît après 3 secondes
    setTimeout(() => {
        paraMessage.remove();
    }, 5000);
}



/**
 * @param {Date} date 
 * @returns {Date}
 */
export function dateFormat(date){
    const newDate = new Date(date)
    return new Intl.DateTimeFormat('fr-FR', {dateStyle:'medium'}).format(newDate)
}



/**
 * @param {HTMLElement} e 
 * @returns {Object}
 */
export function  formData (e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    let newObjectData = {}

    for(let[key, value] of formData.entries()){
        newObjectData[key] = `${value}`
    }

    return newObjectData
}