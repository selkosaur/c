const getStyleSheets = () =>
  Array.from(document.styleSheets).filter((stylesheet) => {
    const u = URL.parse(stylesheet.href);
    return (
      u.hostname === document.location.hostname && !u.pathname.includes(`demo`)
    );
  });

/**
 * @type {Map<string, string>}
 */
const styleSheetTextMap = new Map();

/**
 *
 * @param {string} stylesheetUrl
 */
async function saveStylesheetToMap(stylesheetUrl) {
  const response = await fetch(stylesheetUrl);
  const cssText = await response.text();
  styleSheetTextMap.set(stylesheetUrl, cssText);
}

const stylesheets = getStyleSheets();

await Promise.all(
  stylesheets.map((stylesheet) => saveStylesheetToMap(stylesheet.href))
);

/**
 * @todo fix regex pattern to not match *anything* that starts with the className arg
 * @param {string} stylesheetUrl
 * @param {string} className
 * @returns
 */
function getOriginalClassRule(stylesheetUrl, className) {
  try {
    const cssText = styleSheetTextMap.get(stylesheetUrl);
    // Use a regular expression to find the class rule in the CSS text
    const regex = new RegExp(`\\.${className}[^\\d\\{]*\\{[^}]*\\}`, "g");

    const matches = cssText.match(regex);

    return matches ? matches.join("\n\n") : "";
  } catch (error) {
    console.error("Error fetching the stylesheet:", error);
    return "";
  }
}

/**
 *
 * @param {string} className
 */
function oldWay(className) {
  const rules = stylesheets
    .map((stylesheet) =>
      Array.from(stylesheet.cssRules || stylesheet.rules)
        .filter(
          (rule) =>
            rule.selectorText && rule.selectorText.includes(`.${className}`)
        )
        .map((rule) => rule.cssText)
    )
    .flat()
    .join("\n\n");
  return rules;
}

/**
 *
 * @param {string} className
 * @returns
 */
export function getClassRules(className) {
  const better = stylesheets
    .map((stylesheet) => {
      return getOriginalClassRule(stylesheet.href, className);
    })
    .join("\n\n");

  return better;
}
