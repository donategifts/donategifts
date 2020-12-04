
$(function daysUntilChristmas() {
  let today = new Date();
  const xmas = new Date(today.getFullYear(), 11, 25);
  if (today.getMonth() === 11 && today.getDate() > 25) {
    xmas.setFullYear(xmas.getFullYear() + 1);
  }
  const one_day = 1000 * 60 * 60 * 24;

  //If T-Christmas is 1 day:
  if (Math.ceil((xmas.getTime() - today.getTime()) / (one_day)) === 1) {
    $('#tilChristmas').text('1');
    $('.status_christmas_line').text(`day until Christmas`);

  }//If it is Christmas Day:
  else if (Math.ceil((xmas.getTime() - today.getTime()) / (one_day)) === 0) {
    $('#status_christmas').append(
      '<span class=\'xMasDay\'>Merry Christmas!</span>');
    $('#tilChristmas').remove();

    //If days is not the above two:
  } else {
    let daysLeft = Math.ceil((xmas.getTime() - today.getTime()) / (one_day));
    $('#tilChristmas').text(daysLeft);
    $('.status_christmas_line').text(`days until Christmas`);

  }
});
