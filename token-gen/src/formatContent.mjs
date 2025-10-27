function formatContent(key, properties, typescript = true) {
  let content = '';
  let s = typescript ? '  ' : '';

  // DONT HANDLE TYPOGRAPHY
  if (key !== 'typography') {
    for (const i of properties.keys()) {
      if (!i[key]) continue;
      if (i[key]) {
        content += typescript
          ? `      ${i[key].comment}\n      ${i[key].k}: string\n`
          : `    ${i[key].k}: ${i[key].v},${i[key].d}\n`;
      }
    }
    return `
  ${s}${key}: {
${content.trimEnd()}
  ${s}},
`.trimEnd();
  } else {
    let out = ``;
    let typoOut = [];
    for (const i of properties.keys()) {
      if (!i.typography) continue;
      Object.keys(i.typography).forEach((child) => {
        if (!typoOut[child]) {
          typoOut[child] = typescript
            ? [`${i.typography[child].comment}\n        ${i.typography[child].k}: string`]
            : [`${i.typography[child].k}: '${i.typography[child].v}',${i.typography[child].d}`];
        } else {
          typoOut[child].push(
            typescript
              ? `${i.typography[child].comment}\n        ${i.typography[child].k}: string`
              : `${i.typography[child].k}: '${i.typography[child].v}',${i.typography[child].d}`
          );
        }
      });
    }

    Object.keys(typoOut).forEach((item) => {
      content += `    ${s}${item}: {
${typoOut[item].map((i) => `      ${s}${i}`).join('\n')}
    ${s}},\n`;
    });
    return `
  ${s}typography: {
${content.trimEnd()}
  ${s}},
`.trimEnd();
  }
}

export default formatContent;
