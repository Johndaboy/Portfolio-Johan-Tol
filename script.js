function Components() {
    const navbarhtml = `
  <nav id="navbar">
        <div class="nav-header">
            <strong>Johan Tol</strong>
        </div>
        <div id="hamburgermenu">
            <div id="navigatie">
                <button id="menu-toggle" class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <ul id="nav-links" class="nav-links">
                <li>
                    <p><a href="index.html">HOME</a></p>
                </li>
                <li>
                    <p><a href="index.html#name">OVER MIJ</a></p>
                </li>
                <li>
                    <p><a href="index.html#projecten-h1">PROJECTEN</a></p>
                </li>
                <li>
                    <p><a href="index.html#contact">CONTACT</a></p>
                </li>
            </ul>
        </div>
  </nav>
  `

    const navbarContainer = document.getElementById("navbarcontainer");
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarhtml;
    }
    // Toggle nav-links visibility
    document.getElementById("menu-toggle").addEventListener("click", function () {
        const navLinks = document.getElementById("nav-links");
        navLinks.classList.toggle("show");
    });

    // Close the menu when a link is clicked
    const navLinks = document.querySelectorAll('#nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const navLinksContainer = document.getElementById("nav-links");
            navLinksContainer.classList.remove("show");
        });
    });
}
Components()

let currentIndex = 0;
let autoScrollInterval; // To store the interval ID

// Function to clone cards for seamless looping
function setupCarousel() {
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.carousel-card');

    // Clone the first and last cards
    const firstCard = cards[0].cloneNode(true);
    const lastCard = cards[cards.length - 1].cloneNode(true);

    // Append and prepend clones
    carousel.appendChild(firstCard);
    carousel.insertBefore(lastCard, cards[0]);

    // Adjust initial scroll position to account for the prepended card
    carousel.scrollLeft = cards[0].offsetLeft;
}

// Function for auto-scrolling
function autoScroll() {
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.carousel-card');
    const cardWidth = cards[0].offsetWidth + 16; // Adjust for card width + gap

    currentIndex++;

    // Smooth scroll to the next card
    carousel.scrollTo({
        left: carousel.scrollLeft + cardWidth,
        behavior: 'smooth',
    });

    // Handle looping when reaching the cloned last card
    if (currentIndex >= cards.length - 1) {
        setTimeout(() => {
            carousel.scrollLeft = cards[0].offsetLeft; // Jump back to the original first card
            currentIndex = 0;
        }, 500); // Allow time for smooth scroll to finish
    }
}

// Pause auto-scroll on hover
function pauseAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Resume auto-scroll when not hovering
function resumeAutoScroll() {
    autoScrollInterval = setInterval(autoScroll, 2000);
}

// Fetch JSON data and initialize the carousel
fetch('data.json')
    .then((response) => response.json())
    .then((data) => {
        const carousel = document.getElementById('carousel');
        data.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.style.background = item.color;
            card.textContent = item.title;

            // Create the certificate link as an anchor
            const certificateLink = document.createElement('a');
            certificateLink.href = item.link; // Use the link from JSON
            certificateLink.target = '_blank'; // Open in a new tab
            certificateLink.textContent = 'See Certificate';

            card.appendChild(certificateLink);
            carousel.appendChild(card);
        });

        // Setup carousel for looping
        setupCarousel();

        // Start auto-scroll
        autoScrollInterval = setInterval(autoScroll, 2000);

        // Add hover event listeners
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', pauseAutoScroll);
        carouselContainer.addEventListener('mouseleave', resumeAutoScroll);
    })
    .catch((error) => console.error('Error loading JSON:', error));

// Fetch project data and generate cards
function loadProjects() {
    fetch("projecten.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(projectsData => {
            const container = document.getElementById("projects-container");
            projectsData.forEach(project => {
                // Create the project card element
                const projectCard = document.createElement("div");
                projectCard.classList.add("project-card");
                projectCard.href = project.url;

                // Add the image
                const img = document.createElement("img");
                img.classList.add("video-img");
                img.src = project.imgSrc;
                img.alt = project.titel;

                // Add the card text container
                const cardText = document.createElement("div");
                cardText.classList.add("card-text");

                // Add the title
                const title = document.createElement("h1");
                title.textContent = project.titel;

                // Add the description
                const description = document.createElement("p");
                description.textContent = project.beschrijving;

                const projectLink = document.createElement("a")
                projectLink.href = project.url
                projectLink.textContent = "Zie project"
                projectLink.target = "_blank"
                projectLink.classList.add("project-button")

                // Assemble the card
                cardText.appendChild(title);
                cardText.appendChild(description);
                cardText.appendChild(projectLink)
                projectCard.appendChild(img);
                projectCard.appendChild(cardText);

                // Append the card to the container
                container.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error("Failed to load projects:", error);
        });
}

// Call the function to load projects when the DOM is loaded
document.addEventListener("DOMContentLoaded", loadProjects);
