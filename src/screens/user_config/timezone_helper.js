import moment from 'moment-timezone';


export const getTimeZoneList = () => {
  var timeZones = moment.tz.names();
  var offsetTmz = [];
  for (var i in timeZones) {
    let label = `(GMT${moment.tz(timeZones[i]).format('Z')}) ${timeZones[i]}`;
    let timeZone = { label, value: timeZones[i] };
    offsetTmz.push(timeZone);
  };
  
  const sortByZone = (a,b) => { 
    let [ahh,amm] = a.label.split("GMT")[1].split(")")[0].split(":"); 
    let [bhh,bmm] = b.label.split("GMT")[1].split(")")[0].split(":");
    return (+ahh*60+amm) - (+bhh*60+bmm)
  };
  return offsetTmz.sort(sortByZone);
};