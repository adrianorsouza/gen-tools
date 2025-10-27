TOKEN GEN
=========

# Figma Token to Style Dictionary

Sync up manually the token json file by exporting it from Figma then storing it within the `tokens` folder.

### Usage

Within the project create a folder called `scripts`, then create a file `token-gen.mjs`

```bash
mkdir scripts
touch token-gen.mjs
```

Paste the following content:

```js
import StyleDictionary from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';
import formatterStyledComponentTypes from './src/formatterStyledComponentTypes.mjs';
import formatterEs6File from './src/formatterEs6File.mjs';
import customHeader from './src/defaultHeader.mjs';
import filterCustom from './src/filterCustom.mjs';

// TODO: HANDLE ARGs BASE PATH TO BUILD DIR
const BUILD_PATH = 'src/styles/';

registerTransforms(StyleDictionary);

StyleDictionary.registerFileHeader({ ...customHeader });
StyleDictionary.registerFilter(filterCustom);

/**
 * https://amzn.github.io/style-dictionary/#/formats?id=custom-format-with-output-references
 * */
StyleDictionary.registerFormat({
  name: `es6WithReferences`,
  formatter: formatterEs6File,
});

/**
 * Format Types for Typescript StyledComponents theme.
 * */
StyleDictionary.registerFormat({
  name: `styledComponentTypes`,
  formatter: formatterStyledComponentTypes,
});

const sd = StyleDictionary.extend({
  source: ['tokens/*.json'],
  platforms: {
    css: {
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/opacity',
        'ts/size/lineheight',
        'ts/type/fontWeight',
        'ts/resolveMath',
        'ts/size/css/letterspacing',
        'ts/typography/css/shorthand',
        'ts/border/css/shorthand',
        'ts/shadow/css/shorthand',
        'ts/color/css/hexrgba',
        'ts/color/modifiers',
        'name/cti/kebab',
      ],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          filter: 'filterCustom',
          options: {
            outputReferences: false,
            fileHeader: 'customHeader',
          },
        },
      ],
    },
    scss: {
      filter: ['filterTest'],
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/opacity',
        'ts/size/lineheight',
        'ts/type/fontWeight',
        'ts/resolveMath',
        'ts/size/css/letterspacing',
        'ts/typography/css/shorthand',
        'ts/border/css/shorthand',
        'ts/shadow/css/shorthand',
        'ts/color/css/hexrgba',
        'ts/color/modifiers',
        'name/cti/kebab',
      ],
      transformGroup: 'scss',
      buildPath: BUILD_PATH,
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          filter: 'filterCustom',
          options: {
            outputReferences: false,
            fileHeader: 'customHeader',
          },
        },
      ],
    },
    js: {
      // transformGroup: 'tokens-studio',
      buildPath: BUILD_PATH,
      transforms: [
        'ts/size/px',
        'ts/resolveMath',
        'ts/border/css/shorthand',
        'ts/type/fontWeight',
        'ts/shadow/css/shorthand',
        'ts/size/px',
        'name/cti/snake',
      ],
      files: [
        {
          destination: 'theme.tsx',
          format: 'es6WithReferences' /*'javascript/es6'*/,
          filter: 'filterCustom',
          options: {
            outputReferences: false,
            fileHeader: 'customHeader',
          },
        },
      ],
    },
    ts: {
      // transformGroup: 'tokens-studio',
      buildPath: 'types/',
      transforms: [
        'ts/size/px',
        'ts/resolveMath',
        'ts/border/css/shorthand',
        'ts/type/fontWeight',
        'ts/shadow/css/shorthand',
        'ts/size/px',
        'name/cti/snake',
      ],
      files: [
        {
          destination: 'theme.d.ts',
          format: 'styledComponentTypes',
          filter: 'filterCustom',
          options: {
            outputReferences: false,
            fileHeader: 'customHeader',
          },
        },
      ],
    },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();

```


Then run:

    yarn token

This command will generate the `_variables.scss` and `variables.css` files within the build dir.

https://docs.tokens.studio/transforming/style-dictionary
https://www.npmjs.com/package/@tokens-studio/sd-transforms

---

```json
{
  "source": ["**/*tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "tokens-studio",
      "prefix": "sd",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "_variables.css",
          "format": "css/variables"
        }
      ]
    },
    "js": {
      "transformGroup": "tokens-studio",
      "buildPath": "build/js/",
      "files": [
        {
          "destination": "variables.js",
          "format": "javascript/es6"
        }
      ]
    }
  }
}
```

**Adriano Rosa** (https://adrianorosa.com)

## Licence

Copyright © 2025, Adriano Rosa  <info@adrianorosa.com>
All rights reserved.

For the full copyright and license information, please view the LICENSE
file that was distributed within the source root of this project.

