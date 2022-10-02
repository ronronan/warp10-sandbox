import fs from 'fs';
import { parse } from 'csv-parse';
import { Warp10Wrapper } from '../warp10.wrapper';

module.exports = async (w10: Warp10Wrapper) => {
  console.log('elec insert-data');
  // const DATA_DAILY_INDEX = './data/mes-index-elec-14459913066639-35690.csv';

  // interface IDataConsumptionIndex {
  //   timestamp: number;
  //   indexHC: number;
  //   indexHP: number;
  // }




  // readContentCSV(DATA_DAILY_INDEX)
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => console.error(err));

}

  // function readContentCSV(fileName: string): Promise<IDataConsumptionIndex[]> {
  //   return new Promise((resolve, reject) => {
  //     const data: IDataConsumptionIndex[] = [];
  //     fs.createReadStream(fileName)
  //       .pipe(parse({ delimiter: ';', from_line: 2 }))
  //       .on('data', (row: string[]) => {
  //         const tmpDataSplit = row[0].split('/');
  //         if (tmpDataSplit.length === 3) {
  //           const tmpDate = new Date(Number(tmpDataSplit[2]), (Number(tmpDataSplit[1])-1), Number(tmpDataSplit[0]));
  //           data.push({
  //             timestamp: tmpDate.getTime() * 1000,
  //             indexHC: Number(row[2]),
  //             indexHP: Number(row[3])
  //           });
  //         }
  //       })
  //       .on('end', () => resolve(data))
  //       .on('error', reject);
  //   });
  // }