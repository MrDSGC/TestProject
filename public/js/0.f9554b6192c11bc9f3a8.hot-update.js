webpackHotUpdate(0,{

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(1);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Dialog = __webpack_require__(46);\n\nvar _Dialog2 = _interopRequireDefault(_Dialog);\n\nvar _FlatButton = __webpack_require__(37);\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _MuiThemeProvider = __webpack_require__(16);\n\nvar _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar LightBoxDialog = function LightBoxDialog(props) {\n  var actions = [_react2.default.createElement(_FlatButton2.default, {\n    label: 'Close',\n    primary: true,\n    onClick: function onClick() {\n      props.handleClose();\n    }\n  })];\n  return _react2.default.createElement(\n    _MuiThemeProvider2.default,\n    null,\n    _react2.default.createElement(\n      _Dialog2.default,\n      {\n        modal: false,\n        open: props.pictureViewDialogStatus,\n        onRequestClose: function onRequestClose() {\n          props.handleClose();\n        },\n        actions: actions\n      },\n      _react2.default.createElement(\n        'div',\n        { className: 'modal_content_container' },\n        _react2.default.createElement('img', { className: 'modal_image_view', src: props.mediaToRender.mediaURL }),\n        _react2.default.createElement(\n          'div',\n          { className: 'modal_image_description' },\n          props.mediaToRender.mediaDescription\n        )\n      ),\n      _react2.default.createElement(\n        'button',\n        { onClick: function onClick() {\n            props.handleNext();\n          }, className: 'lightbox-right-arrow' },\n        _react2.default.createElement('img', { 'class': 'arrow-img', src: '/assets/img/arrow-147173_1280.png' })\n      ),\n      _react2.default.createElement(\n        'button',\n        { onClick: function onClick() {\n            props.handlePrevious();\n          }, className: 'lightbox-left-arrow' },\n        _react2.default.createElement('img', { 'class': 'arrow-img', src: '/assets/img/arrow-147175_1280.png' })\n      )\n    )\n  );\n};\nexports.default = LightBoxDialog;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjE0LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2FwcC9jb21wb25lbnRzL0NvbW1vbkNvbXBvbmVudHMvTGlnaHRCb3hEaWFsb2cuanM/Mjk0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IERpYWxvZyBmcm9tICdtYXRlcmlhbC11aS9EaWFsb2cnO1xuaW1wb3J0IEZsYXRCdXR0b24gZnJvbSAnbWF0ZXJpYWwtdWkvRmxhdEJ1dHRvbic7XG5pbXBvcnQgTXVpVGhlbWVQcm92aWRlciBmcm9tICdtYXRlcmlhbC11aS9zdHlsZXMvTXVpVGhlbWVQcm92aWRlcic7XG5cbmNvbnN0IExpZ2h0Qm94RGlhbG9nID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IGFjdGlvbnMgPSBbXG4gICAgPEZsYXRCdXR0b25cbiAgICAgIGxhYmVsPVwiQ2xvc2VcIlxuICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgIG9uQ2xpY2s9eyAoKT0+IHsgcHJvcHMuaGFuZGxlQ2xvc2UoKX0gfVxuICAgIC8+XG4gIF07XG4gIHJldHVybiAoXG4gICAgPE11aVRoZW1lUHJvdmlkZXI+XG4gICAgICA8RGlhbG9nXG4gICAgICAgIG1vZGFsPXtmYWxzZX1cbiAgICAgICAgb3Blbj17cHJvcHMucGljdHVyZVZpZXdEaWFsb2dTdGF0dXN9XG4gICAgICAgIG9uUmVxdWVzdENsb3NlPXsgKCk9PiB7cHJvcHMuaGFuZGxlQ2xvc2UoKX0gfVxuICAgICAgICBhY3Rpb25zID0ge2FjdGlvbnN9XG4gICAgICA+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbF9jb250ZW50X2NvbnRhaW5lclwiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwibW9kYWxfaW1hZ2Vfdmlld1wiIHNyYz17cHJvcHMubWVkaWFUb1JlbmRlci5tZWRpYVVSTH0gLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsX2ltYWdlX2Rlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICB7cHJvcHMubWVkaWFUb1JlbmRlci5tZWRpYURlc2NyaXB0aW9ufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7cHJvcHMuaGFuZGxlTmV4dCgpfX0gY2xhc3NOYW1lPVwibGlnaHRib3gtcmlnaHQtYXJyb3dcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwiYXJyb3ctaW1nXCIgc3JjPVwiL2Fzc2V0cy9pbWcvYXJyb3ctMTQ3MTczXzEyODAucG5nXCIvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7cHJvcHMuaGFuZGxlUHJldmlvdXMoKX19IGNsYXNzTmFtZT1cImxpZ2h0Ym94LWxlZnQtYXJyb3dcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzPVwiYXJyb3ctaW1nXCIgc3JjPVwiL2Fzc2V0cy9pbWcvYXJyb3ctMTQ3MTc1XzEyODAucG5nXCIvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvRGlhbG9nPlxuICAgIDwvTXVpVGhlbWVQcm92aWRlcj5cbiAgICApXG59XG5leHBvcnQgZGVmYXVsdCBMaWdodEJveERpYWxvZztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhcHAvY29tcG9uZW50cy9Db21tb25Db21wb25lbnRzL0xpZ2h0Qm94RGlhbG9nLmpzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBSEE7QUFNQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFKQTtBQU9BO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUZBO0FBTUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQWhCQTtBQURBO0FBdUJBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ })

})