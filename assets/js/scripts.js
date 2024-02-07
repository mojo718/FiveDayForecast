  // Display the current date in the header (added current time)
  var currentDay = dayjs().format("dddd, MMMM D, YYYY h:mm A");
  $("#currentDay").text(currentDay);