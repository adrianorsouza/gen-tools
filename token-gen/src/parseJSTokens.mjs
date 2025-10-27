/**
 * Parses Style Dictionary token into JS format.
 *
 * @created 2023-04-28 16:26
 * @author  Adriano Rosa <info@adrianrosa.com>
 *
 * @return  Set<?>
 * */
export default function parseJSTokens(dictionary) {
  const types = new Map();
  dictionary.allTokens.map((token) => {
    let value = JSON.stringify(token.value);
    let description = token.original.description?.trimEnd();
    if (token.type === 'color' && token.path.length === 1) {
      types.set(`color_${token.name}`, { value, description: token.original.description });
    } else {
      types.set(token.name, { value, description });
    }
  });

  const properties = new Set();

  types.forEach(({ value, description }, key) => {
    // k: key, v: value, d: description
    let v = value.replace(/"/g, '');
    // This helps the IntelliSense shows the colorized doc block for colors info on typescript usage
    const comment = key.startsWith('color') ? `// <b style='color:${v}'>${v}</b>` : `// <b>${v}</b>`;
    // The Figma Token description is parsed as comment out string
    const d = description ? ` // ${description}` : '';

    // We group all typography related attributes into a single property typography
    let groupFonts = key.match(/font_family|font_size|font_weight|text_decoration|line_height|text_case/);
    if (groupFonts !== null) {
      let matchKey = groupFonts[0];
      // converts font families string name to CSS variables var(--font-family-[value])
      if (matchKey === 'font_family') {
        v = `var(--${key.replace(/_/g, '-')})`;
      }
      properties.add({
        typography: {
          [matchKey]: {
            ...{ child: matchKey, k: key.replace(`${matchKey}_`, ''), v, d, comment },
          },
        },
      });
    }

    // We handle all the remaining attributes into on their group of properties
    let groupCommons = key.match(/^color|spacing|radius|border_width|border|box_shadow|container|breakpoint|transition|opacity/);
    if (groupCommons !== null) {
      let gcKey = groupCommons[0];
      properties.add({
        [gcKey]: {
          ...{
            k: key.replace(`${gcKey}_`, ''),
            v: value,
            d,
            comment,
          },
        },
      });
    }
  });

  return properties;
}
