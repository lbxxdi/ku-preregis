

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



localStorage.clear()
$(document).ajaxComplete(function () {
    if(calls == 0 && status == "load_id")
    {

    }

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

      $('#id-loading').fadeOut();

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