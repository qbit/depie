const debug = require('debug')('depie')
const exec = require('child_process').exec
const fs = require('fs')
const os = require('os')
const path = require('path')

function loadData (f) {
  f = path.join(__dirname, f)
  return JSON.parse(fs.readFileSync(f))
}

function makeCmd (t, l) {
  var c = []
  if (process.geteuid() !== 0) {
    c.push(t.priv)
  }
  c.push(t.install, t.flags)
  var cmd = [c.join(' '), l.join(' ')].join(' ')

  debug('Final command: "%s"', cmd)
  return cmd
}

function translateList (platform, list) {
  var t = []
  var l = list.length
  var map = globalMap[platform]

  for (var i = 0; i < l; i++) {
    if (map && map[list[i]]) {
      if (typeof map[list[i]] === 'object') {
        for (var z = 0, zl = map[list[i]].length; z < zl; z++) {
          t.push(map[list[i]][z])
        }
      } else {
        t.push(map[list[i]])
      }
    } else {
      t.push(list[i])
    }
  }
  debug('original package list', list)
  debug('translated package list', t)
  return t
}

// Take /etc/os-release and turn it into JSON
function orToJSON () {
  var f = '/etc/os-release'
  var r = {id: 'generic'}
  if (fs.existsSync(f)) {
    var data = fs.readFileSync(f, 'utf8')
    data = data.split('\n')
    for (var i = 0, l = data.length; i < l; i++) {
      var a = data[i].split('=')
      if (a[1] && a[0]) {
        r[a[0].toLowerCase()] = a[1].toLowerCase()
      }
    }
  }
  return r
}

// For some OSs, we can just return the type (openbsd, freebsd)
// but linux requires a bit of extra love.
function setPlatform () {
  var p = os.platform()
  var release = orToJSON()
  var id = release.id

  if (p === 'linux') {
    if (id.match(/redhat/i)) {
      p = p + '-redhat'
    } else {
      if (id !== 'generic') {
        p = p + '-' + id
      }
    }
  }
  debug('Platform: %s', p)
  return p
}

var globalMap = loadData('translation.json')
var globalTools = loadData('tools.json')

var config = function (map, tools) {
  if (map) {
    globalMap = loadData(map) || globalMap
  }
  if (tools) {
    globalTools = loadData(tools) || globalTools
  }
}

exports.configure = config

exports.install = function (list, cb) {
  config()
  var p = setPlatform()
  var tset = globalTools[p]
  debug('Using toolset:', tset)
  if (cb) {
    exec(makeCmd(tset, translateList(p, list)), cb)
  } else {
    exec(makeCmd(tset, translateList(p, list)))
  }
}
