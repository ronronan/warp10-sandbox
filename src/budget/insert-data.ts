import fs from 'fs';
import { parse } from 'csv-parse';
import { Warp10Wrapper } from '../warp10.wrapper';
import { DataPoint } from '@senx/warp10';

const LIVRET_CLASSNAME = 'fr.ronanmorel.livret';
interface IDataBudget {
  timestamp: number;
  label: string;
  sum: Number;
}

function readContentLivretCSV(fileName: string): Promise<IDataBudget[]> {
  let cpt = 0;
  const labelTab: string[] = [];
  return new Promise((resolve, reject) => {
    const data: IDataBudget[] = [];
    fs.createReadStream(fileName)
      .pipe(parse({ delimiter: ';', from_line: 1 }))
      .on('data', (row: string[]) => {
        if (cpt === 0) {
          labelTab.push(...row);
          labelTab.splice(0, 1);
        } else {
          const tmpDataSplit = row[0].split('/');
          if (tmpDataSplit.length === 3) {
            const tmpDate = new Date(Number(tmpDataSplit[2]), (Number(tmpDataSplit[1])-1), Number(tmpDataSplit[0]));
            if (row.length -1 === labelTab.length) {
              for (let i = 1; i < row.length; i++) {
                data.push({
                  timestamp: tmpDate.getTime() * 1000,
                  label: labelTab[i-1],
                  sum: Number(row[i])
                });
              }
            }
          }
        }
        cpt++;
      })
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

function writeLivretToW10(w10: Warp10Wrapper, dataList: IDataBudget[]): Promise<void> {
  return new Promise(async (resolve) => {
    const w10DataList = dataList.map(d => ({
      timestamp: d.timestamp,
      className: LIVRET_CLASSNAME,
      value: d.sum,
      labels: { name: d.label }
    } as DataPoint));
    await w10.update(w10DataList);

    const listLabel = [...new Set(dataList.map(d => d.label))].map(d => ({
      className: LIVRET_CLASSNAME,
      labels: { name: d },
      attributes: { unit: '€' }
    }));
    await w10.meta(listLabel)
    resolve();
  });
}

module.exports = async (w10: Warp10Wrapper) => {
  console.log('Budget insert-data.ts');
  const livretFiles = ['2020-livret.csv', '2021-livret.csv', '2022-livret.csv']

  const allData = [];
  for (const livretFile of livretFiles) {
    const result = await readContentLivretCSV(`./data/budget/${livretFile}`);
    allData.push(...result);
  }
  await writeLivretToW10(w10, allData);
}
