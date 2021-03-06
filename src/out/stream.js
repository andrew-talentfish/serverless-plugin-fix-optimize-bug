"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

var stream_1 = require("stream");

var fsStat = require("@nodelib/fs.stat");

var fsWalk = require("@nodelib/fs.walk");

var reader_1 = require("./reader");

var ReaderStream = /*#__PURE__*/ (function (_reader_1$default) {
  _inherits(ReaderStream, _reader_1$default);

  var _super = _createSuper(ReaderStream);

  function ReaderStream() {
    var _this;

    _classCallCheck(this, ReaderStream);

    _this = _super.apply(this, arguments);
    _this._walkStream = fsWalk.walkStream;
    _this._stat = fsStat.stat;
    return _this;
  }

  _createClass(ReaderStream, [
    {
      key: "dynamic",
      value: function dynamic(root, options) {
        return this._walkStream(root, options);
      }
    },
    {
      key: "static",
      value: function _static(patterns, options) {
        var _this2 = this;

        var filepaths = patterns.map(this._getFullEntryPath, this);
        var stream = new stream_1.PassThrough({
          objectMode: true
        });

        stream._write = function (index, _enc, done) {
          return _this2
            ._getEntry(filepaths[index], patterns[index], options)
            .then(function (entry) {
              if (entry !== null && options.entryFilter(entry)) {
                stream.push(entry);
              }

              if (index === filepaths.length - 1) {
                stream.end();
              }

              done();
            })
            ["catch"](done);
        };

        for (var i = 0; i < filepaths.length; i++) {
          stream.write(i);
        }

        return stream;
      }
    },
    {
      key: "_getEntry",
      value: function _getEntry(filepath, pattern, options) {
        var _this3 = this;

        return this._getStat(filepath)
          .then(function (stats) {
            return _this3._makeEntry(stats, pattern);
          })
          ["catch"](function (error) {
            if (options.errorFilter(error)) {
              return null;
            }

            throw error;
          });
      }
    },
    {
      key: "_getStat",
      value: function _getStat(filepath) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          _this4._stat(
            filepath,
            _this4._fsStatSettings,
            function (error, stats) {
              return error === null ? resolve(stats) : reject(error);
            }
          );
        });
      }
    }
  ]);

  return ReaderStream;
})(reader_1["default"]);

exports["default"] = ReaderStream;
