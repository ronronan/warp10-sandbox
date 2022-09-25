// module.exports = async (kuzzle, warp10Connector) => {
//   console.log('-------------- Warp10 POC --------------');
//   const sdkKuzzle = kuzzle.kuzzle;
//   const w10 = warp10Connector.warp;

//   const measuresMp = await fetchAllMeasureOfMeasuringPointFunctionAttribute(sdkKuzzle, 'eesdrouest', 'Vyx2N30BEqgkX_qdnOhI', 'meter1', 'totalActiveEnergy');
//   console.log(`Nombre de points chargé : ${measuresMp.length}`);
//   await insertMeasureInWarp10(
//     w10, warp10Connector.writeToken, measuresMp, 'eesdrouest', 'Vyx2N30BEqgkX_qdnOhI', 'meter1', 'totalActiveEnergy', 'vln6jIIBKPwJKH1KPHW7', 'v1n6jIIBKPwJKH1KPnUq',
//     -1.62157449440485, 48.1056866350034, 'kWh', 'Float'
//   );

//   // await insertPointWarp10(w10, warp10Connector.writeToken);
//   // await fetchPointWarp10(w10, warp10Connector.readToken);
//   // await fetchPointWarp10Script(w10, warp10Connector.readToken);
// }

// async function insertPointWarp10(w10, writeToken) {
//   const arrayData = [];
//   const now = new Date();
//   for (let i = 0; i < 10; i++) {
//     arrayData.push({
//       timestamp: (now.getTime() + i) * 1000,
//       className: 'fr.testrm.onedata',
//       labels: {
//         type: i % 2 ? 'impair' : 'pair'
//       },
//       value: i
//     });
//   }

//   await w10.update(writeToken, arrayData);
// }

// async function fetchPointWarp10(w10, readToken) {
//   const res = await w10.fetch(readToken, 'fr.testrm.onedata', {}, '2022-09-19T00:00:00.000Z', '2022-09-20T00:00:00.000Z', 'json');
//   const parsedResult = JSON.parse(res.result[0]);
//   console.log(parsedResult[0].v.map(v => v[1]));
// }

// async function fetchPointWarp10Script(w10, readToken) {
//   const res = await w10.exec(`
//     '${readToken}' 'token' STORE
//     [ $token 'fr.testrm.onedata' { } NOW 3 h ] FETCH
//   `);
//   console.log(res.result[0].map(m => m.v));
// }

// async function fetchAllMeasureOfMeasuringPointFunctionAttribute(sdk, tenantId, mpId, functionId, attributeId) {
//   const filter = {
//     "query": {
//       "bool": {
//         "filter": [
//           {
//             "term": {
//               "measuringPointId": mpId
//             }
//           },
//           {
//             "term": {
//               "functionId": functionId
//             }
//           },
//           {
//             "term": {
//               "attributeName": attributeId
//             }
//           }
//         ]
//       }
//     }
//   };
//   let cursor = await sdk.document.search(`root-${tenantId}`, 'measure', filter, { scroll: '10s', size: process.env.KUZZLE_QUERY_MAX_SIZE });
//   const documents = []; 
//   while (cursor) {
//     documents.push(...cursor.hits);
//     const progress = Math.round(Math.floor((cursor.fetched / cursor.total) * 10000) / 100);
//     console.log(`Loading measure [root-${tenantId}.measure] ${mpId} ${functionId} ${attributeId} -- ${progress} % ...`);
//     cursor = await cursor.next();
//   }
//   return documents;
// }

// async function insertMeasureInWarp10(w10, writeToken, measureList, tenantId, mpId, functionId, attributeId, siteId, locationId, lat, lon, unit, typeData) {
//   const arrayData = [];
  
//   let cpt = 0;
//   let dataArray = [];
//   for(const measure of measureList) {
//     const contentMeasure = measure._source;
//     if (cpt >= 100) {
//       console.log('updating measure to warp10 ...');
//       await w10.update(writeToken, arrayData);
//       cpt = 0;
//       dataArray = [];
//     }
//     arrayData.push({
//       timestamp: new Date(contentMeasure.timestamp).getTime() * 1000,
//       className: `fr.eiffage.electrical.meter.${attributeId}`,
//       labels: {
//         tenantId: tenantId,
//         measuringPointId: mpId,
//         functionId: functionId,
//         siteId: siteId,
//         locationId: locationId
//       },
//       lat: lat,
//       lon: lon,
//       value: contentMeasure.data.numericValue
//     });
//     cpt++;
//   }

//   // await w10.meta(writeToken, [{
//   //   class: `fr.eiffage.electrical.meter.${attributeId}`,
//   //   labels: {
//   //     tenantId: tenantId,
//   //     measuringPointId: mpId,
//   //     functionId: functionId,
//   //     siteId: siteId,
//   //     locationId: locationId
//   //   },
//   //   attributes: {
//   //     unit: unit,
//   //     typeData: typeData
//   //   }
//   // }]);
// }