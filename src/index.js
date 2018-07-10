/* eslint-disable*/

import './main.scss';

import "babel-polyfill";

import 'jquery/dist/jquery.js';
import 'popper.js/dist/umd/popper.js';

function component() {
  const element = document.createElement('button');
  element.id = 'btn'
  element.classList = "btn btn-primary";
  element.innerHTML = 'Click Me';
  return element;
}

$('body').append(component());
$('#btn').click(() => {
  alert('Hello webpack!');
});
