
export default class Article {
    /**@type {object} */
    article = null
    /**@type {Array} */
    showStats = []
    /**@type {DocumentFragment} */
    tpl = null
    /**@type {HTMLElement} */
    container = null

    /**
     * @param {object} article 
     * @param {Array} showStats 
     * @param {DocumentFragment} tpl
     * @param {HTMLElement} container
     */
    constructor(article, showStats, tpl, container) {
        this.article = article
        this.showStats = showStats 
        this.tpl = tpl
        this.container = container
        
        this.#insertData()
    }


    #insertData = () => {
        let newTemplate = this.tpl.cloneNode(true);
        
        this.showStats.forEach((value) => {
            const tagName = value[0]?.tagName;
            const contentType = value[1]?.contentType;
            const prop = value[2]?.prop;
            
            if (!tagName) return;
            
            const element = newTemplate.querySelector(tagName);
            if (!element) {
                console.warn(`Élément ${tagName} non trouvé dans le template`);
                return;
            }
            switch (contentType) {
                case "data-categoryId":
                    const catId = this.article.categoryId._id;
                    element.setAttribute('data-categoryid', `${catId}`);
                    break;
                case "id":
                    element.setAttribute('id', `${this.article._id}`);
                    break;
                case "href":
                    element.setAttribute('href', `/src/public/article.html?id=${this.article._id}`);
                    break;
                case "src":
                    const sousProp = value[3]?.sousProp

                    if (prop && this.article[prop] && typeof(this.article[prop]) !== 'object') {
                        element.setAttribute('src', this.article[prop]);
                    }
                    if (prop && this.article[prop] && typeof(this.article[prop]) === 'object') {
                        element.setAttribute('src', this.article[prop][sousProp]);
                    }
                    break;
                case "text":
                    if (prop && this.article[prop] && typeof(this.article[prop]) !== 'object') {
                        element.textContent = this.article[prop];
                    }
                    if (prop && this.article[prop] && typeof(this.article[prop]) === 'object') {
                        const sousProp = value[3]?.sousProp
                        element.textContent = this.article[prop][sousProp];
                    }
                    break;
                case "comments":
                    if(value[2].baseUrl){
                        element.setAttribute('href', `${value[2].baseUrl}?id=${this.article._id}`);
                    }
                    break;
                case "update":
                    if(value[2].baseUrl){
                        element.setAttribute('href', `${value[2].baseUrl}?id=${this.article._id}`);
                    }
                    break;
                default:
                    break;
            }
        });
        
        this.container.appendChild(newTemplate);
    }
}

