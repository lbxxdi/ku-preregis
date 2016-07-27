var Generate = React.createClass({
  getInitialState: function() {
   return {
      subjectList : [],
      ttEvents : [],
      ttHours : 8,
      minStart : 8,
      ajaxResult : [],
   };
},

 componentDidMount: function() {
    $('.timetable-wrapper').hide();
    $('.timetable').resize(function (e) {
        $(this).resizeTimetable();
    });

    this.render();
 },

 componentWillUnmount: function() {


 },

 getSubjectList: function() {
    
    let subjectList = this.props.getSubjectList();

    this.setState({
      subjectList
    });

    return subjectList;
 },

 getEvent: function(subject,type) {


    console.log("load-event :",subject.code);
  
    return $.get(`/section/${subject.code}/${subject[type]}/${type}`,(result) => {

      let event;
      result.name = subject.name;
      result.eventId = subject.eventId;

      event = result.period.map( (period) => {
        
        let tempEvent = $.extend(true, {}, result);

        delete tempEvent.period;

        for(let field in period) {
          tempEvent[field] = period[field];
        }

        return tempEvent;
      })

      this.setState({
        ajaxResult : this.state.ajaxResult.concat(event),
      })

    })

 },
 setHours: function(hours) {

    let data = this.state.ttHours;
    if (hours) {
      data = hours;
    }

    $('.timetable').data('hours',data);

 },
 componentDidUpdate: function() {

 },

 submit: function(needSave) {
    loadingStart();

    let subjectList = this.getSubjectList();

    let minStart = Infinity;
    let maxEnd = 0;
    let eventId = 0;
    let deferreds = [];

    subjectList.forEach((subject) => {

      subject.eventId = eventId;

      if(subject.lec!=='-') deferreds.push(this.getEvent(subject,"lec"));
      if(subject.lab!=='-') deferreds.push(this.getEvent(subject,"lab"));

      eventId+=1;
    })

    $.when.apply(null, deferreds).done( () => {
      
      console.log("load-event complete !!");

      let ttEvents = $.extend(true, [], this.state.ajaxResult);

      ttEvents.sort(function(a, b) {return a.start-b.start;});

      ttEvents.forEach((event) => {
        let start = Math.floor(event.start);
        let end = Math.ceil(event.end);

        if(start < minStart) minStart = start;
        if(end > maxEnd)     maxEnd = end;
      });

      ttEvents.map((event) => {
        event.duration = event.end-event.start;
        event.start=event.start-minStart;
        delete event.end;
        return event;
      })

      this.setState({
        ttEvents,
        ttHours : (maxEnd ? maxEnd-minStart : 8),
        minStart : (maxEnd ? minStart : 8),
        ajaxResult : [],
      },function(){
        this.setHours();
        this.reload();

        $('.timetable-wrapper').slideDown();
        loadingComplete();

        if (needSave) {
          this.props.saveTable();
        } else {
          $('html, body').animate({ scrollTop: $('.timetable-wrapper').offset().top }, 1000);
        }

      });

    }); 
 
 },

 reload: function () {

  console.log("reloading");

   $('.timetable').each(function (e) {
     $(this).initialiseTT();
     $(this).resizeTimetable();
   });

 },

 render: function() {

   return (
      <section className='generate'>
        <div className='submit' onClick={this.submit.bind(null,true)}><span className='text'>Go!</span></div>
        <div className='timetable-wrapper'>
          <div className='timetable' data-days='7' data-hours={this.state.ttHours}>
            <ul className='tt-events'>
              { this.state.ttEvents.map((event) => {
                return (<li className="tt-event" key ={""+ event.eventId + event.day + event.start}
                          data-id={event.eventId} data-day={event.day} data-start={event.start} data-duration={event.duration} 
                          rel="tooltip" unselectable="on" >
                          {event.name}<br/>{event.code} Sec {event.sec}<br/>{event.room}&nbsp; {event.teacher}&nbsp;</li>);
              })}
            </ul>
            <div className='tt-times'>

              {Array(this.state.ttHours).fill(1).map((value,i)=>{
                return (<div className='tt-time' data-time={i} key={this.state.ttHours+i}>
                        {i+this.state.minStart}<span className='hidden-phone'>:00</span>
                        </div>);
              })}
            </div>
            <div className='tt-days'>
              <div className='tt-day' data-day='0'>
                M<span className='hidden-phone'>on</span>
              </div>
              <div className='tt-day' data-day='1'>
                T<span className='hidden-phone'>ue</span>
              </div>
              <div className='tt-day' data-day='2'>
                W<span className='hidden-phone'>ed</span>
              </div>
              <div className='tt-day' data-day='3'>
                T<span className='hidden-phone'>hu</span>
              </div>
              <div className='tt-day' data-day='4'>
                F<span className='hidden-phone'>ri</span>
              </div>
              <div className='tt-day' data-day='5'>
                Sa<span className='hidden-phone'>t</span>
              </div>
              <div className='tt-day' data-day='6'>
                Su<span className='hidden-phone'>n</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
 }
});


window.Generate = Generate;