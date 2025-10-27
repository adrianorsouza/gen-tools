REACT SVGS COMPONENT ICON GENERATION
====================================

### Setup within a project package.json

Using yarn


```bash
yarn add @adrianorsouza/gen-tools@github:https://github.com/adrianorsouza/gen-tools.git
github:git@github.com:adrianorsouza/gen-tools.git
```

#### Locally 

Clone this project locally

```bash
git clone git@github.com:adrianorsouza/gen-tools.git
cd project
yarn add @adrianorsouza/gen-tools@file:../gen-tools/
```

### Usage

Within the project create a folder called `bin`, then create a file `index.mjs`

```bash
mkdir bin
touch index.mjs
```

Paste the following content:

```js
import IconGen from '@adrianorsouza/gen-tools/icon-gen/index.mjs';
import path from 'path';

const SOURCE_SVG_DIR = path.resolve('../svgs');
const OUTPUT_REACT_DIR = path.resolve('../src/components/icons');

const iconGen = new IconGen({
  source: SOURCE_SVG_DIR,
  output: OUTPUT_REACT_DIR,
});

await iconGen.parseSvgFiles();

await iconGen.writeSvgReactComponent();

```


# TODO: 

- Add a test folder with a few SVG files to test it out.

**Adriano Rosa** (https://adrianorosa.com)

## Licence

Copyright © 2025, Adriano Rosa  <info@adrianorosa.com>
All rights reserved.

For the full copyright and license information, please view the LICENSE
file that was distributed within the source root of this project.

