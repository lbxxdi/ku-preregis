


var s_list = {
	save :function()
	{
		$.ajax({
		  url      : "./record.php",
		  type     : "POST",
		  data     : { data: JSON.stringify(s_list.data)},
		  dataType : "text",
		  success  : function(id) {
			window.history.pushState('KU-PreRegis', 'KU-PreRegis', '?id='+id);
		  }
		})
		return true;
	},
};

// ###############  Schedule ##########################
var calls  = 0,
    sem    = 2,
    subs   = [],
    T_list = [],
	t_list = [],
    days   = { 'จ': 0, 'อ': 1, 'พ': 2, 'พฤ': 3, 'ศ': 4, 'ส': 5 ,'อา':6},
    TID    = 0,
    calls  = 0,
    status = ""; // change seminister here

/*
s_list.destroy()
s_list.add({"id":"12","sec":"34"})
s_list.add({"id":"21","sec":"44"})
s_list.add({id:"12",sec:"34"})
s_list.show()
s_list.remove({id:"12", sec:"34"})
s_list.show()
s_list.remove({id:"21",sec:"44"})
s_list.show()
*/


  function Toast(msg,time){
    var $toast = $('#toast');

            $toast.parent().fadeIn();
            $toast.html(msg);

            setTimeout(function () {
              $toast.parent().fadeOut();
            }, time);
  }

  function reload() {
    $('.timetable').each(function (e) {
      $(this).initialiseTT();
      $(this).resizeTimetable();
    });
  }


//############### ______TABLE_____ ###############
  function table(id, str, sub, name) {
    var l_day = str.indexOf("."),
        day   = str.slice(0,l_day);

    time   = str
    str    = str.slice(l_day + 1);
    str    = str.split("-");
    day    = days[day];

    str[0] = str[0].split(".");
    str[1] = str[1].split(".");


    var start = parseInt(str[0][0]) + parseInt(str[0][1]) / 60.0,
        end   = parseInt(str[1][0]) + parseInt(str[1][1]) / 60.0;

    if(end == 100.0) end = 10

    sub = [name, '' + id + ' '+'Sec ' + sub[0], sub[2]+" "+sub[3].split("<br>").join(", ")].join("<br>");

    $item = $('<li></li>');

    $item.attr('class', 'tt-event');
    $item.attr('data-id', TID);
    $item.attr('data-day', day);
    $item.attr('data-start', start);
    $item.attr('data-duration', end - start);
    $item.attr('data-rstart',start);
    $item.attr('data-rend',end);

    $item.html(sub);

    T_list.push($item);
  }


//#########___________OLD__________END_____________ ############
s_list.show = function()
{
    status = "plot";
    if(s_list.data.length>0)
        $('#id-loading').fadeIn();

    T_list = [];
    TID    = 0;


    s_list.data.forEach(function(t){
        load_subject(t.id,t.lecSec,t.labSec);
    })

    $.ajax({url:"js/noop"})


}

localStorage.clear()

$('.main-loading').show();
$(document).ajaxComplete(function () {

    if(calls== 0 && status == "plot")
    {
      console.log("Reordering !!")

      if(T_list.length==0)
      {
          max_t=16;
          min_t=8;
      }
      else
      {
          T_list.sort(function(a, b) { return $(a).attr('data-start') - $(b).attr('data-start'); } );

          min_t = Math.floor( $(T_list[0]).data("rstart"))
          max_t = 0;
          $(T_list).each(function(){ T_T = $(this).data("rend"); if(T_T > max_t) max_t = T_T;});
          max_t = Math.ceil(max_t)
      }

      $(".tt-events").empty(); $(".tt-times").empty();

      for(var i=min_t;i<max_t;i+=1)
      {
        $(".tt-times").append('<div class="tt-time" data-time="'+(i-min_t)+'">'+i+'<span class="hidden-phone">:00</span></div>');
      }
      $(".timetable").data('hours',(max_t-min_t))

      $('.timetable').resize(function (e) {
          $(this).resizeTimetable();
      });

      T_list.forEach(function(v) {
        v = $(v).data('start',$(v).data('start')-min_t)
        $(".tt-events").append(v);
        reload();
      });
      reload();
      console.log("Finished !!")
    }
});