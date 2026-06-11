// Classe de pagination avec filtres par catégorie et auteur
export default class Pagination {
    // Constructeur : initialise la pagination avec tous les paramètres
    // itemsPerPage: nombre d'elements par page
    // articleContainer: conteneur des articles (parent des .article-card)
    // categoryContainer: conteneur des filtres categories (avec inputs checkbox)
    // authorContainer: conteneur des filtres auteurs (avec inputs checkbox)
    // paginationContainer: element HTML qui recevra les boutons de pagination
    constructor(itemsPerPage, articleContainer, categoryContainer, authorContainer, paginationContainer) {
        // Paramètres de base
        this.itemsPerPage = itemsPerPage;
        this.articleContainer = articleContainer;
        this.articleSelector = '.article-card';
        this.categoryContainer = categoryContainer;
        this.categorySelector = 'label';
        this.authorContainer = authorContainer;
        this.authorSelector = 'label';
        this.paginationContainer = paginationContainer;

        // Etat de la pagination
        this.currentPage = 1;               // Page courante (commence a 1)
        this.selectedCategoryId = [];       // Liste des IDs de categories selectionnees
        this.selectedAuthorId = [];         // Liste des IDs d'auteurs selectionnes
        this.filteredItems = [];            // Articles apres filtrage (avant pagination)
        this.totalPages = 0;                // Nombre total de pages calcule

        // Demarrage de la pagination
        this.init();
    }

    // PROCEDE 1 : Initialisation (appele automatiquement par le constructeur)
    // Role : attache les ecouteurs d'evenements et lance le premier filtrage
    init() {
        this.attachEvents();          // Etape 1 : brancher les evenements
        this.updateFiltersAndRender(); // Etape 2 : premier calcul des filtres + affichage
    }

    // PROCEDE 2 : Attachement des evenements
    // Role : ecoute les changements sur les checkboxes de categories et auteurs
    // Quand une checkbox change, on declenche la mise a jour complete
    attachEvents() {
        if (this.categoryContainer) {
            this.categoryContainer.addEventListener('change', () => this.updateFiltersAndRender());
        }
        if (this.authorContainer) {
            this.authorContainer.addEventListener('change', () => this.updateFiltersAndRender());
        }
    }

    // PROCEDE 3 : Mise a jour complete (appele a chaque changement de filtre)
    // Ordre d'execution :
    // 1. Mettre a jour la liste des categories selectionnees
    // 2. Mettre a jour la liste des auteurs selectionnes
    // 3. Filtrer les articles selon ces criteres
    // 4. Reinitialiser la page courante et afficher
    updateFiltersAndRender() {
        this.updateCategoryFilter();   // Etape 3A : collecte les IDs des categories cochees
        this.updateAuthorFilter();     // Etape 3B : collecte les IDs des auteurs coches
        this.pushFilteredItems();      // Etape 3C : applique les filtres sur les articles
        this.render();                 // Etape 3D : affiche la page courante
    }

    // PROCEDE 4 : Mise a jour du filtre categorie
    // Parcourt toutes les checkboxes du conteneur categories
    // Reconstruit completement le tableau selectedCategoryId
    // Gere le cas special "all" (si coche, on ignore les autres et on ne garde que 'all')
    updateCategoryFilter() {
        if (!this.categoryContainer) return;
        
        const selected = [];
        const categories = this.categoryContainer.querySelectorAll(this.categorySelector);
        let allChecked = false;
        
        categories.forEach(cat => {
            const input = cat.querySelector('input');
            if (input && input.checked) {
                const catId = cat.getAttribute('id');
                if (catId === 'all') {
                    allChecked = true;   // Le cas "Tous" a la priorite
                } else {
                    selected.push(catId);
                }
            }
        });
        
        if (allChecked) {
            this.selectedCategoryId = ['all'];
        } else {
            this.selectedCategoryId = selected;
        }
    }

    // PROCEDE 5 : Mise a jour du filtre auteur (strictement identique au filtre categorie)
    updateAuthorFilter() {
        if (!this.authorContainer) return;
        
        const selected = [];
        const auteurs = this.authorContainer.querySelectorAll(this.authorSelector);
        let allChecked = false;
        
        auteurs.forEach(auth => {
            const input = auth.querySelector('input');
            if (input && input.checked) {
                const authorId = auth.getAttribute('id');
                if (authorId === 'all') {
                    allChecked = true;
                } else {
                    selected.push(authorId);
                }
            }
        });
        
        if (allChecked) {
            this.selectedAuthorId = ['all'];
        } else {
            this.selectedAuthorId = selected;
        }
    }

    // PROCEDE 6 : Filtrage des articles (le coeur du systeme)
    // Ordre :
    // 1. Recuperer tous les articles (elements .article-card)
    // 2. Appliquer filtre par categorie (si des categories sont selectionnees ET que ce n'est pas "all")
    // 3. Appliquer filtre par auteur (si des auteurs sont selectionnes ET que ce n'est pas "all")
    // 4. Stocker le resultat dans this.filteredItems
    // 5. Calculer le nombre total de pages
    // 6. Reinitialiser la page courante a 1
    // 7. Declencher l'affichage
    pushFilteredItems() {
        const allItems = Array.from(this.articleContainer.querySelectorAll(this.articleSelector));
        
        // Etape 6A : Filtrage par categorie
        let categoryFiltered = allItems;
        if (this.selectedCategoryId.length > 0 && !this.selectedCategoryId.includes('all')) {
            categoryFiltered = allItems.filter(div => {
                return this.selectedCategoryId.includes(div.dataset.categoryid);
            });
        }
        
        // Etape 6B : Filtrage par auteur (on part du resultat du filtre categorie)
        let finalFiltered = categoryFiltered;
        if (this.selectedAuthorId.length > 0 && !this.selectedAuthorId.includes('all')) {
            finalFiltered = categoryFiltered.filter(div => {
                return this.selectedAuthorId.includes(div.dataset.authorid);
            });
        }
        
        // Etape 6C : Stockage et calculs
        this.filteredItems = finalFiltered;
        this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        this.currentPage = 1;
        this.render();  // Delegue l'affichage a la procedure 7
    }

    // PROCEDE 7 : Affichage des articles
    // Ordre :
    // 1. Cacher TOUS les articles
    // 2. Calculer l'index de debut et de fin pour la page courante
    // 3. Afficher uniquement les articles de la page courante
    // 4. Generer les boutons de pagination
    render() {
        const allArticles = document.querySelectorAll(this.articleSelector);
        allArticles.forEach(article => article.style.display = 'none');
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const itemsToShow = this.filteredItems.slice(start, end);
        
        itemsToShow.forEach(item => item.style.display = '');
        
        this.renderPaginationButtons();  // Delegue la creation des boutons a la procedure 8
    }

    // PROCEDE 8 : Generation des boutons de pagination
    // Ordre :
    // 1. Vider le conteneur de pagination
    // 2. Ne rien faire si une seule page (pas besoin de boutons)
    // 3. Creer bouton "Precedent" (desactive si page 1)
    // 4. Creer un bouton pour chaque page (mettre en surbrillance la page courante)
    // 5. Creer bouton "Suivant" (desactive si derniere page)
    renderPaginationButtons() {
        if (!this.paginationContainer) return;
        
        this.paginationContainer.innerHTML = '';
        if (this.totalPages <= 1) return;
        
        // Bouton precedent
        const prevBtn = this.createButton('<<', this.currentPage > 1, () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        });
        this.paginationContainer.appendChild(prevBtn);
        
        // Boutons numerotes
        for (let i = 1; i <= this.totalPages; i++) {
            const btn = this.createButton(i, true, () => {
                this.currentPage = i;
                this.render();
            });
            if (i === this.currentPage) {
                btn.classList.add('bg-blue-600', 'text-white');
            } else {
                btn.classList.add('hover:bg-gray-100');
            }
            this.paginationContainer.appendChild(btn);
        }
        
        // Bouton suivant
        const nextBtn = this.createButton('>>', this.currentPage < this.totalPages, () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.render();
            }
        });
        this.paginationContainer.appendChild(nextBtn);
    }

    // PROCEDE 9 : Fabrique un bouton de pagination
    // text : texte a afficher (nombre ou 'Precedent')
    // enabled : true si cliquable, false si desactive
    // onClick : fonction a executer au clic
    createButton(text, enabled, onClick) {
        const btn = document.createElement('a');
        btn.href = '#';
        btn.textContent = text;
        btn.className = 'px-2 py-1 border rounded-lg mx-1';
        
        if (!enabled) {
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.style.pointerEvents = 'none';
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (enabled) onClick();
        });
        
        return btn;
    }
}