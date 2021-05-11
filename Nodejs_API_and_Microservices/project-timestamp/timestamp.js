// Timestamp logic

// validate date
const isValidDate = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if ( !isNaN(date.getTime()) ) {
      // date is valid
      return true;
    }
  }
}

exports.date = function (req, res) {
  let date;
  
  // validate Data
  if (!req.params.date) {
    const unix = Date.now();
    const utc = new Date().toUTCString();
    res.json({ unix, utc });

  } else if ( /^[\+-]?\d+$/.test(req.params.date)) {
    date = new Date(parseInt(req.params.date));

  } else {
    date = new Date(req.params.date);
  }
  
  if ( isValidDate(date)) {
    let utc = date.toUTCString();
    let unix = date.getTime();
    res.json({ unix, utc });

  } else {
    res.json({ error : "Invalid Date" });
  }  
};


  