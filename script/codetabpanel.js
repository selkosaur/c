import { codeToHtml } from "https://esm.sh/shiki@1.0.0";
import { makeEl } from "./utils.js";
import { code2, eye, clipboardCheck, copy } from "./icons.js";
// preview tab
// and code tab

/**
 * @type {Record<CodeTabPanel['tabNames'][number], string>}
 */
const iconMap = {
  preview: eye,
  code: code2,
};

export class CodeTabPanel {
  tabKeys = {
    preview: true,
    code: true,
  };
  /**
   * @type {Array<keyof CodeTabPanel['tabKeys']>}
   */
  tabNames = ["preview", "code"];
  /**
   * @type {Record<CodeTabPanel['tabNames'][number], HTMLElement>}
   */
  tabButtons = {};
  /**
   * @type {Record<CodeTabPanel['tabNames'][number], HTMLElement>}
   */
  panels = {};
  /**
   * @type {Record<CodeTabPanel['tabNames'][number], HTMLElement>}
   */
  contentEls = {};
  tabsContainer = makeEl("ul", { classlist: "nav-list" });
  panelContainer = makeEl("div", { classlist: "panel-container" });
  fullContainer = makeEl("div", {
    attribs: {
      "data-component": `true`,
    },
  });
  /**
   * @param {string} label
   * @param {HTMLElement|string} previewContent For the preview of the el.
   * @param {string} codeContent The code corresponding.
   */
  constructor(label, previewContent, codeContent) {
    if (
      !(previewContent instanceof HTMLElement) &&
      typeof previewContent !== string
    ) {
      throw new Error(`Invalid preview content passed`);
    }
    if (previewContent instanceof HTMLElement) {
      this.contentEls["preview"] = previewContent;
    } else {
      this.contentEls["preview"] = makeEl("div", { innerhtml: previewContent });
    }

    this.label = label;
    this.codeContent = codeContent;
  }
  /**
   *
   * @param {keyof CodeTabPanel['tabKeys']} defaultShow
   */
  create(defaultShow = "preview") {
    this.makePanels();
    this.fullContainer.append(this.tabsContainer, this.panelContainer);
    this.fullContainer.setAttribute(`data-label`, this.label);
    if (this.tabNames.includes(defaultShow)) {
      this.showPanel(defaultShow);
    }
    return this.fullContainer;
  }
  makePanels() {
    const panels = this.tabNames.map((tabName) => {
      //tab element
      const liWrapper = makeEl("li", { classlist: "nav-item" });
      const icon = iconMap[tabName];
      const button = makeEl("button", {
        innerhtml: icon,
        classlist: `nav-link`,
      });
      liWrapper.append(button);
      button.addEventListener("click", () => {
        this.showPanel(tabName);
      });
      this.tabButtons[tabName] = button;
      this.tabsContainer.append(liWrapper);

      //panel element
      const panel = makeEl("div", {
        classlist: `panel ${tabName}`,
      });
      panel.style.display = `none`;
      this.panels[tabName] = panel;

      if (tabName === "preview") {
        panel.append(this.contentEls["preview"]);
      } else {
        const codeEl = makeEl("div", {
          innerhtml: `waiting for code`,
          classlist: `code-content`,
          attribs: {
            style: `position:relative;width:100%;height:100%;`,
          },
        });
        // codeEl.style.position = `relative`;
        this.contentEls["code"] = codeEl;

        panel.append(this.contentEls["code"]);
        // don't wait for the async function to load the code to complete, but do call it here
        this.renderCode();
      }
      return panel;
    });

    this.panelContainer.append(...panels);

    return this;
  }
  get panelsArr() {
    return Object.values(this.panels);
  }
  /**
   * @param {keyof CodeTabPanel['panels']} panelName
   */
  _showPanel(panelName) {
    /**
     * @type {[keyof CodeTabPanel['tabKeys'], HTMLElement][]}
     */
    const ents = Object.entries(this.panels);
    ents.forEach(([key, el]) => {
      const s = el.style;
      const isToShow = key === panelName;

      s.display = isToShow ? "block" : "none";
      this.tabButtons[key].classList.toggle(`active`, isToShow);
    });
  }
  /**
   * @type {CodeTabPanel['_showPanel']} The bound method.
   */
  showPanel = this._showPanel.bind(this);

  async renderCode() {
    this.contentEls.code.innerHTML = await codeToHtml(this.codeContent, {
      lang: `css`,
      theme: `rose-pine`,
    });

    // create code copy button
    const copyButton = makeEl("button", {
      innerhtml: copy,
      classlist: `code-copy`,
      attribs: {
        style: `position:absolute;top:5px;right:5px;`,
      },
    });
    this.contentEls.code.append(copyButton);
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(this.codeContent);
      copyButton.innerHTML = clipboardCheck;

      setTimeout(() => {
        copyButton.innerHTML = copy;
      }, 1000);
    });
  }
}

`<div class="nav-menu dark-mode">
    <ul class="nav-list">
        <li class="nav-item">
            <a href="#" class="nav-link hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Profile</a>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500" aria-current="page">Dashboard</a>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Settings</a>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Contacts</a>
        </li>
        <li class="nav-item">
            <a class="nav-link disabled dark:text-gray-500">Disabled</a>
        </li>
    </ul>
</div>
`;
