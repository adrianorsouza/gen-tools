import parseJSTokens from './parseJSTokens.mjs';
import formatContent from './formatContent.mjs';

export default function formatterEs6File({ dictionary, options }) {
  const properties = parseJSTokens(dictionary);

  let content = ``;
  content += formatContent('color', properties, false);
  content += formatContent('typography', properties, false);
  content += formatContent('spacing', properties, false);
  content += formatContent('radius', properties, false);
  content += formatContent('border', properties, false);
  content += formatContent('border_width', properties, false);
  content += formatContent('box_shadow', properties, false);
  content += formatContent('container', properties, false);
  content += formatContent('breakpoint', properties, false);
  content += formatContent('transition', properties, false);
  content += formatContent('opacity', properties, false).trimEnd();

  const templateFile = `${options
    .fileHeader([])
    .map((i) => `// ${i}`.trimEnd())
    .join('\n')}
import { DefaultTheme } from "styled-components";
const theme: DefaultTheme = {{{ CONTENT }}
}

export default theme;
`;
  return templateFile.replace('{{ CONTENT }}', content).replace(/"/g, '\'');
}
