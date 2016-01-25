# Extractor
Extractor is a small, cross-plattform, personal assistant on your fingertips.

![Extractor Screenshot](http://i.imgur.com/VwvQBjf.png)

The main purpose is to extract various kinds of data from different sources with a slick and responsive UI to get things done easier.

## Extractors
For now these Extractors are available:
- **MathExtractor**: Allows you to perform simple calculations. Press enter to copy the result to the clipboard.
- **FileExtractor**: Find important files quickly, pressing enter will open the file with the default application, shift+enter opens its folder. You can specify important locations within the config.js.

## Installation
You will need to have git and npm installed to build the Extractor application.
```
git clone https://github.com/Kisaro/extractor.git
cd extractor
npm install
```
Finally, you can start the application by entering `npm start`

If you are looking to compile the application into a binary, please have a look at the great [electron-packager](https://github.com/maxogden/electron-packager) project. A simple build.sh to compile a windows executable using that packages is included in the repository.
