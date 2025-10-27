// default header
const defaultHeader = [`Do not edit directly`, `Generated on ${new Date().toUTCString()}`];

const customHeader = {
  name: 'customHeader',
  fileHeader: (defaultMessage) => {
    // defaultMessage are the 2 lines above that appear in the default file header
    // you can use this to add a message before or after the default message 👇

    // the fileHeader function should return an array of strings
    // which will be formatted in the proper comment style for a given format
    return [
      ...defaultHeader,
      ``,
      `To update this file make sure to have`,
      `the latest Tokens exported from Figma then run:`,
      ``,
      `$ yarn token`,
    ];
  },
};

export default customHeader;
