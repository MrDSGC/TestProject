webpackHotUpdate(0,{

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _redboxReact2 = __webpack_require__(8);\n\nvar _redboxReact3 = _interopRequireDefault(_redboxReact2);\n\nvar _reactTransformCatchErrors3 = __webpack_require__(6);\n\nvar _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);\n\nvar _react2 = __webpack_require__(1);\n\nvar _react3 = _interopRequireDefault(_react2);\n\nvar _reactTransformHmr3 = __webpack_require__(7);\n\nvar _reactTransformHmr4 = _interopRequireDefault(_reactTransformHmr3);\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _reactRouter = __webpack_require__(5);\n\nvar _Dialog = __webpack_require__(46);\n\nvar _Dialog2 = _interopRequireDefault(_Dialog);\n\nvar _FlatButton = __webpack_require__(37);\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _RaisedButton = __webpack_require__(27);\n\nvar _RaisedButton2 = _interopRequireDefault(_RaisedButton);\n\nvar _MuiThemeProvider = __webpack_require__(16);\n\nvar _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);\n\nvar _LightBoxDialog = __webpack_require__(214);\n\nvar _LightBoxDialog2 = _interopRequireDefault(_LightBoxDialog);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar _components = {\n  PhotoRowWithModalPicture: {\n    displayName: 'PhotoRowWithModalPicture'\n  }\n};\n\nvar _reactTransformHmr2 = (0, _reactTransformHmr4.default)({\n  filename: '/Users/DSGC/Desktop/GitRepos/hackhivecoding-master/app/components/Projects/PhotoRowWithModalPicture.js',\n  components: _components,\n  locals: [module],\n  imports: [_react3.default]\n});\n\nvar _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({\n  filename: '/Users/DSGC/Desktop/GitRepos/hackhivecoding-master/app/components/Projects/PhotoRowWithModalPicture.js',\n  components: _components,\n  locals: [],\n  imports: [_react3.default, _redboxReact3.default]\n});\n\nfunction _wrapComponent(id) {\n  return function (Component) {\n    return _reactTransformHmr2(_reactTransformCatchErrors2(Component, id), id);\n  };\n}\n\n//*********** Render a thumbnail row and modal for images **************/\n\nvar PhotoRowWithModalPicture = _wrapComponent('PhotoRowWithModalPicture')(function (_React$Component) {\n  _inherits(PhotoRowWithModalPicture, _React$Component);\n\n  function PhotoRowWithModalPicture(props) {\n    _classCallCheck(this, PhotoRowWithModalPicture);\n\n    var _this = _possibleConstructorReturn(this, (PhotoRowWithModalPicture.__proto__ || Object.getPrototypeOf(PhotoRowWithModalPicture)).call(this, props));\n\n    _this.handleOpen = _this.handleOpen.bind(_this);\n    _this.handleClose = _this.handleClose.bind(_this);\n    _this.handlePrevious = _this.handlePrevious.bind(_this);\n    _this.handleNext = _this.handleNext.bind(_this);\n\n    /* Data Format for media\n    media: [{\n      mediaURL: String,\n      mediaDescription: String\n    */\n\n    _this.state = {\n      mediaArray: _this.props.mediaArray,\n      pictureViewDialogStatus: false,\n      mediaToRender: {},\n      currentIndex: 0\n    };\n    return _this;\n  }\n\n  _createClass(PhotoRowWithModalPicture, [{\n    key: 'handleClose',\n    value: function handleClose() {\n      this.setState({ pictureViewDialogStatus: false });\n    }\n  }, {\n    key: 'handleOpen',\n    value: function handleOpen(index) {\n      this.setState({\n        pictureViewDialogStatus: true,\n        mediaToRender: this.state.mediaArray[index],\n        currentIndex: index\n      });\n    }\n  }, {\n    key: 'handlePrevious',\n    value: function handlePrevious() {\n      if (this.state.currentIndex - 1 < 0) {\n        debugger;\n        this.setState({\n          mediaToRender: this.state.mediaArray[-1],\n          currentIndex: this.state.mediaArray.length - 1\n        });\n      } else {\n        this.setState({\n          mediaToRender: this.state.mediaArray[this.state.currentIndex - 1],\n          currentIndex: this.state.currentIndex - 1\n        });\n      }\n    }\n  }, {\n    key: 'handleNext',\n    value: function handleNext() {\n      if (this.state.currentIndex + 1 > 0) {\n        this.setState({\n          mediaToRender: this.state.mediaArray[0],\n          currentIndex: 0\n        });\n      } else {\n        this.setState({\n          mediaToRender: this.state.mediaArray[this.state.currentIndex + 1],\n          currentIndex: this.state.currentIndex + 1\n        });\n      }\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this2 = this;\n\n      var mediaRow = this.state.mediaArray.map(function (mediaItem, index) {\n        return _react3.default.createElement(\n          'div',\n          { className: 'section-media-item' },\n          _react3.default.createElement('img', { className: 'section-media-image-container', src: mediaItem.mediaURL, onClick: function onClick() {\n              return _this2.handleOpen(index);\n            } }),\n          _react3.default.createElement(\n            'div',\n            { className: 'section-media-item-caption' },\n            mediaItem.mediaDescription\n          )\n        );\n      });\n\n      return _react3.default.createElement(\n        _MuiThemeProvider2.default,\n        null,\n        _react3.default.createElement(\n          'div',\n          null,\n          _react3.default.createElement(_LightBoxDialog2.default, {\n            pictureViewDialogStatus: this.state.pictureViewDialogStatus,\n            handleClose: this.handleClose,\n            mediaToRender: this.state.mediaToRender,\n            index: this.state.index,\n            handleNext: this.handleNext,\n            handlePrevious: this.handlePrevious\n          }),\n          _react3.default.createElement(\n            'div',\n            { className: 'section-media' },\n            mediaRow\n          )\n        )\n      );\n    }\n  }]);\n\n  return PhotoRowWithModalPicture;\n}(_react3.default.Component));\n\nexports.default = PhotoRowWithModalPicture;\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTIyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2FwcC9jb21wb25lbnRzL1Byb2plY3RzL1Bob3RvUm93V2l0aE1vZGFsUGljdHVyZS5qcz81MTc2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnbWF0ZXJpYWwtdWkvRGlhbG9nJztcbmltcG9ydCBGbGF0QnV0dG9uIGZyb20gJ21hdGVyaWFsLXVpL0ZsYXRCdXR0b24nO1xuaW1wb3J0IFJhaXNlZEJ1dHRvbiBmcm9tICdtYXRlcmlhbC11aS9SYWlzZWRCdXR0b24nO1xuaW1wb3J0IE11aVRoZW1lUHJvdmlkZXIgZnJvbSAnbWF0ZXJpYWwtdWkvc3R5bGVzL011aVRoZW1lUHJvdmlkZXInO1xuaW1wb3J0IExpZ2h0Qm94RGlhbG9nIGZyb20gJy4uL0NvbW1vbkNvbXBvbmVudHMvTGlnaHRCb3hEaWFsb2cnXG4vLyoqKioqKioqKioqIFJlbmRlciBhIHRodW1ibmFpbCByb3cgYW5kIG1vZGFsIGZvciBpbWFnZXMgKioqKioqKioqKioqKiovXG5cbmNsYXNzIFBob3RvUm93V2l0aE1vZGFsUGljdHVyZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLmhhbmRsZU9wZW4gPSB0aGlzLmhhbmRsZU9wZW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsb3NlID0gdGhpcy5oYW5kbGVDbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlUHJldmlvdXMgPSB0aGlzLmhhbmRsZVByZXZpb3VzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVOZXh0ID0gdGhpcy5oYW5kbGVOZXh0LmJpbmQodGhpcyk7XG5cbiAgICAvKiBEYXRhIEZvcm1hdCBmb3IgbWVkaWFcbiAgICBtZWRpYTogW3tcbiAgICAgIG1lZGlhVVJMOiBTdHJpbmcsXG4gICAgICBtZWRpYURlc2NyaXB0aW9uOiBTdHJpbmdcbiAgICAqL1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lZGlhQXJyYXk6IHRoaXMucHJvcHMubWVkaWFBcnJheSxcbiAgICAgIHBpY3R1cmVWaWV3RGlhbG9nU3RhdHVzOiBmYWxzZSxcbiAgICAgIG1lZGlhVG9SZW5kZXI6IHt9LFxuICAgICAgY3VycmVudEluZGV4OiAwXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xvc2UgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3BpY3R1cmVWaWV3RGlhbG9nU3RhdHVzOiBmYWxzZX0pO1xuICB9O1xuXG4gIGhhbmRsZU9wZW4gKGluZGV4KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwaWN0dXJlVmlld0RpYWxvZ1N0YXR1czogdHJ1ZSxcbiAgICAgIG1lZGlhVG9SZW5kZXI6IHRoaXMuc3RhdGUubWVkaWFBcnJheVtpbmRleF0sXG4gICAgICBjdXJyZW50SW5kZXg6IGluZGV4XG4gICAgfSk7XG4gIH07XG5cbiAgaGFuZGxlUHJldmlvdXMgKCkge1xuICAgIGlmKHRoaXMuc3RhdGUuY3VycmVudEluZGV4IC0gMSA8IDApe1xuICAgICAgZGVidWdnZXJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtZWRpYVRvUmVuZGVyOiB0aGlzLnN0YXRlLm1lZGlhQXJyYXlbLTFdLFxuICAgICAgICBjdXJyZW50SW5kZXg6IHRoaXMuc3RhdGUubWVkaWFBcnJheS5sZW5ndGggLSAxXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbWVkaWFUb1JlbmRlcjogdGhpcy5zdGF0ZS5tZWRpYUFycmF5W3RoaXMuc3RhdGUuY3VycmVudEluZGV4IC0gMV0sXG4gICAgICAgIGN1cnJlbnRJbmRleDogdGhpcy5zdGF0ZS5jdXJyZW50SW5kZXggLSAxXG4gICAgICB9KVxuICAgIH1cbiAgfTtcblxuICBoYW5kbGVOZXh0ICgpIHtcbiAgICBpZih0aGlzLnN0YXRlLmN1cnJlbnRJbmRleCArIDEgPiAwKXtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtZWRpYVRvUmVuZGVyOiB0aGlzLnN0YXRlLm1lZGlhQXJyYXlbMF0sXG4gICAgICAgIGN1cnJlbnRJbmRleDogMFxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1lZGlhVG9SZW5kZXI6IHRoaXMuc3RhdGUubWVkaWFBcnJheVt0aGlzLnN0YXRlLmN1cnJlbnRJbmRleCArIDFdLFxuICAgICAgICBjdXJyZW50SW5kZXg6IHRoaXMuc3RhdGUuY3VycmVudEluZGV4ICsgMVxuICAgICAgfSlcbiAgICB9XG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICB2YXIgbWVkaWFSb3cgPSB0aGlzLnN0YXRlLm1lZGlhQXJyYXkubWFwKCAobWVkaWFJdGVtLCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLW1lZGlhLWl0ZW1cIj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cInNlY3Rpb24tbWVkaWEtaW1hZ2UtY29udGFpbmVyXCIgc3JjPXttZWRpYUl0ZW0ubWVkaWFVUkx9IG9uQ2xpY2s9eyAoKT0+dGhpcy5oYW5kbGVPcGVuKGluZGV4KSB9IC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLW1lZGlhLWl0ZW0tY2FwdGlvblwiPlxuICAgICAgICAgICAge21lZGlhSXRlbS5tZWRpYURlc2NyaXB0aW9ufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8TXVpVGhlbWVQcm92aWRlcj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TGlnaHRCb3hEaWFsb2dcbiAgICAgICAgICAgIHBpY3R1cmVWaWV3RGlhbG9nU3RhdHVzID0ge3RoaXMuc3RhdGUucGljdHVyZVZpZXdEaWFsb2dTdGF0dXN9XG4gICAgICAgICAgICBoYW5kbGVDbG9zZSA9IHt0aGlzLmhhbmRsZUNsb3NlfVxuICAgICAgICAgICAgbWVkaWFUb1JlbmRlciA9IHt0aGlzLnN0YXRlLm1lZGlhVG9SZW5kZXJ9XG4gICAgICAgICAgICBpbmRleCA9IHt0aGlzLnN0YXRlLmluZGV4fVxuICAgICAgICAgICAgaGFuZGxlTmV4dCA9IHt0aGlzLmhhbmRsZU5leHR9XG4gICAgICAgICAgICBoYW5kbGVQcmV2aW91cyA9IHt0aGlzLmhhbmRsZVByZXZpb3VzfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tbWVkaWFcIj5cbiAgICAgICAgICAgIHttZWRpYVJvd31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L011aVRoZW1lUHJvdmlkZXI+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBob3RvUm93V2l0aE1vZGFsUGljdHVyZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhcHAvY29tcG9uZW50cy9Qcm9qZWN0cy9QaG90b1Jvd1dpdGhNb2RhbFBpY3R1cmUuanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7OztBQUVBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQWRBO0FBb0JBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBOzs7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFGQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBU0E7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQVZBO0FBREE7QUFpQkE7Ozs7QUE3RkE7QUFDQTtBQStGQTsiLCJzb3VyY2VSb290IjoiIn0=");

/***/ })

})