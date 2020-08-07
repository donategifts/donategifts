/*
* Author: Stacy Sealky Lee
* Class: CSC 337
* Type: Programming Assignment 3
* FileName: slider.js
* Purpose: This javascript file contains a function that displays the select value in the bubble from a custom range slider.
*/

const allRanges = document.querySelectorAll(".wrap-radio");
allRanges.forEach(wrap => {
  const range = wrap.querySelector(".slider");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  setBubble(range, bubble);
});

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

//polyfil for date input
if ( $('#birthday')[0].type != 'date' ) $('#birthday').datepicker();
