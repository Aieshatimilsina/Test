class ImageSlider {

    constructor(selector, options = {}) {

        this.slider = document.querySelector(selector);

        if (!this.slider) {
            console.error("Slider not found:", selector);
            return;
        }

        this.track = this.slider.querySelector(".slider-tracker");
        this.prevBtn = this.slider.querySelector(".slider-btn.prev");
        this.nextBtn = this.slider.querySelector(".slider-btn.next");
        this.dotsContainer = this.slider.querySelector(".dots-container");

        this.originalSlides = this.track
            ? Array.from(this.track.children)
            : [];

        if (
            !this.track ||
            this.originalSlides.length === 0 ||
            !this.prevBtn ||
            !this.nextBtn ||
            !this.dotsContainer
        ) {
            console.error("Slider elements are missing.");
            return;
        }

        this.total = this.originalSlides.length;
        this.interval = options.interval || 5000;

        
        this.currentIndex = 1;

        this.isAnimating = false;
        this.autoSlideTimer = null;
        this.dots = [];

        this.init();
    }


    /* ---------- Setup ---------- */

    init() {
        this.createClones();
        this.createDots();
        this.setPosition(false);   
        this.bindEvents();
        this.startAutoSlide();
    }

      createClones() {
        const firstClone = this.originalSlides[0].cloneNode(true);
        const lastClone =
            this.originalSlides[this.total - 1].cloneNode(true);

        firstClone.setAttribute("aria-hidden", "true");
        lastClone.setAttribute("aria-hidden", "true");

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.track.firstChild);
    }

    createDots() {
        this.dotsContainer.innerHTML = "";
        this.dots = [];

        this.originalSlides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "dot";
            dot.setAttribute("aria-label", `Go to photo ${index + 1}`);

            dot.addEventListener("click", () => {
                this.goToSlide(index);
                this.restartAutoSlide();
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
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

        this.track.addEventListener("transitionend", (event) => {
            this.handleTransitionEnd(event);
        });

        // Pause auto-play while the user interacts with the slider
        this.slider.addEventListener("mouseenter", () => this.stopAutoSlide());
        this.slider.addEventListener("mouseleave", () => this.startAutoSlide());

        this.slider.addEventListener("touchstart", () => this.stopAutoSlide(),
            { passive: true });
        this.slider.addEventListener("touchend", () => this.startAutoSlide(),
            { passive: true });

        window.addEventListener("resize", () => this.setPosition(false));
    }
    get realIndex() {
        if (this.currentIndex === 0) return this.total - 1;
        if (this.currentIndex === this.total + 1) return 0;
        return this.currentIndex - 1;
    }

    setPosition(animate = true) {
        const offset = this.currentIndex * this.slider.clientWidth;

        if (!animate) {
            this.track.style.transition = "none";
        }

        this.track.style.transform = `translateX(-${offset}px)`;

        if (!animate) {
            void this.track.offsetWidth;        // force the browser to apply it
            this.track.style.transition = "";   // restore CSS transition
        }

        this.updateDots();
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === this.realIndex);
        });
    }


    /* ---------- Navigation ---------- */

    nextSlide() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentIndex++;
        this.setPosition(true);
    }

    prevSlide() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentIndex--;
        this.setPosition(true);
    }

    goToSlide(index) {
        const target = index + 1;   // +1 because of the leading clone

        if (this.isAnimating || target === this.currentIndex) return;

        this.isAnimating = true;
        this.currentIndex = target;
        this.setPosition(true);
    }

    handleTransitionEnd(event) {
        if (event.target !== this.track ||
            event.propertyName !== "transform") {
            return;
        }

        this.isAnimating = false;

        // Landed on the clone of the first slide -> jump to the real first
        if (this.currentIndex === this.total + 1) {
            this.currentIndex = 1;
            this.setPosition(false);
        }

        if (this.currentIndex === 0) {
            this.currentIndex = this.total;
            this.setPosition(false);
        }
    }


    startAutoSlide() {
        this.stopAutoSlide();

        this.autoSlideTimer = setInterval(() => {
            this.nextSlide();
        }, this.interval);
    }

    stopAutoSlide() {
        if (this.autoSlideTimer !== null) {
            clearInterval(this.autoSlideTimer);
            this.autoSlideTimer = null;
        }
    }

    restartAutoSlide() {
        this.startAutoSlide();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ImageSlider("#about .slider");
});