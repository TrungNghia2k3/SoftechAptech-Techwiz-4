$(document).ready(function() {
    // Owl Carousel initialization
    var owl = $('.custom-animation');
    owl.owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        navText: ['<', '>'],
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn'
    });

    // Banner navigation
    const banners = document.querySelectorAll('.banner .item');
    const prevBannerBtn = document.getElementById('prevBannerBtn');
    const nextBannerBtn = document.getElementById('nextBannerBtn');
    let activeBannerIndex = 0;

    function showBanner(index) {
        banners.forEach((banner, i) => {
            banner.classList.toggle('active', i === index);
        });
    }

    function showNextBanner() {
        activeBannerIndex = (activeBannerIndex + 1) % banners.length;
        showBanner(activeBannerIndex);
    }

    function showPrevBanner() {
        activeBannerIndex = (activeBannerIndex - 1 + banners.length) % banners.length;
        showBanner(activeBannerIndex);
    }

    nextBannerBtn.addEventListener('click', showNextBanner);
    prevBannerBtn.addEventListener('click', showPrevBanner);
    showBanner(activeBannerIndex);

    // Product interactions
    const products = document.querySelectorAll('.about-us-item');

    products.forEach((product) => {
        const addButton = product.querySelector('.add-button');
        const cartIcon = product.querySelector('.cart-icon');
        const price = product.querySelector('.price');
        const cartIconGlobal = document.querySelector('.cart-icon');
        const cartCount = document.querySelector('.cart-count');
        let cartItems = [];

        addButton.addEventListener('click', () => {
            const productName = product.querySelector('img').alt;
            const productPrice = price.textContent;
            cartItems.push({ name: productName, price: productPrice });
            updateCart();
        });

        product.addEventListener('mouseenter', () => {
            price.style.display = 'block';
            addButton.style.display = 'block';
        });

        product.addEventListener('mouseleave', () => {
            price.style.display = 'none';
            addButton.style.display = 'none';
        });

        function updateCart() {
            cartIcon.style.opacity = '1';
            cartCount.textContent = cartItems.length;
        }
    });
});