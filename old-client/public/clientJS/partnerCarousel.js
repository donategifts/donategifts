var carouselDiv = $('.small3');
var imgList = $('.small3 .small-ul li');
var arrowBtns = $('.small3 .small-span');

// Reset Li length
imgList.parent().attr('data-small3', imgList.length);
// Run imgList Carousel
var carouselImg = function () {
  var imgList = $('.small3 .small-ul li');
  if (imgList.length <= imgList.parent().data('small3')) {
    imgList
      .parent()
      .append('<li>' + imgList.first().html() + '</li>')
      .children()
      .first()
      .animate(
        {
          marginLeft: -imgList.first().outerWidth(),
        },
        3000,
        function () {
          imgList.first().remove();
        },
      );
  }
};
//Auto Slider
var autoSlideCarousel = setInterval(carouselImg, 2500);
// Pause
carouselDiv.mouseenter(function () {
  clearInterval(autoSlideCarousel);
});
// Resume
carouselDiv.mouseleave(function () {
  autoSlideCarousel = setInterval(carouselImg, 1000);
});

// Right Btn
arrowBtns.first().on('click', function () {
  var imgList = $('.small3 .small-ul li'),
    LeftImg = imgList.first().html();
  if (imgList.length <= imgList.parent().data('small3')) {
    imgList
      .parent()
      .append('<li>' + LeftImg + '</li>')
      .children()
      .first()
      .remove();
  }
});
// Left Btn
arrowBtns.last().on('click', function () {
  var imgList = $('.small3 .small-ul li');
  lastImg = imgList.last().html();
  if (imgList.length <= imgList.parent().data('small3')) {
    imgList
      .parent()
      .prepend('<li>' + lastImg + '</li>')
      .children()
      .last()
      .remove();
  }
});
