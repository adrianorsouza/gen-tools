import fs, { mkdir, readdir } from 'node:fs/promises';
import prettier from 'prettier';
import { existsSync } from 'node:fs';

let appendName = 'Icon';

const TEMPLATE = `
import React from 'react';
import theme from '@/styles/theme';
import { SVGIconType } from '@/types/svg-icon-types';

const {{ICON_NAME}} = ({ width = 16, color, ...props }: SVGIconType) => {
  const defaultColor = color ? theme.color[color] : 'black';
  const height = props.height || width;
  return (
    {{ICON_CONTENT}}
  );
};

export default {{ICON_NAME}};

`;
const TEMPLATE_STORY = `
import type { Meta, StoryObj } from '@storybook/react';
import {{ICON_NAME}} from './{{ICON_NAME}}';

const meta: Meta<typeof {{ICON_NAME}}> = {
  title: 'Components/Icons/{{ICON_NAME}}',
  component: {{ICON_NAME}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof {{ICON_NAME}}>;

export const Default: Story = {
  name: '{{ICON_NAME}}',
  args: {
    width: 64,
    height: 64,
  },
  render: (args) => (
    <{{ICON_NAME}} {...args} />
  ),
};

`;

async function genReactIconComponent(svgFileSourceCode, iconName) {
  try {
    const data = await fs.readFile(svgFileSourceCode, { encoding: 'utf-8' });
    const content = data
      .replace(/width="32"/g, 'width={width}')
      .replace(/height="32"/g, 'height={height}')
      .replace(/fill="#343330"/, 'fill={defaultColor}')
      .replace(/fill="#C3C3C3"/, 'fill={defaultColor}')
      .replace(/fill="black"/, 'fill={defaultColor}')
      .replace(/stroke-width/, 'strokeWidth')
      .replace(/clip-path/, 'clipPath');

    const source = TEMPLATE.replace(/{{ICON_CONTENT}}/g, content).replace(/{{ICON_NAME}}/g, iconName);
    const options = await prettier.resolveConfig('.prettierrc');

    let contentFormatted = await prettier.format(source, { parser: 'typescript', ...options });
    return {
      content: contentFormatted,
      contentStory: TEMPLATE_STORY.replace(/{{ICON_NAME}}/g, iconName),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function IconGen(options) {
  const defaultOptions = {
    source: null,
    output: null,
    appendName: 'Icon',
  }
  this.options = { ...defaultOptions, ...options };
  this.data = [];

  this.parseSvgFiles = async function parseSvgFiles() {
    let iconsGeneratedList = [];

    try {
      const files = await readdir(this.options.source);

      for (const file of files) {
        if (!file.endsWith('.svg')) {
          console.log(`==> Skipping ${file} ...`);
          continue;
        }

        let filename = file;
        let componentName = file.replace('.svg', '') + appendName;
        let outFilename = `${componentName}.tsx`;
        let outStoryFilename = `${componentName}.stories.tsx`;
        let sourceSvgPath = `${this.options.source}/${filename}`;

        const content = await genReactIconComponent(sourceSvgPath, componentName);

        iconsGeneratedList.push({
          sourceSvgPath: sourceSvgPath,
          componentFilename: outFilename,
          storyFilename: outStoryFilename,
          componentName,
          content: content.content,
          contentStory: content.contentStory,
          dist: `${this.options.output}/${componentName}/${outFilename}`,
          distStory: `${this.options.output}/${componentName}/${outStoryFilename}`,
        });
      }

      this.data = iconsGeneratedList;
      return this;

    } catch (err) {
      console.error(err);
      return [];
    }
  }

  this.writeSvgReactComponent = async function () {
    try {
      for (const file of this.data) {
        let outDir = `${this.options.output}/${file.componentName}`;
        let distFile = file.dist;
        let distStoryFile = file.distStory;

        // path component exists, otherwise created it.
        if (!existsSync(outDir)) {
          await mkdir(outDir, { recursive: true });
        }

        await fs.writeFile(distFile, file.content);
        await fs.writeFile(distStoryFile, file.contentStory);
        console.log(`Written: ${file.dist}`);
      }
    } catch (err) {
      console.log(`=========================`);
      console.log(`Error writeSvgReactComponent`);
      console.log(`=========================`);
      console.error(err);
    }
  }
}


export default IconGen;

