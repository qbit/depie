var tape = require('tape')
var os = require('os')
var depie = require('../')

tape('install single package (libsodium)', function (t) {
  depie.install(['libsodium'], function (err, stdout, stderr) {
    t.error(err, stderr)
    t.end()
  })
})

tape('install multiple packages', function (t) {
  depie.install(['libsodium', 'bzip2', 'git'], function (err, stdout, stderr) {
    t.error(err, stderr)
    t.end()
  })
})

if (os.platform() === 'openbsd') {
  tape(' install fake dependency on openbsd', function (t) {
    depie.install(['snakesonaplane'], function (err, stdout, stderr) {
      t.error(err, stderr)
      t.end()
    })
  })
} else {
  tape('install fake dependency', function (t) {
    depie.install(['snakesonaplane'], function (err, stdout, stderr) {
      if (err !== null) {
        t.ok('Failed to install fake package')
      }
      t.end()
    })
  })
}
