# Grid file storage
Simple GridFS filestorage with simple API

## Install
```sh
npm i --save grid-filestorage
```

## Usage

```js
const fs = require('fs');
const path = require('path');
const FileStorage = require('grid-filestorage');

const filestorage = new FileStorage(db, { title: 'Test' });
// db — is the native db connection to mongodb
// options.title — title of storage, optional. Title prepend with "-" before filename

const filestream = fs.createReadStream(path.join(__dirname, './test.png'));
const filename = 'testfile';
const meta = {
  "content_type": 'image/png'
}

filestorage.write(filestream, filename, meta).
then(filename => console.info(`file ${filename} in storage`));
// file Test-testfile in storage
```

### With mongoose
```js
// ...
const mongoose = require('mongoose');
const FileStorage = require('grid-filestorage');

const filestorage = new FileStorage(mongoose.connection.db);
// ...
```

## Methods

### Write a file — filestorage.write(stream, filename = new ObjectID(), meta = {})
This mehod streams `stream` into GridFS with `filename` and meta

1. `stream` — Readable stream
2. `filename` — name of file, optional. If filename does not exist, filestorage will auto-generate it
3. `meta` — meta information about file for GridFS, optional

```js
{
  content_type: 'image/png',
  metadata:{
    author: 'Daniel'
  },
  chunk_size: 1024 * 4
}
```

* returns Promise
* resolve saved filename

### Read a file — filestorage.read(filename, isExists = true)
This method read file from GridFS by filename

1. `filename` — name of file to read. If filestorage has title, filename must exclude `title + '-'` part
2. `isExists` — if this flag is true, method will check file before read

* returns Promise
* resolve Readable Stream or null, if file does not exist

### Remove a file — filestorage.remove(filename, isExists = true)
This method remove file from GridFS by filename

1. `filename` — name of file to remove. If filestorage has title, filename must exclude `title + '-'` part
2. `isExists` — if this flag is true, method will check file before remove

* returns Promise
* reject `FileStorageError` — `File does not exist`, if file does not exist into GridFS
