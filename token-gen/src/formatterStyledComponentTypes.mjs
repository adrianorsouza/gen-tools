import formatContent from './formatContent.mjs';
import parseJSTokens from './parseJSTokens.mjs';

export default function formatterStyledComponentTypes({ dictionary, options }) {
  const properties = parseJSTokens(dictionary);

  let content = ``;
  content += formatContent('color', properties);
  content += formatContent('typography', properties);
  content += formatContent('spacing', properties);
  content += formatContent('radius', properties);
  content += formatContent('border', properties);
  content += formatContent('border_width', properties);
  content += formatContent('box_shadow', properties);
  content += formatContent('container', properties);
  content += formatContent('breakpoint', properties);
  content += formatContent('transition', properties);
  content += formatContent('opacity', properties);

  const templateFile = `${options
    .fileHeader([])
    .map((i) => `// ${i}`)
    .join('\n')}
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
  {{ CONTENT }}
  }
}
`;
  return templateFile.replace('{{ CONTENT }}', content).replace(/"/g, '\'');
}
