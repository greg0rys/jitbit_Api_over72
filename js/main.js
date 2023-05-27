
const user_id = [20,28,1,76,23,6,42,26,56,21,13]
let userNames = [];
//Creates a base-64 encoded Authorization header value
var makeBasicAuthHeader = function(username, password) {
  return "Basic " + btoa(username + ":" + password);
}

//Set's default authorization header for all jQuery AJAX requests
$.ajaxSetup({
  headers: { 'Authorization': makeBasicAuthHeader("gshenefelt@silverliningstechnology.com", "Radiokid!!123") },
  crossDomain: true
});

// generate list of users names that have tickets > 72
(function(){
  let tempNames = [];
  let idx = 0;
  $.get("https://hd.silverliningstechnology.com/api/tickets?tagName=Over72&count=300",
  function(tickets){
    if(tickets.length > 0)
    {
      $.each(tickets(function(index,val){
        tempNames[idx] = val.TechFirstName;
        idx++;
      }));
      userNames = [... new Set(tempNames)]; // make the list unique
    }
  });
})();

//Gets the list of unanswered tickets for the authenticated user
//Replace "XXXXX" with your helpdesk URL
$.get("https://hd.silverliningstechnology.com/api/tickets?tagName=Over72&count=300",
  function(tickets){
    if(tickets.length > 0){

      let totalTickets = tickets.length;
      $.each(tickets, function(index, val) {
        if(val.Status !== "Closed" && val.Status !== "Resolved" && val.Status !== "Resolved w/o Action" )
        {
          let form = document.querySelector("body")
          let bod = $("#tablebod");
          let row = $("<tr></tr>");
          let tData = $("<td></td>");
          let tNumber = $("<td></td>");
          let sDate = $("<td></td>");
          let stat = $("<td></td>");
          let mod_date = val.IssueDate.search("T");
          let mod_dates = val.IssueDate.substr(1,mod_date -1);

          // form.innerHTML += "Tech: " + val.TechFirstName + "&nbsp;"
          //   + "Submitter: " + val.UserName + "&nbspb; "
          //   +"Ticket Subject: " + val.Subject  + " " + val.DateFrom + "<br>";
          $(tData).html(val.TechFirstName);
          $(tNumber).html(val.IssueID);
          $(sDate).html(mod_dates);
          $(stat).html(val.Status);
          $(row).append(tData,tNumber,sDate,stat);
          $(bod).append(row);
        }
        else {
          totalTickets--;
        }

        $("header").html(`There are ${totalTickets} tickets > 3 days old open`);
        for(let i = 0; i < userNames.length; i++) {
          let name = ("<span></span><br/>");
          $(name).html(userNames.at(i));
          $("footer").append(name);
        }

      });
    }
  }
);



