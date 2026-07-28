/**
 * @fileoverview Accessible FAQ accordion for the home FAQ band.
 * Toggles `aria-expanded` and panel visibility on button click.
 */

/** Marks the accordion root so init runs once per page. */
const INIT_FLAG = "data-dj-faq-public-init";

/** Root wrapper for FAQ accordion items. */
const ACCORDION_SELECTOR = "[data-faq-accordion]";

/** Single FAQ item wrapper. */
const ITEM_SELECTOR = "[data-faq-item]";

/** Expand/collapse button inside an item. */
const TRIGGER_SELECTOR = "[data-faq-trigger]";

/** Answer panel controlled by the trigger. */
const PANEL_SELECTOR = "[data-faq-panel]";

/**
 * Sets open/closed state on one FAQ item.
 *
 * @param item - FAQ item wrapper element
 * @param open - Whether the panel should be visible
 */
function setItemOpen(item: HTMLElement, open: boolean): void {
  const trigger = item.querySelector<HTMLButtonElement>(TRIGGER_SELECTOR);
  const panel = item.querySelector<HTMLElement>(PANEL_SELECTOR);
  if (trigger === null || panel === null) {
    return;
  }

  item.dataset.open = open ? "true" : "false";
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    panel.removeAttribute("hidden");
  } else {
    panel.setAttribute("hidden", "");
  }
}

/**
 * Collapses every FAQ item except the one being opened (optional accordion mode).
 *
 * @param accordion - Accordion root element
 * @param exceptItem - Item to leave unchanged
 */
function closeOtherItems(accordion: HTMLElement, exceptItem: HTMLElement): void {
  const items = accordion.querySelectorAll<HTMLElement>(ITEM_SELECTOR);
  for (const item of items) {
    if (item !== exceptItem) {
      setItemOpen(item, false);
    }
  }
}

/**
 * Wires click handlers for all FAQ accordion triggers under the page root.
 * Idempotent via `data-dj-faq-public-init` on `document.body`.
 */
export function initFaqPublicAccordion(): void {
  if (document.body.hasAttribute(INIT_FLAG)) {
    return;
  }
  document.body.setAttribute(INIT_FLAG, "true");

  const accordions = document.querySelectorAll<HTMLElement>(ACCORDION_SELECTOR);
  for (const accordion of accordions) {
    const triggers = accordion.querySelectorAll<HTMLButtonElement>(TRIGGER_SELECTOR);
    for (const trigger of triggers) {
      trigger.addEventListener("click", () => {
        const item = trigger.closest<HTMLElement>(ITEM_SELECTOR);
        if (item === null) {
          return;
        }
        const isOpen = item.dataset.open === "true";
        if (isOpen) {
          setItemOpen(item, false);
          return;
        }
        closeOtherItems(accordion, item);
        setItemOpen(item, true);
      });
    }
  }
}

if (typeof document !== "undefined") {
  initFaqPublicAccordion();
}
