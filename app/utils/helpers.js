/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

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
  },

  mapData: function(list, name, id, mapF) {
    let filtered = list.filter(function(e) {
      return e[name] == id;
    }).map(mapF);
    return filtered[0];
  },

  // params(account, region, data, cols)
  getJSON: function(api, params, done) {
    let region = params.region ? params.region : 'us-east-1';
    $.get('j/' + api + '/' + params.data + '?a=' + params.account + '&r=' + region, function(result) {
      let key = Object.keys(params.cols)[0];
      if (Array.isArray(result) && Object.keys(result[0]).indexOf(key) !== -1) {
        done({content: result, cols: params.cols});
      } else {
        done({
          content: [{
            message: 'error loading data',
            account: params.account,
            data: params.data
          }], cols: {message: 200, data: 400, account: 200}
        });
      }
    });
  }

};
