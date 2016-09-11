'use strict';

describe('numbersOnly', function() {

  // load the service's module
  beforeEach(module('keepr.ngNumbersOnly'));

  var element,
    rootScope,
    ngModel,
    compileElement,
    scope;

  beforeEach(inject(function($rootScope, $compile) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    scope.stake = 10.35;
    scope.precision = 2;

    compileElement = function() {
      var template = '<input type="number" numbers-only precision="{{precision}}" ng-value="stake" ng-model="stake" />';
      var element = angular.element(template);
      $compile(element)(scope);
      scope.$digest();

      ngModel = element.controller('ngModel');
      return element;
    };
  }));

  describe('When the component is initialised', function() {
    beforeEach(function() {
      element = compileElement();
    });

    it('should render the informed value', function() {
      expect(element.val()).toBe('10.35');
    });
  });

  describe('Given an unexpected value is added', function() {
    describe('When is a number with string', function() {
      beforeEach(function() {
        element = compileElement();
        window.event = {keyCode: 80};
        spyOn(String, 'fromCharCode').and.returnValue('x');
        ngModel.$setViewValue('12.15x');
        element.triggerHandler('keypress');
        rootScope.$digest();
      });

      it('should accept only numbers', function() {
        expect(element.val()).toBe('12.15');
      });
    });

    describe('When is a scientific notation number is pasted in the field', function() {
      beforeEach(function() {
        element = compileElement();
        ngModel.$setViewValue('9.e3');
        element.triggerHandler('blur');
        rootScope.$digest();
      });

      it('should transform the value to the accepted format', function() {
        expect(element.val()).toBe('9000');
      });
    });

    describe('When is a number with more than 2 decimal values', function() {
      beforeEach(function() {
        element = compileElement();
        window.event = {keyCode: 49};
        spyOn(String, 'fromCharCode').and.returnValue('2');
        ngModel.$setViewValue('53.5123');
        element.triggerHandler('keypress');
        rootScope.$digest();
      });

      it('should accept only numbers', function() {
        expect(element.val()).toBe('53.51');
      });
    });

    describe('When input number is an integer', function() {
      beforeEach(function() {
        element = compileElement();
        window.event = {keyCode: 49};
        spyOn(String, 'fromCharCode').and.returnValue('0');
        ngModel.$setViewValue('53');
        element.triggerHandler('keypress');
        rootScope.$digest();
      });

      it('should show number without decimal values', function() {
        expect(element.val()).toBe('53');
      });
    });

    describe('When input is empty', function() {
      beforeEach(function() {
        element = compileElement();
        window.event = {keyCode: 49};
        spyOn(String, 'fromCharCode').and.returnValue('');
        ngModel.$setViewValue('');
        element.triggerHandler('keypress');
        rootScope.$digest();
      });

      it('should return an empty string', function() {
        expect(element.val()).toBe('');
      });
    });


  });
});
