// Déclarations
const aside = document.querySelector('aside')
const buttonClose = document.querySelector('.close')
const buttonOpen = document.querySelector('.open')
const main = document.querySelector('#articles-list')
const overlay = document.querySelector('.overlay');



function openAside() {
    aside.classList.remove('-translate-x-full');
    aside.classList.add('translate-x-0');
    main.classList.add('ml-80'); 

    // Sauf sur mobile(À régler plus tard)
    if (window.innerWidth <= 768 ) {
        main.classList.remove('ml-80');
        overlay.classList.remove('opacity-0', 'invisible');
        overlay.classList.add('opacity-100', 'visible');        
    }
}

function closeAside() { 
    aside.classList.remove('translate-x-0');
    aside.classList.add('-translate-x-full');
    main.classList.remove('ml-80');

    // Sauf sur mobile(À régler plus tard)
    if (window.innerWidth <= 768 ) {
        overlay.classList.remove('opacity-100', 'visible');
        overlay.classList.add('opacity-0', 'invisible');   
    }
}

buttonOpen.addEventListener('click', openAside);
buttonClose.addEventListener('click', closeAside);

if(window.innerWidth > 768){
    openAside() 
}

window.addEventListener('resize', (e)=>{
    console.log('resize :', window.innerWidth)
    const container = document.querySelector('#articles-list')
    if (window.innerWidth > 768 ) {
        openAside() 
    }
})

// Gestion d'Overlay et click extérieur (Pour Mobile)
overlay.addEventListener('click', (e) => {
    closeAside()
});



// -------------------------------------------------------------------|
// ===========================NAVBAR FLUIDE===========================|6a2aea7cf49ffb8b4ee1f8ae
// -------------------------------------------------------------------|

