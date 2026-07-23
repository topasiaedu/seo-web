/**
 * @fileoverview Dual-layer drag carousel ported from GHL custom-code-NFPO0kzh4m.js.
 * Populates `#myLayer1` / `#myLayer2` and animates horizontal scroll with drag.
 */

/** Single review card payload used by the GHL carousel. */
type GhlReview = {
  readonly name: string;
  readonly age: number;
  readonly industry: string;
  readonly review: string;
  readonly stars: number;
};

const REVIEWS: readonly GhlReview[] = [
  {
    name: "Nicole",
    age: 29,
    industry: "E-commerce",
    review:
      "Before this session, I kept pivoting every few months. After decoding my chart, I realized I was chasing a path that wasn't meant for me. I now run a business that feels effortless and I'm finally seeing consistent income.",
    stars: 5,
  },
  {
    name: "Darren",
    age: 34,
    industry: "Marketing",
    review:
      "This gave me more clarity than any coach ever has. I stopped applying for random jobs, and started building a path that fits me exactly.",
    stars: 5,
  },
  {
    name: "Amanda",
    age: 27,
    industry: "Graphic Design",
    review:
      "Within a week of applying what I learned, I turned down two bad fit clients and landed one that paid double, because I finally knew what aligned with my energy.",
    stars: 5,
  },
  {
    name: "Kelvin",
    age: 32,
    industry: "Insurance Agent",
    review:
      "I always thought I had a 'money block.' Turns out, I just had the wrong timing. Once I saw my chart, I stopped self-sabotaging and became the top sales of the month.",
    stars: 5,
  },
  {
    name: "Joanne",
    age: 41,
    industry: "Healthcare",
    review:
      "This wasn't just about business. It helped me fix my focus, plan long-term, and stop feeling like I was behind. I finally feel like I'm building something that lasts.",
    stars: 5,
  },
  {
    name: "Joshua",
    age: 36,
    industry: "Education",
    review:
      "My colleague noticed it first 'You're clearer. Sharper.' I'm leading with more confidence because I'm no longer doubting every decision.",
    stars: 5,
  },
  {
    name: "Michelle",
    age: 31,
    industry: "Technology",
    review:
      "For years I worked hard but felt stuck. Now I know why. This chart showed me exactly how I'm wired to succeed — and it changed everything.",
    stars: 5,
  },
  {
    name: "KS",
    age: 28,
    industry: "Engineer",
    review:
      "After finding my own strengths through the chart, I received a high salary offer from a big company and they wanted me to start immediately. Originally, I thought I'd take a few months to rest but within just 2 weeks, I landed the job with a salary jump from RM4K to RM8K.",
    stars: 5,
  },
  {
    name: "Elaine",
    age: 38,
    industry: "Real Estate",
    review:
      "Before this, I was stuck underpaid and overworked. After realigning my timing and energy, I finally dared to ask for what I was worth and got a 40% raise in one shot.",
    stars: 5,
  },
  {
    name: "Jason",
    age: 43,
    industry: "Consulting",
    review:
      "At first, I didn't really believe the health warning mentioned in my chart — it felt too 'coincidental.' But just a few weeks later, I was diagnosed with an early-stage condition exactly in the area pointed out. Thanks to that early headsup, I could take action quickly and prevent it from getting worse.",
    stars: 5,
  },
];

/**
 * Returns a shallow-shuffled copy of the reviews list.
 *
 * @param reviews - Source reviews
 * @returns New array in random order
 */
function shuffleReviews(reviews: readonly GhlReview[]): GhlReview[] {
  return reviews
    .map((r) => ({ review: r, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.review);
}

/**
 * Renders review cards into a carousel layer element.
 *
 * @param layer - Target layer DOM node
 * @param reviews - Reviews to render
 */
function populateLayer(layer: HTMLElement, reviews: readonly GhlReview[]): void {
  layer.replaceChildren();
  for (const review of reviews) {
    const card = document.createElement("div");
    card.className = "card";

    const quoteIcon = document.createElement("div");
    quoteIcon.className = "quote-icon";
    quoteIcon.textContent = "❝";

    const quoteText = document.createElement("p");
    quoteText.className = "quote-text";
    quoteText.textContent = review.review;

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    const initial = review.name.charAt(0);
    avatar.textContent = initial.length > 0 ? initial : "?";

    const userInfo = document.createElement("div");
    userInfo.className = "user-info";

    const nameEl = document.createElement("h3");
    nameEl.textContent = review.name;

    const subtext = document.createElement("p");
    subtext.className = "subtext";
    subtext.textContent = `${String(review.age)}, ${review.industry}`;

    const stars = document.createElement("div");
    stars.className = "stars";
    for (let i = 0; i < review.stars; i += 1) {
      const star = document.createElement("span");
      star.textContent = "⭐";
      stars.appendChild(star);
    }

    userInfo.append(nameEl, subtext, stars);
    footer.append(avatar, userInfo);
    card.append(quoteIcon, quoteText, footer);
    layer.appendChild(card);
  }
}

let activeCleanup: (() => void) | null = null;

/**
 * Initializes (or re-initializes) the GHL testimonial carousel on the page.
 * Safe to call on `astro:page-load`.
 */
export function initGhlTestimonialCarousel(): void {
  if (activeCleanup !== null) {
    activeCleanup();
    activeCleanup = null;
  }

  const layer1 = document.getElementById("myLayer1");
  const layer2 = document.getElementById("myLayer2");
  const carouselContainer = document.querySelector(".carousel-container");

  if (
    !(layer1 instanceof HTMLElement) ||
    !(layer2 instanceof HTMLElement) ||
    !(carouselContainer instanceof HTMLElement)
  ) {
    return;
  }

  populateLayer(layer1, shuffleReviews(REVIEWS));
  populateLayer(layer2, shuffleReviews(REVIEWS));

  let animationFrame = 0;
  let isDragging = false;
  let startX = 0;
  let scrollStart1 = 0;
  let scrollStart2 = 0;
  let scrollPosition1 = 0;
  let scrollPosition2 = -150;

  const animate = (): void => {
    if (!isDragging) {
      scrollPosition1 -= 0.2;
      scrollPosition2 -= 0.2;

      if (scrollPosition2 <= -layer2.scrollWidth / 3) {
        populateLayer(layer1, shuffleReviews(REVIEWS));
        populateLayer(layer2, shuffleReviews(REVIEWS));
        scrollPosition1 = 0;
        scrollPosition2 = -150;
      }

      layer1.style.transform = `translateX(${String(scrollPosition1)}px)`;
      layer2.style.transform = `translateX(${String(scrollPosition2)}px)`;
    }
    animationFrame = window.requestAnimationFrame(animate);
  };

  const onMouseDown = (event: MouseEvent): void => {
    isDragging = true;
    window.cancelAnimationFrame(animationFrame);
    startX = event.clientX;
    scrollStart1 = scrollPosition1;
    scrollStart2 = scrollPosition2;
  };

  const onMouseMove = (event: MouseEvent): void => {
    if (!isDragging) {
      return;
    }
    const dx = event.clientX - startX;
    scrollPosition1 = scrollStart1 + dx;
    scrollPosition2 = scrollStart2 + dx;
    layer1.style.transform = `translateX(${String(scrollPosition1)}px)`;
    layer2.style.transform = `translateX(${String(scrollPosition2)}px)`;
  };

  const onMouseUp = (): void => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    animate();
  };

  const onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches.item(0);
    if (touch === null) {
      return;
    }
    isDragging = true;
    window.cancelAnimationFrame(animationFrame);
    startX = touch.clientX;
    scrollStart1 = scrollPosition1;
    scrollStart2 = scrollPosition2;
  };

  const onTouchMove = (event: TouchEvent): void => {
    if (!isDragging) {
      return;
    }
    const touch = event.touches.item(0);
    if (touch === null) {
      return;
    }
    const dx = touch.clientX - startX;
    scrollPosition1 = scrollStart1 + dx;
    scrollPosition2 = scrollStart2 + dx;
    layer1.style.transform = `translateX(${String(scrollPosition1)}px)`;
    layer2.style.transform = `translateX(${String(scrollPosition2)}px)`;
  };

  const onTouchEnd = (): void => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    animate();
  };

  const onMouseEnter = (): void => {
    if (!isDragging) {
      window.cancelAnimationFrame(animationFrame);
    }
  };

  const onMouseLeave = (): void => {
    if (!isDragging) {
      animate();
    }
  };

  carouselContainer.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  carouselContainer.addEventListener("touchstart", onTouchStart, {
    passive: true,
  });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd);
  carouselContainer.addEventListener("mouseenter", onMouseEnter);
  carouselContainer.addEventListener("mouseleave", onMouseLeave);

  animate();

  activeCleanup = (): void => {
    window.cancelAnimationFrame(animationFrame);
    carouselContainer.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    carouselContainer.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    carouselContainer.removeEventListener("mouseenter", onMouseEnter);
    carouselContainer.removeEventListener("mouseleave", onMouseLeave);
  };
}
