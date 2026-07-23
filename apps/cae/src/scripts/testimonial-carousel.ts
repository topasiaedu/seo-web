/**
 * @fileoverview Dual-layer drag-enabled testimonial carousel for the CAE homepage.
 * No-ops when expected DOM nodes or review data are missing.
 */

/**
 * One review entry rendered into a carousel card.
 */
export type CarouselReviewInput = {
  readonly name: string;
  readonly age: number;
  readonly industry: string;
  readonly review: string;
  readonly stars: number;
};

/**
 * Optional boot options for {@link initTestimonialCarousel}.
 */
export type TestimonialCarouselOptions = {
  /** Review list; when omitted, reads JSON from `[data-carousel-reviews]`. */
  readonly reviews?: ReadonlyArray<CarouselReviewInput>;
  /** Root used for querySelector (defaults to `document`). */
  readonly root?: ParentNode;
};

const SCROLL_SPEED_PX = 0.2;
const LAYER_TWO_OFFSET_PX = -150;
const RESET_FRACTION = 1 / 3;

/**
 * Reads a named own property from an object without unsafe casts.
 *
 * @param source - Object to read
 * @param key - Property name
 * @returns Property value or `undefined`
 */
function readOwnProperty(source: object, key: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(source, key)) {
    return undefined;
  }
  return Reflect.get(source, key);
}

/**
 * Type guard for a usable carousel review object.
 *
 * @param value - Candidate review payload
 * @returns True when required fields are present and typed correctly
 */
function isCarouselReview(value: unknown): value is CarouselReviewInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const name = readOwnProperty(value, "name");
  const age = readOwnProperty(value, "age");
  const industry = readOwnProperty(value, "industry");
  const review = readOwnProperty(value, "review");
  const stars = readOwnProperty(value, "stars");
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof age === "number" &&
    Number.isFinite(age) &&
    typeof industry === "string" &&
    industry.trim().length > 0 &&
    typeof review === "string" &&
    review.trim().length > 0 &&
    typeof stars === "number" &&
    Number.isFinite(stars) &&
    stars > 0
  );
}

/**
 * Parses a JSON string into a validated review list.
 *
 * @param raw - JSON text from a data attribute
 * @returns Validated reviews, or an empty array when invalid
 */
function parseReviewsJson(raw: string): CarouselReviewInput[] {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isCarouselReview);
  } catch {
    return [];
  }
}

/**
 * Shuffles a review list without mutating the source.
 *
 * @param reviews - Source reviews
 * @returns New array in random order
 */
function shuffleReviews(
  reviews: ReadonlyArray<CarouselReviewInput>,
): CarouselReviewInput[] {
  return reviews
    .map((review) => ({ review, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.review);
}

/**
 * Builds a star string for the given rating.
 * Matches the GHL carousel custom-code glyph (filled star), colored gold in CSS.
 *
 * @param stars - Positive star count
 * @returns Repeated star characters
 */
function buildStars(stars: number): string {
  const count = Math.max(0, Math.floor(stars));
  return "★".repeat(count);
}

/**
 * Populates a carousel layer with review cards using DOM APIs (no HTML injection).
 *
 * @param layer - Layer element to fill
 * @param reviews - Reviews to render
 */
function populateLayer(
  layer: HTMLElement,
  reviews: ReadonlyArray<CarouselReviewInput>,
): void {
  layer.replaceChildren();

  for (const review of reviews) {
    const card = document.createElement("article");
    card.className = "cae-testimonials__carousel-card";
    card.setAttribute("data-carousel-card", "true");

    const quoteIcon = document.createElement("div");
    quoteIcon.className = "cae-testimonials__quote-icon";
    quoteIcon.setAttribute("aria-hidden", "true");
    quoteIcon.textContent = "❝";

    const quoteText = document.createElement("p");
    quoteText.className = "cae-testimonials__carousel-text";
    quoteText.textContent = review.review;

    const footer = document.createElement("div");
    footer.className = "cae-testimonials__carousel-footer";

    const avatar = document.createElement("div");
    avatar.className = "cae-testimonials__avatar";
    avatar.setAttribute("aria-hidden", "true");
    const initial = review.name.trim().charAt(0);
    avatar.textContent = initial.length > 0 ? initial.toUpperCase() : "?";

    const userInfo = document.createElement("div");
    userInfo.className = "cae-testimonials__user-info";

    const nameEl = document.createElement("h3");
    nameEl.className = "cae-testimonials__user-name";
    nameEl.textContent = review.name;

    const metaEl = document.createElement("p");
    metaEl.className = "cae-testimonials__user-meta";
    metaEl.textContent = `${String(review.age)}, ${review.industry}`;

    const starsEl = document.createElement("div");
    starsEl.className = "cae-testimonials__carousel-stars";
    starsEl.setAttribute(
      "aria-label",
      `${String(Math.floor(review.stars))} out of 5 stars`,
    );
    starsEl.textContent = buildStars(review.stars);

    userInfo.append(nameEl, metaEl, starsEl);
    footer.append(avatar, userInfo);
    card.append(quoteIcon, quoteText, footer);
    layer.append(card);
  }
}

/**
 * Resolves reviews from options or from the carousel root data attribute.
 *
 * @param container - Carousel root element
 * @param options - Boot options
 * @returns Validated review list
 */
function resolveReviews(
  container: HTMLElement,
  options: TestimonialCarouselOptions,
): CarouselReviewInput[] {
  if (Array.isArray(options.reviews) && options.reviews.length > 0) {
    return options.reviews.filter(isCarouselReview);
  }
  const raw = container.getAttribute("data-carousel-reviews");
  if (typeof raw === "string") {
    return parseReviewsJson(raw);
  }
  return [];
}

/**
 * Initializes the dual-layer scrolling testimonial carousel.
 * Returns immediately (no-op) when required nodes or reviews are missing.
 *
 * @param options - Optional reviews list and query root
 */
export function initTestimonialCarousel(
  options: TestimonialCarouselOptions = {},
): void {
  const root: ParentNode =
    typeof options.root === "undefined" ? document : options.root;

  const container = root.querySelector("[data-testimonial-carousel]");
  const layer1 = root.querySelector("[data-carousel-layer=\"1\"]");
  const layer2 = root.querySelector("[data-carousel-layer=\"2\"]");

  if (
    !(container instanceof HTMLElement) ||
    !(layer1 instanceof HTMLElement) ||
    !(layer2 instanceof HTMLElement)
  ) {
    return;
  }

  const reviews = resolveReviews(container, options);
  if (reviews.length === 0) {
    return;
  }

  let animationFrame = 0;
  let isDragging = false;
  let startX = 0;
  let scrollStart1 = 0;
  let scrollStart2 = 0;
  let scrollPosition1 = 0;
  let scrollPosition2 = LAYER_TWO_OFFSET_PX;

  populateLayer(layer1, shuffleReviews(reviews));
  populateLayer(layer2, shuffleReviews(reviews));

  /**
   * Continuous auto-scroll loop; pauses while the user drags.
   */
  const animate = (): void => {
    if (!isDragging) {
      scrollPosition1 -= SCROLL_SPEED_PX;
      scrollPosition2 -= SCROLL_SPEED_PX;

      if (scrollPosition2 <= -layer2.scrollWidth * RESET_FRACTION) {
        populateLayer(layer1, shuffleReviews(reviews));
        populateLayer(layer2, shuffleReviews(reviews));
        scrollPosition1 = 0;
        scrollPosition2 = LAYER_TWO_OFFSET_PX;
      }

      layer1.style.transform = `translateX(${String(scrollPosition1)}px)`;
      layer2.style.transform = `translateX(${String(scrollPosition2)}px)`;
    }
    animationFrame = window.requestAnimationFrame(animate);
  };

  /**
   * Starts drag tracking from a client X position.
   *
   * @param clientX - Pointer X coordinate
   */
  const beginDrag = (clientX: number): void => {
    isDragging = true;
    window.cancelAnimationFrame(animationFrame);
    startX = clientX;
    scrollStart1 = scrollPosition1;
    scrollStart2 = scrollPosition2;
  };

  /**
   * Updates layer transforms while dragging.
   *
   * @param clientX - Pointer X coordinate
   */
  const moveDrag = (clientX: number): void => {
    if (!isDragging) {
      return;
    }
    const dx = clientX - startX;
    scrollPosition1 = scrollStart1 + dx;
    scrollPosition2 = scrollStart2 + dx;
    layer1.style.transform = `translateX(${String(scrollPosition1)}px)`;
    layer2.style.transform = `translateX(${String(scrollPosition2)}px)`;
  };

  /**
   * Ends drag and resumes auto-scroll.
   */
  const endDrag = (): void => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    animate();
  };

  container.addEventListener("mousedown", (event: MouseEvent) => {
    beginDrag(event.clientX);
  });

  window.addEventListener("mousemove", (event: MouseEvent) => {
    moveDrag(event.clientX);
  });

  window.addEventListener("mouseup", () => {
    endDrag();
  });

  container.addEventListener(
    "touchstart",
    (event: TouchEvent) => {
      if (event.touches.length === 0) {
        return;
      }
      const touch = event.touches.item(0);
      if (touch === null) {
        return;
      }
      beginDrag(touch.clientX);
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (event: TouchEvent) => {
      if (!isDragging || event.touches.length === 0) {
        return;
      }
      const touch = event.touches.item(0);
      if (touch === null) {
        return;
      }
      moveDrag(touch.clientX);
    },
    { passive: true },
  );

  window.addEventListener("touchend", () => {
    endDrag();
  });

  container.addEventListener("mouseenter", () => {
    if (!isDragging) {
      window.cancelAnimationFrame(animationFrame);
    }
  });

  container.addEventListener("mouseleave", () => {
    if (!isDragging) {
      animate();
    }
  });

  animate();
}

/**
 * Boots the carousel when the document is ready.
 * Safe to call when markup is missing — yields a no-op.
 */
export function bootTestimonialCarousel(): void {
  const run = (): void => {
    initTestimonialCarousel();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}
