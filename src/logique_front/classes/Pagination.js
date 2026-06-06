export default class Pagination {
    constructor(itemsPerPage, archiveContainer, articleSelector, categoryContainer, categorySelector, paginationSelector) {
        this.itemsPerPage = itemsPerPage;
        this.archiveContainer = archiveContainer;
        this.articleSelector = articleSelector;
        this.categoryContainer = categoryContainer;
        this.categorySelector = categorySelector;
        this.paginationSelector = paginationSelector;

        this.currentPage = 1;
        this.selectedCategoryId = null;
        this.filteredItems = [];
        this.totalPages = 0;

        this.init();
    }

    init() {
        this.attachEvents();
        this.selectFirstCategory();
        this.update();
    }

    attachEvents() {
        if (!this.categoryContainer) return;

        const categories = this.categoryContainer.querySelectorAll(this.categorySelector);
        categories.forEach(cat => {
            cat.addEventListener('click', (e) => {
                e.preventDefault();
                const clickedId = cat.id;

                if (this.selectedCategoryId === clickedId) return;

                // Met à jour la classe selected
                categories.forEach(c => c.classList.remove('selected'));
                cat.classList.add('selected');

                // Met à jour l'id sélectionné
                this.selectedCategoryId = clickedId;

                // Réinitialise la page
                this.currentPage = 1;

                // Recalcule et affiche
                this.update();
            });
        });
    }

    selectFirstCategory() {
        if (!this.categoryContainer) return;

        const first = this.categoryContainer.querySelector(this.categorySelector);
        if (first && !this.selectedCategoryId) {
            const categories = this.categoryContainer.querySelectorAll(this.categorySelector);
            categories.forEach(c => c.classList.remove('selected'));
            first.classList.add('selected');
            this.selectedCategoryId = first.id;
        }
    }

    update() {
        const allItems = Array.from(this.archiveContainer.querySelectorAll(this.articleSelector));

        if (this.selectedCategoryId) {
            this.filteredItems = allItems.filter(item => item.dataset.categoryid === this.selectedCategoryId);
        } else {
            this.filteredItems = [...allItems];
        }

        this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        this.render();
    }

    render() {
        const allItems = Array.from(this.archiveContainer.querySelectorAll(this.articleSelector));
        allItems.forEach(item => item.style.display = 'none');

        if (this.filteredItems.length === 0) {
            this.showEmptyMessage();
            this.clearPagination();
            return;
        }

        this.hideEmptyMessage();

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.filteredItems.slice(start, end).forEach(item => item.style.display = '');

        this.renderPagination();
    }

    showEmptyMessage() {
        let msg = document.querySelector('.empty-category-message');
        if (!msg) {
            msg = document.createElement('p');
            msg.className = 'empty-category-message text-center text-gray-500 py-8';
            msg.textContent = 'Aucun article dans cette catégorie.';
            this.archiveContainer.appendChild(msg);
        }
    }

    hideEmptyMessage() {
        const msg = document.querySelector('.empty-category-message');
        if (msg) msg.remove();
    }

    clearPagination() {
        const container = document.querySelector(this.paginationSelector);
        if (container) container.innerHTML = '';
    }

    renderPagination() {
        const container = document.querySelector(this.paginationSelector);
        if (!container) return;
        container.innerHTML = '';
        if (this.totalPages <= 1) return;

        const addButton = (text, enabled, onClick, isActive = false) => {
            const btn = document.createElement('a');
            btn.href = '#';
            btn.textContent = text;
            btn.className = 'px-4 py-2 border rounded-lg mx-1';
            if (!enabled) {
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                btn.style.pointerEvents = 'none';
            }
            if (isActive) {
                btn.classList.add('bg-blue-600', 'text-white');
            } else if (enabled) {
                btn.classList.add('hover:bg-gray-100');
            }
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (enabled) onClick();
            });
            container.appendChild(btn);
        };

        addButton('« Précédent', this.currentPage > 1, () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        });

        const delta = 2;
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === 1 || i === this.totalPages || (i >= this.currentPage - delta && i <= this.currentPage + delta)) {
                pages.push(i);
            }
        }

        const finalPages = [];
        let last = 0;
        for (let p of pages) {
            if (p - last > 1) finalPages.push('...');
            finalPages.push(p);
            last = p;
        }
 
        finalPages.forEach(p => {
            if (p === '...') {
                addButton('...', false, () => {});
            } else {
                addButton(p, true, () => {
                    this.currentPage = p;
                    this.render();
                }, p === this.currentPage);
            }
        });

        addButton('Suivant »', this.currentPage < this.totalPages, () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.render();
            }
        });
    }
}