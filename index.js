const contentEl = document.querySelector(`#content`);
var divs = document.querySelectorAll("#content > div");
for (var i = 0; i < divs.length; i++) {
  let div = divs[i];
  let num = i + 1;
  div.classList.add("bx" + num);
  let ct = document.querySelector(".boxcount");
  ct.innerHTML = divs.length;
}
const scbsectionheader = makeEl("h1", {
  innerhtml: "scb",
  classlist: "section-header",
  attribs: {
    id: "scb",
  },
});
const scrollbardivs = [];
const dummytext = `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"


      `;
const uniquenames = ["skinny", "trackslider"];
uniquenames.forEach((scrollbar) => {
  const div = makeEl("div", {
    innerhtml: `${dummytext}`,
    classlist: `scb-${scrollbar}`,
  });
  scrollbardivs.push(div);
});
for (let x = 0; x < 15; x++) {
  const div = makeEl("div", {
    innerhtml: `${dummytext}`,
    classlist: `scb${x + 1}`,
  });
  scrollbardivs.push(div);
}
contentEl.append(scbsectionheader, ...scrollbardivs);

/**
 *
 * @param {keyof HTMLElementTagNameMap} tagname tag name for the element
 * @param {{classlist:string,innerhtml:string,cssprops:{string:string},attribs:{string:string}}} options
 * @returns
 */
export function makeEl(tagname, options) {
  if (!tagname) {
    console.error("no element type specified");
    return;
  }
  /**
   * @type {HTMLElement}
   */
  let el = document.createElement(tagname);
  if (!options) return el;

  if (options.classlist) {
    el.classList.add(
      ...options.classlist
        .split(" ")
        .map((str) => str.trim())
        .filter((str) => str)
    ); // for the classlist string, separate by spaces, then trim each, then filter out any blanks
  }
  options.innerhtml ? (el.innerHTML = options.innerhtml) : "";
  if (options.cssprops) {
    Object.entries(options.cssprops).map((pair) => {
      el.style.setProperty(pair[0], pair[1]);
    });
  }
  if (options.attribs) {
    Object.entries(options.attribs).map((pair) => {
      el.setAttribute(pair[0], pair[1]);
    });
  }
  return el;
}
