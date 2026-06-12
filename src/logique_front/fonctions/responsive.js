
export async function aside (){

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
        const container = document.querySelector('#articles-list')
        if (window.innerWidth > 768 ) {
            openAside() 
        }
    })

    // Gestion d'Overlay et click extérieur (Pour Mobile)
    overlay.addEventListener('click', (e) => {
        closeAside()
    });

}



// -------------------------------------------------------------------|
// ===========================NAVBAR FLUIDE===========================|6a2aea7cf49ffb8b4ee1f8ae
// -------------------------------------------------------------------|

const navbar = document.querySelector('.navbar');
const navRect = navbar.getBoundingClientRect().height
const nextToNavbar = document.querySelector('.nextToNavbar')
nextToNavbar.style.cssText = `
    margin-top: ${navRect}px;
`

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.classList.add('-translate-y-full');
        navbar.classList.remove('translate-y-0');
    } else if (currentScrollY < lastScrollY) {
        navbar.classList.remove('-translate-y-full');
        navbar.classList.add('translate-y-0');
    }
    
    lastScrollY = currentScrollY;
});