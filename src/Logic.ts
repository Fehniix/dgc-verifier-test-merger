export type CSVAndroidRow = {
	[key: string]: string
	id: string,
	base: string,
	rafforzata: string,
	visitatoriRSA: string,
	studenti: string,
	lavoro: string,
	ingressoIT: string
};

export type CSViOSRow = CSVAndroidRow & {
	exBase: string,
	exRafforzata: string,
	exVisitatoriRSA: string,
	exStudenti: string,
	exLavoro: string,
	exIngressoIT: string
}

export type CSVRow = CSVAndroidRow | CSViOSRow;

export function getRows(csv: string, rowSeparator: string = '\n', columnSeparator: string = ';'): Array<CSVRow> {
	const rows: string[] = csv.split(rowSeparator);
	rows.pop();

	// Slice to skip header row
	return rows.slice(1).map(_row => {
		const columns: string[] = _row.split(columnSeparator);

		if (columns.length === 7)
			return {
				id: columns[0].replace('\n', ''),
				base: columns[1],
				rafforzata: columns[2],
				visitatoriRSA: columns[3],
				studenti: columns[4],
				lavoro: columns[5],
				ingressoIT: columns[6]
			} as CSVAndroidRow;
		else
			return {
				id: columns[0],
				base: columns[1],
				exBase: columns[2],
				rafforzata: columns[3],
				exRafforzata: columns[4],
				visitatoriRSA: columns[5],
				exVisitatoriRSA: columns[6],
				studenti: columns[7],
				exStudenti: columns[8],
				lavoro: columns[9],
				exLavoro: columns[10],
				ingressoIT: columns[11],
				exIngressoIT: columns[12],
			} as CSViOSRow;
	});
}

export function mergeCSVs(iOS: Array<CSViOSRow>, android: Array<CSVAndroidRow>): string {
	if (!mergeable(iOS, android) && false) {
		console.error('iOS and Android files could not be merged. They have differing lines.');
		process.exit();
	}

	let mergedCSVs: string = 'ID;[iOS] Base;[Android] Base;[iOS] Rafforzata;[Android] Rafforzata;[iOS] Visitatori RSA;[Android] Visitatori RSA;[iOS] Ingresso in Italia;[Android] Ingresso in Italia;SOGEI - iOS;SOGEI - Android;iOS - Android;\n';

	const iOSModes: Array<string> 			= Object.keys(iOS[0]).filter(m => m !== 'id');
	const androidModes: Array<string> 		= Object.keys(android[0]).filter(m => m !== 'id');
	
	for (let i = 0; i < iOS.length; i++) {
		let iOSSogei: boolean = true;
		let androidSogei: boolean = true;
		let iOSAndroid: boolean = true;

		let strRow = `${iOS[i].id};`;
		
		androidModes.forEach((mode, index) => {
			if (mode === 'lavoro' || mode === 'studenti')
				return;
				
			const iOSResult: string = iOS[i][mode];
			const androidResult: string = mapAndroidResult(android[i][mode]);

			const expectedResultKey: string = `ex${mode[0].toUpperCase() + mode.slice(1)}`;
			const expectedResult: string = iOS[i][expectedResultKey];

			if (iOSResult !== androidResult)
				iOSAndroid = false;
			
			if (iOSResult !== expectedResult && expectedResult !== '-')
				iOSSogei = false;

			if (androidResult !== expectedResult && expectedResult !== '-')
				androidSogei = false;

			strRow += `${iOSResult};${androidResult};`
		});

		const toReadableBoolean = (b: boolean) => b ? 'OK' : 'KO'; 

		strRow += `${toReadableBoolean(iOSSogei)};${toReadableBoolean(androidSogei)};${toReadableBoolean(iOSAndroid)}\n`;

		mergedCSVs += strRow;
	}

	return mergedCSVs;
}

export function mapAndroidResult(result: string): string {
	if (result === 'notEuDCC')
		return 'notGreenPass';
	return result;
}

export function mergeable(iOS: Array<CSViOSRow>, android: Array<CSVAndroidRow>): boolean {
	if (iOS.length !== android.length)
		return false;

	for (let i = 0; i < iOS.length; i++)
		if (iOS[i].id !== android[i].id)
			return false;

	return true;
}