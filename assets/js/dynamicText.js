let elemsToShow = [];

function isInViewport(el) {
    const scroll = window.scrollY || window.pageYOffset
	const boundsTop = el.getBoundingClientRect().top + scroll
	
	const viewport = {
		top: scroll,
		bottom: scroll + window.innerHeight,
	}
	
    const bounds = {
		top: boundsTop,
		bottom: boundsTop + el.clientHeight,
	}
	
	return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom ) 
		|| ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );
}

function toggleResponsiveNavbar() {
    let navbar = document.querySelector(".header");

    if (navbar.className === "header")
        navbar.className += " responsive";
    else
        navbar.className = "header";
}

function getAnimDuration(elem) {
    let animDuration = window.getComputedStyle(elem).animationDuration.match(/[0-9.]+/g)[0];
    return parseFloat(animDuration) || 0;
}

function showElement(elem) {
    setTimeout(() => {
        elem.style.visibility = "visible";
        elem.className += " animate__animated animate__fadeIn";

        let index = elemsToShow.indexOf(elem);

        if (index > -1)
            elemsToShow.splice(index, 1);

        setTimeout(() => {
            elem.className = elem.className.replace(" animate__animated animate__fadeIn", "");
        }, getAnimDuration(elem) * 1000);
    }, 300);
}

window.onload = () => {
    let containers = document.getElementsByClassName("text-container");
    let dropDown = document.getElementById("dropdownicon");

    if (!containers.length)
        return;

    for (let cont of containers) {
        setTimeout(() => {
            for (let el of cont.children) {
                if (!isInViewport(el)) {
                    el.style.visibility = "hidden";
                    elemsToShow.push(el);
                }
            }
        }, getAnimDuration(cont) * 1000);
    }

    if (window.getComputedStyle(dropDown).display !== "none")
        dropDown.onclick = toggleResponsiveNavbar;
    else
        for (let anchor of document.querySelectorAll(".header > #redirects > a:not(#dropdownicon)")) {
            anchor.addEventListener('click', e => {
                e.preventDefault();

                document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
}

window.onscroll = () => {
    if (!elemsToShow.length)
        return;

    elemsToShow.forEach(elem => {
        if (isInViewport(elem))
            showElement(elem);
    });
}