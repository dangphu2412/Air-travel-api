import {createReadStream} from "fs";
import csv from "csv-parser";

export class CsvHelper {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Return array json read from csv
   */
  public async readCsv(): Promise<Array<any>> {
    return new Promise((resolve, reject)=>{
      const results = [];
      createReadStream(this.filePath)
        .pipe(csv({
          mapHeaders: ({header}) => header.replace(/"/g, "")
        }))
        .on("data", data => results .push(data))
        .on("end", () => {
          resolve(results);
        })
        .on("error", reject);
    });
  }
}
