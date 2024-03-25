const fs = require('fs');
const path = require('path');

const inputFolder = './translations/pl';
const outputFolder = './final';

function restoreOriginalStructure(fileName) {
  fs.existsSync(outputFolder) ? null : fs.mkdirSync(outputFolder, { recursive: true })
  const modifiedFilePath = path.join(inputFolder, fileName);
  const restoredFilePath = path.join(outputFolder, fileName.replace('.json', '.json'));

  fs.readFile(modifiedFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Błąd odczytu pliku: ${fileName}`, err);
      return;
    }

    const jsonData = JSON.parse(data);

    jsonData.cpEventMessageData.Array.forEach(item => {
      if (item.Message && item.Message.Array) {
        const [first, second = "", third = ""] = item.Message.Array[0].split('\n');
        item.Message.Array = [first, second, third];
      }
    });

    const dataToWrite = JSON.stringify(jsonData, null, 2).replace(/\n/g, '\r\n');

    fs.writeFile(restoredFilePath, dataToWrite, 'utf8', (err) => {
      if (err) {
        console.error(`Błąd odczytu pliku: ${fileName}`, err);
      } else {
        console.log(`Plik ${fileName} gotowy do użycia.`);
      }
    });
  });
}

function processFilesInFolder() {
  fs.readdir(inputFolder, (err, files) => {
    if (err) {
      console.error('Nieprawidłowy folder wejściowy:', err);
      return;
    }

    files.filter(file => path.extname(file).toLowerCase() === '.json')
         .forEach(file => restoreOriginalStructure(file));
  });
}

processFilesInFolder();
