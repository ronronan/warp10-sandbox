require('dotenv').config();
import { Warp10Wrapper } from './warp10.wrapper';

const w10 = new Warp10Wrapper();

const app = process.argv[2];
const script = process.argv[3];
if (script && app) {
  const functionScript = require(`./${app}/${script}`)
  if (functionScript) {
    functionScript(w10, process.argv[4])
  } else {
    console.log('Fail to load script file');
  }
} else {
  console.log('Unknow script');
}
