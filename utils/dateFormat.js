const addDateSuffix = (date) => {
    const lastChar = date.toString().slice(-1);
    if (lastChar === '1' && date !== 11) {
      return `${date}st`;
    } else if (lastChar === '2' && date !== 12) {
      return `${date}nd`;
    } else if (lastChar === '3' && date !== 13) {
      return `${date}rd`;
    } else {
      return `${date}th`;
    }
  };
  
  // Function to format a timestamp, accepts the timestamp and an `options` object as parameters
  module.exports = (
    timestamp,
    { monthLength = 'short', dateSuffix = true } = {}
  ) => {
    // Create month object
    const months = [
      monthLength === 'short' ? 'Jan' : 'January',
      monthLength === 'short' ? 'Feb' : 'February',
      monthLength === 'short' ? 'Mar' : 'March',
      monthLength === 'short' ? 'Apr' : 'April',
      monthLength === 'short' ? 'May' : 'May',
      monthLength === 'short' ? 'Jun' : 'June',
      monthLength === 'short' ? 'Jul' : 'July',
      monthLength === 'short' ? 'Aug' : 'August',
      monthLength === 'short' ? 'Sep' : 'September',
      monthLength === 'short' ? 'Oct' : 'October',
      monthLength === 'short' ? 'Nov' : 'November',
      monthLength === 'short' ? 'Dec' : 'December',
    ];
  
    const dateObj = new Date(timestamp);
    const formattedMonth = months[dateObj.getMonth()];
    const dayOfMonth = dateSuffix
      ? addDateSuffix(dateObj.getDate())
      : dateObj.getDate();
    const year = dateObj.getFullYear();
    const periodOfDay = dateObj.getHours() >= 12 ? 'PM' : 'AM';
    const formattedHour = (dateObj.getHours() % 12) || 12;
    const minutes = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();
    const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year} at ${formattedHour}:${minutes} ${periodOfDay}`;
  
    return formattedTimeStamp;
  };
  