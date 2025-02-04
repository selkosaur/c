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
