(function(window, angular, undefined){ "use strict";

angular.module('keepr.ngNumbersOnly', []);



angular.module('keepr.ngNumbersOnly')
.directive('numbersOnly', function() {
  return {
    require: 'ngModel',
    scope: {
      precision: '@'
    },
    link: function(scope, element, attrs, modelCtrl) {
      var currencyDigitPrecision = scope.precision;

      var countDecimalLength = function (number) {
         var str = '' + number;
         var index = str.indexOf('.');
         if (index >= 0) {
           return str.length - index - 1;
         } else {
           return 0;
         }
      };

      var currencyDigitLengthIsInvalid = function(inputValue) {
        if (!inputValue) {
          inputValue = 0;
        }
        return countDecimalLength(inputValue) > currencyDigitPrecision;
      };

      var parseNumber = function(inputValue) {
        if (!inputValue) {
          return null;
        }

        // This is required because input numbers can accept exponential numbers
        // more details about this issue on https://codereview.chromium.org/1587103003
        inputValue = inputValue.toString().match(/-?(\d+|\d+.\d+|.\d+)([eE][-+]?\d+)?/g).join('');

        if (inputValue.match(/(e|E|-|\+)/) ) {
          inputValue = parseFloat(parseFloat(inputValue).toFixed(20).replace(/0+$/,'')).slice(0, -(20 - currencyDigitPrecision));
        }

        if (!!currencyDigitPrecision && currencyDigitLengthIsInvalid(inputValue)) {
          inputValue = parseFloat(inputValue).toFixed(20).slice(0, -(20 - currencyDigitPrecision));
          modelCtrl.$viewValue = inputValue;
        }
        return inputValue;
      };

      var isAnAcceptedEventCharCodeCase = function(charCode) {
        var isANumberEventKeycode = '0123456789'.indexOf(charCode) !== -1;
        var isACommaEventKeycode = charCode === ',';
        var isADotEventKeycode = charCode === '.';
        return isANumberEventKeycode || isACommaEventKeycode || isADotEventKeycode;
      };

      var isAnAcceptedKeyboardCodeCase = function(eventKeyboardCode) {
        return [
          8 // backspace
        ].indexOf(eventKeyboardCode) !== -1;
      };

      var isAnAcceptedInputCase = function(eventKeyboardCode) {
        var charCode = String.fromCharCode(eventKeyboardCode);
        return isAnAcceptedEventCharCodeCase(charCode) || isAnAcceptedKeyboardCodeCase(eventKeyboardCode);
      };

      var onKeypressEventHandler = function(evt) {
        var eventKeyboardCode = evt.which || event.keyCode;

        var forceRenderComponent = false;
        forceRenderComponent = currencyDigitLengthIsInvalid(modelCtrl.$viewValue);

        var isAnAcceptedCase = isAnAcceptedInputCase(eventKeyboardCode);

        if (!isAnAcceptedCase) {
          evt.preventDefault();
        }

        if (forceRenderComponent) {
          modelCtrl.$render(modelCtrl.$viewValue);
        }

        return isAnAcceptedCase;
      };

      var onBlurEventHandler = function() {
        modelCtrl.$render(modelCtrl.$viewValue);
      };

      element.on('keypress', onKeypressEventHandler);
      element.on('blur', onBlurEventHandler);

      modelCtrl.$render = function(inputValue) {
        return element.val(parseNumber(inputValue));
      };

      modelCtrl.$parsers.push(function(inputValue) {

        if (!inputValue) {
          return inputValue;
        }

        var transformedInput;
        modelCtrl.$setValidity('number', true);
        transformedInput = parseNumber(inputValue);

        if (transformedInput !== inputValue) {

          modelCtrl.$viewValue = transformedInput;
          modelCtrl.$commitViewValue();
          modelCtrl.$render(transformedInput);
        }
        return transformedInput;
      });
    }
  };
});
})(window, window.angular);