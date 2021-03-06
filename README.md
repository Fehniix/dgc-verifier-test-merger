# IT DGV Verifier Apps Automatic Tests CSV Merger

Merges iOS and Android DGC Verifier apps' automatic test `.csv` results, generating a single `.csv` file that also adds comparison metadata.

## Build & Run

First installation:

```bash
npm install
```

Build project:

```bash
npm build
```

Run project:

```bash
node ./dist/index.js
```

Build & run:

```bash
npm start
```

## Run instructions

- Place the `.csv` files generated by the Android app inside the `./android` folder, make sure the *not-IT* result file contains `"not"` in its name, case-insensitive,
- As above for iOS,
- Run the project

The merged `.csv` file is placed inside the `./merged` folder.

## License

MIT.
