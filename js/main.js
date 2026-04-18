const slides = [
    'slides/intro.html',
    'slides/hebergeur.html',
    'slides/menu.html',
    'slides/part1-introduction.html',
    'slides/part2-client.html',
    'slides/part3-serveur.html',
    'slides/part4-conclusion.html',
    'slides/part5-bonus.html',
    'slides/conclusion.html'
];

async function loadSlidesAndInit() {
    const slidesContainer = document.querySelector('.slides');
    try {
        const slideContents = await Promise.all(
            slides.map(url => fetch(url).then(r => {
                if (!r.ok) throw new Error(`Failed to load ${url}`);
                return r.text();
            }))
        );
        slidesContainer.innerHTML = slideContents.join('');
        Reveal.initialize({
            hash: true,
            slideNumber: 'c/t',
            controls: true,
            progress: true,
            center: false,
            margin: 0.1,
            width: 1050,
            height: 700,
            minScale: 0.2,
            maxScale: 1.0
        });
    } catch (err) {
        console.error('Error loading slides:', err);
        slidesContainer.innerHTML = `<section><h2>Error</h2><p>${err.message}</p></section>`;
    }
}

document.addEventListener('DOMContentLoaded', loadSlidesAndInit);
