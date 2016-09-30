# ng-numbers-only

> NG Numbers Only - Input number in a easy way in AngularJS Apps

[![Build Status](https://travis-ci.org/willmendesneto/ng-numbers-only.png?branch=master)](https://travis-ci.org/willmendesneto/ng-numbers-only)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/ng-numbers-only/badge.svg?branch=master)](https://coveralls.io/r/willmendesneto/ng-numbers-only?branch=master)


## Installation

1 - Via NPM

```bash
$ npm install ng-numbers-only
```

2 - Via bower

```bash
$ bower install ng-numbers-only
```

3 - Clone this repository and access the generated folder

```bash
$ git clone git://github.com/willmendesneto/ng-numbers-only.git [project-name]
$ cd [project-name]
```
Once you have ng-numbers-only in your project, just include 'keepr.ngNumbersOnly' as a dependency in your Angular application and you’re good to go. It's works!

```javascript
    angular.module('myModule', ['keepr.ngNumbersOnly'])
```

4 - Configurations

This directive accepts some configurations, such as:

- `precision`: integer with float value to be used to fix the decimal precision. [`toFixed()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) is not being used anymore because it calls [`Math.round` method](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/round) internally.

## FAQ

> Why the component doesn't have support to accept scientific notation/exponential values?

Because by default since April 2015 AngularJS supports exponential values/scientific notation in ngModel. More details in [https://github.com/angular/angular.js/issues/11602](https://github.com/angular/angular.js/issues/11602)

## Example

You can access this plunker with a live Example.

```javascript

angular.module('ngNumbersOnly', [
  'keepr.ngNumbersOnly' // Loading `keepr.ngNumbersOnly` component in your application
])
.controller('ngNumbersOnly', function() {
  this.value = 10;
});
```

```html
<input type="number" numbers-only precision="2" ng-model="value" step="0.10" min="0" />
```

PS: You should have a `ngModel` in your input to use this component.

http://embed.plnkr.co/P5hoQ2/


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>


Please [create a new issue](https://github.com/willmendesneto/ng-numbers-only/issues) if you like to add a new feature in the component.

New features comming soon.
