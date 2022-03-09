import fs from 'fs';
import path from 'path';
import { CSVAndroidRow, CSViOSRow, getRows, mergeCSVs } from './Logic';

const basePath: string 			= path.join(__dirname, '../');
const iOSPath: string 			= path.join(basePath, 'iOS');
const androidPath: string 		= path.join(basePath, 'android');

if (fs.readdirSync(iOSPath).length == 0 || fs.readdirSync(androidPath).length == 0) {
	console.error('Both Android and iOS result CSV files must exist and be in their respective folders.');
	process.exit();
}

const iOSCSVPath: string 						= path.join(iOSPath, fs.readdirSync(iOSPath).filter(filename => !filename.match(/not|DS/i))[0]);
const iOSCSVNotITPath: string 					= path.join(iOSPath, fs.readdirSync(iOSPath).filter(filename => filename.match(/not/i))[0]);
const androidCSVPath: string 					= path.join(androidPath, fs.readdirSync(androidPath).filter(filename => !filename.match(/not|DS/i))[0]);
const androidCSVNotITPath: string 				= path.join(androidPath, fs.readdirSync(androidPath).filter(filename => filename.match(/not/i))[0]);

const iOSCSV: string 							= fs.readFileSync(iOSCSVPath, { encoding: 'utf8' });
const iOSCSVNotIT: string 						= fs.readFileSync(iOSCSVNotITPath, { encoding: 'utf8' });
const androidCSV: string 						= fs.readFileSync(androidCSVPath, { encoding: 'utf8' });
const androidCSVNotIT: string 					= fs.readFileSync(androidCSVNotITPath, { encoding: 'utf8' });

const iOSRows: Array<CSViOSRow> 				= getRows(iOSCSV) as Array<CSViOSRow>; 
const iOSRowsNotIT: Array<CSViOSRow> 			= getRows(iOSCSVNotIT) as Array<CSViOSRow>; 
const androidRows: Array<CSVAndroidRow> 		= getRows(androidCSV, '\r', ',') as Array<CSVAndroidRow>;
const androidRowsNotIT: Array<CSVAndroidRow> 	= getRows(androidCSVNotIT, '\r', ',') as Array<CSVAndroidRow>;

const mergedIT: string 							= mergeCSVs(iOSRows, androidRows);
const mergedNotIT: string 						= mergeCSVs(iOSRowsNotIT, androidRowsNotIT);

fs.writeFileSync(path.join(basePath, 'merged', 'mergedIT.csv'), mergedIT);
fs.writeFileSync(path.join(basePath, 'merged', 'mergedNotIT.csv'), mergedNotIT);