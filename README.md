# Extractor
Extractor is a small, cross-plattform, personal assistant on your fingertips.

![Extractor Screenshot](http://i.imgur.com/VwvQBjf.png)

The main purpose is to extract various kinds of data from different sources with a slick and responsive UI to get things done easier.

## Extractors
For now these Extractors are available:
- **MathExtractor**: Allows you to perform simple calculations. Press enter to copy the result to the clipboard.
- **FileExtractor**: Find important files quickly, pressing enter will open the file with the default application, shift+enter opens its folder. You can specify important locations within the config.js.

## Use
Extractor will try to come up with appropriate data while you type, you can select different results with up/down arrows.
Pressing Enter will perform a primary action on the result (e.g. opening a file or copying a calculation result to the clipboard), while some results might have a secondary action by pressing shift+enter (e.g. files won't open directly but open the folder they reside in).
Upon successfully performing a primary action, Extractor will hide in the background to get out of the way. You can bring it back any time by using the global shortcut found in config.js (Alt+Space by default)

Additionally, Extractor can be controlled using voice. The hotwort "hey", will bring it up and any word following will be entered. You can select a result by saying "up" and "down" and perform its primary action by saying "ok".

## Installation
You will need to have git and npm installed to build the Extractor application.
```
git clone https://github.com/Kisaro/extractor.git
cd extractor
npm install
```
Finally, you can start the application by entering `npm start`

If you are looking to compile the application into a binary, please have a look at the great [electron-packager](https://github.com/maxogden/electron-packager) project. A simple build.sh to compile a windows executable using that packager is included in the repository.
