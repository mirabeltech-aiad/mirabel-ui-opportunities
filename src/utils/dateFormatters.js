
import {getGlobalMessage} from './commonHelpers';

// This is especially used to pass the value to the DB
export const getIsoDate = (dateString) => {
  return formatDate(getMDYFormat(dateString), "mm/dd/yyyy");
};
export const formatDateWithTime = (dateString) => {
  let date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0) and noon (12)

  // Pad with leading zeros if necessary
  var formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  var formattedDate = date.getDate().toString().padStart(2, '0');
  var formattedHours = hours.toString().padStart(2, '0');
  var formattedMinutes = minutes.toString().padStart(2, '0');

  var strTime = formattedHours + ':' + formattedMinutes + ' ' + ampm;
  return formattedMonth + "/" + formattedDate + "/" + date.getFullYear() + " " + strTime;
}
//used to format in MM/dd/yyyy or dd/MM/yyyy format
export const formatDate = function (
  dateString,
  format,
  daysToMinus = 0,
  showUntilCancelled = false
) {
  if (!format) {
    format = getDateFormat();
  }
  if (!dateString) {
    return "";
  }

  let processedDateString = dateString;
  // Replace hyphens with slashes to ensure the date string is parsed as local time, not UTC,
  // only if the dateString is in yyyy-mm-dd format without time.
  // This prevents issues where the date might shift by a day due to timezone differences when only a date (without time) is provided.
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateFormatRegex.test(dateString)) {
    processedDateString = dateString.replace(/-/g, '/');
  }
  let dateValue = new Date(processedDateString);
  let dd = dateValue.getDate() - daysToMinus;
  let MM = dateValue.getMonth() + 1;
  const yyyy = dateValue.getFullYear();

  if (showUntilCancelled && yyyy === 9999) {
    return "Until Cancelled";
  }

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (MM < 10) {
    MM = `0${MM}`;
  }

  if (format.toLowerCase() === "dd/mm/yyyy") {
    return (dateValue = `${dd}/${MM}/${yyyy}`);
  } else if (format.toLowerCase() === "yyyy-mm-dd") {
    return (dateValue = `${yyyy}-${MM}-${dd}`);
  } else if (format.toLowerCase() === "mm-dd-yyyy") {
    return (dateValue = `${MM}-${dd}-${yyyy}`);
  } else {
    return (dateValue = `${MM}/${dd}/${yyyy}`);
  }
};
export const getDateFormat = function () {
  return getGlobalMessage("MMExtDateFormat") === "d/m/Y"
    ? "dd/MM/yyyy"
    : "MM/dd/yyyy";
};
//Converts YYYY-MM-DD to MM/DD/YYYY
export const getMDYFormat = (dateString) => {
  try {
    if (dateString === "" || !dateString) {
      return "";
    }
    if (Object.prototype.toString.call(dateString) === "[object Date]") {
      let dd = dateString.getDate();
      let MM = dateString.getMonth() + 1;
      const yyyy = dateString.getFullYear();
      return `${MM}/${dd}/${yyyy}`;
    }
    dateString = dateString.split("T")[0]; // remove timestamp from date string
    //Firefox will unable to convert mm-dd-yyyy, It will throw exception for new Date("05-30-2022"), so will we're replacing hyphen (-) with slash (/)
    return moment(dateString.replace(/-/g, "/")).format("MM/DD/YYYY");
  } catch (error) {
    console.log("error occured in getMDYFormat method", error);
    return dateString;
  }
};

export const getDbDateFormat = () => {
  return "MM/dd/yyyy";
};
export const getYMDFormat = () => {
  return "yyyy-mm-dd";
};
export const formatDateAsString = (value) => {
  return format(formatDate(value, getDbDateFormat()), "MMMM D, YYYY");
};
export const formatLongDate = function (dateString, format = getDateFormat()) {
  if (
    dateString &&
    !(
      dateString.toString().indexOf("1900") > -1 ||
      dateString.toString().indexOf("1970") > -1 ||
      dateString.toString().indexOf("0001") > -1
    )
  ) {
    let dateValue = new Date(dateString);
    if (format === "mmmm-dd") {
      return dateValue.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    } else if (format === "mmm-yyyy") {
      return dateValue.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
    // else if(format==='mmm-dd-yyyy')
    else {
      return dateValue.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } else return "";
};
export const formatTime = function (dateString) {
  let date = new Date();
  let from = "";
  if (dateString !== undefined) {
    date = new Date(dateString);
    from = "renderDate";
  }
  let hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  minutes = minutes.toString();
  if (from === "") {
    if (parseInt(minutes[0]) > 2) {
      hours++;
      minutes = "00";
    } else minutes = "30";
  }
  let ampm = hours >= 12 && hours < 24 ? "PM" : "AM";
  let strTime =
    ("0" + (hours % 12 == 0 ? 12 : hours % 12)).slice(-2) +
    ":" +
    minutes +
    " " +
    ampm;
  return strTime;
};
export const calculateDaysBetween = (date1, date2) => {
  // Parse dates and normalize to midnight UTC to avoid timezone issues
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set both dates to midnight to ensure we're comparing full days
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);
  
  // Calculate the difference in milliseconds
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  
  // Convert milliseconds to days (more accurate than ceil)
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};