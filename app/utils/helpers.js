function formatZero(x) {
  x = "" + x;
  if (x.length == 1) {
    return "0" + x;
  }
  return x;
}

Date.prototype.skipUTCWeekdays = function(dayOfWeek, skipNum) {
	var skipped = 0;
	for (var i=1;i<=28;i++) { /* There is lots of room for optimization here. */
		this.setUTCDate(i);
		if (this.getUTCDay() == dayOfWeek) {
			if (skipNum == skipped) return;
			skipped++;
		}
	}
};

Date.prototype.isUSDst = function(offsetUTCMin) {
	var offset = offsetUTCMin * 60 * 1000; /* offset in ms */
	var baseDate = new Date();

	baseDate.setTime(0);
	baseDate.setUTCHours(2);
	baseDate.setUTCFullYear(new Date().getUTCFullYear());

	/* DST in US Starts 2nd Sunday in March at 2 AM local time. */
	baseDate.setUTCMonth(2);
	baseDate.skipUTCWeekdays(0, 1);

	/* If it's before DST start + offset, it isn't dst. */
	if ((this.getTime()+offset) < baseDate.getTime()) {
		return(false);
	}

	/* DST in US Ends 1st Sunday in November at 2 AM local time. */
	baseDate.setUTCMonth(10);
	baseDate.skipUTCWeekdays(0, 0);

	/* If it's between DST start + offset and DST end + offset, it is dst. */
	if ((this.getTime()+offset) < baseDate.getTime()) {
		return(true);
	}

	/* Not DST */
	return(false);
};

export default {
  formatZero: formatZero,

  datestamp: function(unixtime) {
	  var date = new Date();

	  var pacificOffset = date.isUSDst(-480) ? -420 : -480; /* Pacific is -480/-420 daylight time, or GMT-8/-7*/

	  /* Offset to Pacific time in seconds. Datestamps have to be in PDT/PST, because they're generated in PDT/PST */
	  var offset = pacificOffset * 60;

	  date.setTime((unixtime + offset) * 1000);
    
	  var year  = date.getUTCFullYear();
	  var month = date.getUTCMonth() + 1;
	  var day   = date.getUTCDate();
	  return("" + formatZero(month) + '/' + formatZero(day) + '/' + year);
  }

};
