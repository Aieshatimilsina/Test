class ImageSlider {

    constructor(selector) {

        this.slider = document.querySelector(selector);

        if (!this.slider) {
            console.error("Slider not found:", selector);
            return;
        }

        this.track = this.slider.querySelector(".slider-tracker");

        this.slides = this.track
            ? Array.from(this.track.children)
            : [];

        this.prevBtn = this.slider.querySelector(".slider-btn.prev");
        this.nextBtn = this.slider.querySelector(".slider-btn.next");
        this.dotsContainer = this.slider.querySelector(".dots-container");

        this.dots = [];
        this.currentIndex = 0;
        this.autoSlideInterval = null;

        if (
            !this.track ||
            this.slides.length === 0 ||
            !this.prevBtn ||
            !this.nextBtn ||
            !this.dotsContainer
        ) {
            console.error("Slider elements are missing.");
            return;
        }

        this.init();
    }


    init() {

        this.createDots();
        this.updateSlider();

        this.bindEvents();
        this.startAutoSlide();

        window.addEventListener("resize", () => {
            this.updateSlider();
        });

    }


    bindEvents() {

        this.nextBtn.addEventListener("click", () => {
            this.nextSlide();
            this.restartAutoSlide();
        });

        this.prevBtn.addEventListener("click", () => {
            this.prevSlide();
            this.restartAutoSlide();
        });

        // Pause while the mouse is over the slider
        this.slider.addEventListener("mouseenter", () => {
            this.stopAutoSlide();
        });

        // Resume when the mouse leaves
        this.slider.addEventListener("mouseleave", () => {
            this.startAutoSlide();
        });

        // Support touch devices
        this.slider.addEventListener("touchstart", () => {
            this.stopAutoSlide();
        }, { passive: true });

        this.slider.addEventListener("touchend", () => {
            this.startAutoSlide();
        }, { passive: true });

    }

createDots() {
    this.dotsContainer.innerHTML = "";
    this.dots = [];

    this.slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "dot";
        dot.setAttribute("aria-label", `Go to photo ${index + 1}`);

        dot.addEventListener("click", () => {
            this.currentIndex = index;
            this.updateSlider();
            this.restartAutoSlide();
        });

        this.dotsContainer.appendChild(dot);
        this.dots.push(dot);
    });
}

    updateSlider() {

        const slideWidth = this.slider.clientWidth;
        const offset = this.currentIndex * slideWidth;

        this.track.style.transform =
            `translateX(-${offset}px)`;

        this.dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === this.currentIndex
            );

        });

    }


    nextSlide() {

        this.currentIndex =
            (this.currentIndex + 1) % this.slides.length;

        this.updateSlider();

    }


    prevSlide() {

        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length)
            % this.slides.length;

        this.updateSlider();

    }


    startAutoSlide() {

        this.stopAutoSlide();

        this.autoSlideInterval = setInterval(() => {

            this.nextSlide();

        }, 5000);

    }


    stopAutoSlide() {

        if (this.autoSlideInterval !== null) {

            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;

        }

    }


    restartAutoSlide() {

        this.startAutoSlide();

    }

}


// Start the About Me photo slider
document.addEventListener("DOMContentLoaded", () => {
    new ImageSlider("#about .slider");
});