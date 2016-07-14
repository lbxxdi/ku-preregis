// var 

var Generate = React.createClass({
  getInitialState: function() {
   return {
      subjectList : [],
      ttEvents : [], 
      eventId : 0,
   };
 },

 componentDidMount: function() {
    this.reload();

    $(".submit").click();
 },

 componentDidUpdate: function() {
    console.log("ajaxCount",ajaxCount);
    this.reload();  
    if(ajaxCount==0){

    }
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

 createEvent: function(event) {
    console.log(event);


    // this.setState({
    //   ttEvents : this.state.ttEvents.concat([event]),
    // });
 },

 getSectionDetail: function(subject,type) {

    $.get(`/section/${subject.code}/${subject[type]}/${type}`,(result) => {
      result.name = subject.name;
      result.eventId = subject.eventId;

      result.period.forEach( (period) => {
        
        let event = $.extend(true, {}, result);

        delete event.period;

        for(let field in period) {
          event[field] = period[field];
        }

        this.createEvent(event);
      })



    })
 
 },

 submit: function() {
    let subjectList = this.getSubjectList();

    console.log(subjectList);

    this.setState({
      eventId : 0,
      minStart : Infinity,
      maxEnd : 0,

    });

    subjectList.forEach((subject) => {

      subject.eventId = this.state.eventId;
      if(subject.lec!=='-') this.getSectionDetail(subject,"lec");
      if(subject.lab!=='-') this.getSectionDetail(subject,"lab");

      this.setState({eventId:this.state.eventId + 1});
    })
    //todo

 },

 reload: function () {

    console.log("reload");
   $('.timetable').each(function (e) {
     $(this).initialiseTT();
     $(this).resizeTimetable();
   });
 },

 render: function() {

    let minStart = Infinity;
    let maxEnd = 0;

    this.state.ttEvents.forEach((event) => {

      let start = Math.floor(event.start);
      let end = Math.ceil(event.end);

      if(start < minStart) minStart = start;
      if(end > maxEnd)     maxEnd = end;
      
    });

   console.log("minStart",minStart); 


   return (
      <section className='generate'>
        <div className='submit' onClick={this.submit}><span className='text'>Go!</span></div>
        <div className='submit' onClick={this.reload}><span className='text'>Test</span></div>
        <div className='timetable-wrapper'>
          <div className='timetable' data-days='7' data-hours='12'>
            <ul className='tt-events'>
              { this.state.ttEvents.map((event) => {
                
                console.log(minStart,event.start,event.start-minStart);

                return (<li className="tt-event" key ={""+ event.eventId + event.day + event.start}
                          data-id={event.eventId} data-day={event.day} data-start={event.start-minStart} data-duration={event.end - event.start} 
                          rel="tooltip" unselectable="on" >
                          {event.name}<br/>{event.code} Sec {event.sec}<br/>{event.room}&nbsp; {event.teacher}&nbsp;</li>);
              })}
            </ul>
            <div className='tt-times'>
              <div className='tt-time' data-time='0'>
                08<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='1'>
                09<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='2'>
                10<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='3'>
                11<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='4'>
                12<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='5'>
                13<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='6'>
                14<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='7'>
                15<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='8'>
                16<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='9'>
                17<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='10'>
                18<span className='hidden-phone'>:00</span>
              </div>
              <div className='tt-time' data-time='11'>
                19<span className='hidden-phone'>:00</span>
              </div>
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