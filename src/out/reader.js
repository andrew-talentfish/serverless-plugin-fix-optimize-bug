"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

var path = require("path");

var fsStat = require("@nodelib/fs.stat");

var utils = require("../utils");

var Reader = /*#__PURE__*/ (function () {
  function Reader(_settings) {
    _classCallCheck(this, Reader);

    this._settings = _settings;
    this._fsStatSettings = new fsStat.Settings({
      followSymbolicLink: this._settings.followSymbolicLinks,
      fs: this._settings.fs,
      throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
    });
  }

  _createClass(Reader, [
    {
      key: "_getFullEntryPath",
      value: function _getFullEntryPath(filepath) {
        return path.resolve(this._settings.cwd, filepath);
      }
    },
    {
      key: "_makeEntry",
      value: function _makeEntry(stats, pattern) {
        var entry = {
          name: pattern,
          path: pattern,
          dirent: utils.fs.createDirentFromStats(pattern, stats)
        };

        if (this._settings.stats) {
          entry.stats = stats;
        }

        return entry;
      }
    },
    {
      key: "_isFatalError",
      value: function _isFatalError(error) {
        return (
          !utils.errno.isEnoentCodeError(error) &&
          !this._settings.suppressErrors
        );
      }
    }
  ]);

  return Reader;
})();

exports["default"] = Reader;
