# depie

[![Build Status](https://travis-ci.org/qbit/depie.svg?branch=master)](https://travis-ci.org/qbit/depie)

A tool that attempts install 3rd party dependencies so you don't have
to!

There is a lot of duplicated work/code going into native node modules. This
work could be entirely mitigated if node modules used OS packaging
systems which have, for the most part, already built these dependencies.

## Example usage

The primary entrypoint for `depie` is intended to be the
`package.json` file. This lets you install dependencies prior to
needing them. For example:

```
{
  "name": "example",
  "version": "1.0.0",
  "description": "a test module for depie",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "install": "echo 'var d = require(\"depie\"); d.install([\"libsodium\"])' | node"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "depie": "0.0.1"
  }
}
```

The above would install depie then libsodium on the target
machine using its native package manager.

Now you can build your native module without needing to repackage and
rebuild all the source code for libsodium!