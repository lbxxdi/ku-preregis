var Generate = React.createClass({
  getInitialState: function() {
   return {
      subjectList : [],
      ttEvents : [],
      ttHours : 8,
      minStart : 8,
   };
},

 componentDidMount: function() {
    $('.timetable-wrapper').hide();
    $('.timetable').resize(function (e) {
        $(this).resizeTimetable();
    });

    this.render();

    // TEST only
    //$(".submit").click();
    //$('html, body').animate({ scrollTop: $('.timetable-wrapper').offset().top }, 1000);
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

  let event;
    $.get(`/section/${subject.code}/${subject[type]}/${type}`,(result) => {


      result.name = subject.name;
      result.eventId = subject.eventId;

      event = result.period.map( (period) => {
        
        let tempEvent = $.extend(true, {}, result);

        delete tempEvent.period;

        for(let field in period) {
          tempEvent[field] = period[field];
        }

        return tempEvent
      })
    })

  return event;
 
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

 submit: function() {
    let subjectList = this.getSubjectList();

    // this.reload();

    let minStart = Infinity;
    let maxEnd = 0;

    let eventId = 0;

    let ttEvents = [];

    subjectList.sort(function(a, b) {return a.start-b.start;});
    
    subjectList.forEach((subject) => {

      subject.eventId = eventId;

      if(subject.lec!=='-') ttEvents=ttEvents.concat(this.getEvent(subject,"lec"));
      if(subject.lab!=='-') ttEvents=ttEvents.concat(this.getEvent(subject,"lab"));

      eventId+=1;
    })

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
    },function(){
      this.setHours();
      this.reload();
      $('.timetable-wrapper').slideDown();
    });
    
 },

 reload: function () {

  console.log("reload");


   $('.timetable').each(function (e) {
     $(this).initialiseTT();
     $(this).resizeTimetable();
   });

 },

 render: function() {

   return (
      <section className='generate'>
        <div className='submit' onClick={this.submit}><span className='text'>Go!</span></div>
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