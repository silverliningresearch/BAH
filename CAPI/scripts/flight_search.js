var flightRawList;
var flightList = [];
var flightShortList = [];
var flightForInterview;
/************************************/
function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
}

function flight_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          return true;
        }
      }
    }
  }
  return false;
}

function notDeparted_flight_search(flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bahrain', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  
  //plus  3 hour
  flight_time_value = flight_time_value + 180;

  var result = (flight_time_value > current_time_value);
  //var result = true; //skip this check as requested by BUD team
  return (result);
}

function load_flight_list() {
  flightRawList = JSON.parse(BAH_Departures_Flight_List_Raw);
  flightList = [];
  flightList.length = 0;
  flightShortList = [];
  flightShortList.length = 0;

  for (i = 0; i < flightRawList.length; i++) {
    var flight = flightRawList[i];
    if ((flight.Date == getToDate() && notDeparted_flight_search(flight.Time)) //today flight && departure
    ) 
    {
      {
        var Date = '"Date"' + ":" + '"' +  flightRawList[i].Date + '", ';
        var Time = '"Time"' + ":" + '"' +  flightRawList[i].Time + '", ';
        var Flight = '"Flight"' + ":" + '"' +  flightRawList[i].Flight + '", ';
        var Airline = '"Airline"' + ":" + '"' +  flightRawList[i].Airline + '", '; //name
        var AirlineCode = '"AirlineCode"' + ":" + '"' +  flightRawList[i].AirlineCode + '", ';//code
        var Dest = '"Dest"' + ":" + '"' +  flightRawList[i].Dest + '", ';
        var DestName = '"DestName"' + ":" + '"' +  flightRawList[i].DestName + '", ';
        var Via = "";
        var ViaName = "";

        if (  flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Via = '"Via"' + ":" + '"' +  flightRawList[i].Next + '", ';
          ViaName = '"ViaName"' + ":" + '"' +  flightRawList[i].NextName + '", ';
        }

        var Show = '"Show"' + ":" + '"' +  flightRawList[i].Flight + " (" 
        Show += flightRawList[i].Time + " to " + flightRawList[i].DestName ;
        if (flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Show += " via " +  flightRawList[i].Next ;
        }
        Show +=")";

        var str = '{' + Date + Time + AirlineCode + Airline + Flight +  Dest + DestName + Via + ViaName +  Show + '"}';
      
        flightList.push(JSON.parse(str));
      }
    }
  }

  aui_init_search_list(flightList);
  console.log("Load flight list done!");
}

function save_flight_value(question, value) {
  console.log("question:", question);
  console.log("value:", value);

  api.fn.answers({Q9_show:  value.Show});
  api.fn.answers({Q9_airline_name:   value.Airline}); //airline name
  api.fn.answers({Q9_airline:   value.AirlineCode}); //airline code
  api.fn.answers({Q9_flight_number:   value.Flight});
  api.fn.answers({Q9_destination:   value.Dest});
  api.fn.answers({Q9_destination_name: value.DestName});
  
  console.log("save flight  done!");
}

function show_flight_search_box(question) {
  load_flight_list();
  
  var defaultValue = "";

  aui_show_external_search_box(question, defaultValue);
}

function hide_flight_search_box() {
  aui_hide_external_search_box();
}