window.addEventListener("DOMContentLoaded", () => {
  const drop = new DropdownMenu("#dummy");
});

class DropdownMenu {
  /** Animation objects */
  animations = [];
  /** Options for this menu */
  options = [
    { name: "Points", friendlyName: "Points" },
    { name: "Angle", friendlyName: "Angle" },
    { name: "Reset", friendlyName: "Reset" },
  ];
  /** Selected option by name */
  selected = "Points";
  /** Menu is collapsing */
  isCollapsing = false;
  /** Menu is expanding */
  isExpanding = false;
  /** Actions to run after collapsing the item. */
  animActionsCollapse = {
    onfinish: this.onAnimationFinish.bind(this, false),
    oncancel: () => {
      this.isCollapsing = false;
    },
  };
  /** Actions to run after expanding the item. */
  animActionsExpand = {
    onfinish: this.onAnimationFinish.bind(this, true),
    oncancel: () => {
      this.isExpanding = false;
    },
  };
  /**
   * @param el CSS selector of the menu
   */
  constructor(el) {
    this.el = document.querySelector(el);
    this.menuButton = this.el?.querySelector("button");
    this.itemList = this.el?.querySelector("[data-items]");
    this.defaultOption();

    document.addEventListener("click", this.outsideToClose.bind(this));
    window.addEventListener("keydown", this.escToClose.bind(this));
    this.el?.addEventListener("click", this.toggle.bind(this));
    window.addEventListener("keydown", this.kbdAction.bind(this));
  }
  /** Transition duration specific to the menu */
  get transDuration() {
    if (this.el) {
      const style = getComputedStyle(this.el);
      const rawDur = style.getPropertyValue("--drop-trans-dur");
      let dur = rawDur.substring(0, rawDur.indexOf("s"));
      const mIndex = dur.indexOf("m");

      if (mIndex > -1) {
        dur = dur.substring(0, mIndex);
        return +dur;
      }
      // seconds to milliseconds
      return +dur * 1e3;
    }
    return 0;
  }
  /** Display the default selected option. */
  defaultOption() {
    const buttonEl = this.itemList?.querySelector(`[value="${this.selected}"]`);
    buttonEl?.classList.add("drop__btn--selected");

    if (this.menuButton) {
      const optionFound = this.options.find(
        (option) => option.name === this.selected
      );
      this.menuButton.textContent = optionFound?.friendlyName || "";
    }
  }
  /**
   * Navigate the menu options with arrow keys.
   * @param e Keydown event
   */
  kbdAction(e) {
    const { key } = e;
    const tabOrArrow =
      key === "Tab" || key === "ArrowUp" || key === "ArrowDown";
    const notAnimating = !this.isExpanding && !this.isCollapsing;

    if (
      notAnimating &&
      this.menuButton?.ariaExpanded === "true" &&
      tabOrArrow
    ) {
      this.navigateOption(e);
    }
  }
  /**
   * Press Esc to close the menu.
   * @param e Keydown event
   */
  escToClose(e) {
    if (
      e.key === "Escape" &&
      !this.isCollapsing &&
      this.menuButton?.ariaExpanded === "true"
    ) {
      this.toggle(e);
    }
  }
  /**
   * Click outside the menu to close.
   * @param e Click event
   */
  outsideToClose(e) {
    let target = e.target;
    let elFound = false;

    if (!this.isCollapsing && this.menuButton?.ariaExpanded === "true") {
      do {
        target = target.parentElement;

        if (target === this.el) {
          elFound = true;
        }
      } while (target);

      if (!elFound) {
        this.toggle(e);
      }
    }
  }
  /**
   * Navigate the menu options with arrow keys.
   * @param e Keydown event
   */
  navigateOption(e) {
    const itemList = this.el?.querySelector("[data-items]");
    const buttonEls = itemList?.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const buttonsTemp = [...buttons]; // for getting the first and last
    const first = buttonsTemp.shift();
    const last = buttonsTemp.pop();
    const currentItem = document.activeElement;
    const { key, shiftKey } = e;
    const downKey = key === "ArrowDown";
    const upKey = key === "ArrowUp";
    const currentIndex = buttons.indexOf(currentItem);

    if (!buttons.length) {
      // do nothing for no items
      e.preventDefault();
    } else if (downKey) {
      // next item, go to the first if on the last
      e.preventDefault();

      const nextIndex = currentIndex + 1;

      if (nextIndex >= buttons.length) {
        first?.focus();
        return;
      }
      buttons[nextIndex].focus();
    } else if (upKey) {
      // previous item, go to the last if on the first
      e.preventDefault();

      const prevIndex = currentIndex - 1;

      if (prevIndex < 0) {
        last?.focus();
        return;
      }
      buttons[prevIndex].focus();
    } else if (
      buttons.length === 1 ||
      ((!itemList?.contains(currentItem) || currentItem === last) && !shiftKey)
    ) {
      // go to the first item if on the last
      e.preventDefault();
      first?.focus();
    } else if (
      (!itemList?.contains(currentItem) || currentItem === first) &&
      shiftKey
    ) {
      // go to the last item if on the first
      e.preventDefault();
      last?.focus();
    }
  }
  /**
   * Open or close the menu.
   * @param e Click event
   */
  toggle(e) {
    e.preventDefault();
    this.el?.classList.remove("drop--collapsing", "drop--expanding");

    const shouldExpand = this.menuButton?.ariaExpanded === "true";

    if (this.isCollapsing || !shouldExpand) {
      this.expand();
    } else if (this.isExpanding || shouldExpand) {
      this.collapse(e);
    }
  }
  /** Expand the menu. */
  expand() {
    if (!this.el || !this.itemList) return;

    this.itemList.style.height = `${this.itemList.offsetHeight}px`;
    this.menuButton?.setAttribute("aria-expanded", "true");
    this.el.classList.add("drop--expanding");
    this.isExpanding = true;
    // reset the animations
    this.animations.forEach((anim) => anim.cancel());
    this.animations = [];

    const buttonEls = this.itemList.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    // animate the menu height
    const startHeight = this.itemList.offsetHeight || 0;
    const endHeight = this.itemList.firstElementChild?.offsetHeight || 0;
    const itemListAnim = this.itemList.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      {
        duration: this.transDuration,
        easing: "cubic-bezier(0.33,1,0.68,1.33)",
      }
    );
    itemListAnim.onfinish = this.animActionsExpand.onfinish;
    itemListAnim.oncancel = this.animActionsExpand.oncancel;
    this.animations.push(itemListAnim);
    // animate the buttons
    buttons.forEach((button, i) => {
      // animate the buttons
      const buttomAnim = button.animate(
        { transform: ["translateY(100%)", "translateY(0)"] },
        {
          duration: this.transDuration,
          delay: (this.transDuration / 12) * i,
          easing: "cubic-bezier(0.33,1,0.68,1)",
        }
      );
      this.animations.push(buttomAnim);
    });
    // animate the flare
    this.el.style.setProperty("--drop-flare-dist", `${endHeight}px`);
  }
  /**
   * Collapse the menu.
   * @param e Click event
   */
  collapse(e) {
    if (!this.el || !this.itemList) return;

    this.el.classList.add("drop--collapsing");
    this.isCollapsing = true;
    // reset the animations
    this.animations.forEach((anim) => anim.cancel());
    this.animations = [];

    const clickedButton = e.target;
    const buttonEls = this.itemList?.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    // animate the menu height
    const startHeight = this.itemList?.offsetHeight || 0;
    const endHeight = 0;
    const easing = "cubic-bezier(0.33,1,0.68,1)";
    const itemListAnim = this.itemList.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: this.transDuration, easing }
    );
    itemListAnim.onfinish = this.animActionsCollapse.onfinish;
    itemListAnim.oncancel = this.animActionsCollapse.oncancel;
    this.animations.push(itemListAnim);
    // animate the buttons
    buttons.forEach((button, i) => {
      if (clickedButton.value) {
        // remove the previous checkmark after selecting an option
        button.classList.remove("drop__btn--selected");
      }
      // animate the buttons
      const delayInc = this.transDuration / 12;
      const buttomAnim = button.animate(
        { transform: ["translateY(0)", "translateY(100%)"] },
        {
          duration: this.transDuration,
          delay: delayInc * (buttons.length - 1) - delayInc * i,
          easing,
        }
      );
      this.animations.push(buttomAnim);
    });
    if (clickedButton.value) {
      // set this menu’s option from a `value`
      clickedButton.classList.add("drop__btn--selected");

      if (this.menuButton) {
        const optionFound = this.options.find(
          (option) => option.name === clickedButton.value
        );
        this.menuButton.textContent = optionFound?.friendlyName || "";
      }
    }
    this.menuButton?.focus();
    // animate the flare
    this.el.style.setProperty("--drop-flare-dist", `${endHeight}px`);
  }
  /**
   * Actions to run when the animation is finished
   * @param open Menu should be expanded
   */
  onAnimationFinish(open) {
    if (!this.el || !this.itemList) return;

    this.menuButton?.setAttribute("aria-expanded", `${open}`);
    this.animations = [];
    this.isCollapsing = false;
    this.isExpanding = false;
    this.itemList.style.height = "";
    this.el?.classList.remove("drop--collapsing", "drop--expanding");
  }
}
