import fs = require("fs");

export async function readFileAsync(fileName: string): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
