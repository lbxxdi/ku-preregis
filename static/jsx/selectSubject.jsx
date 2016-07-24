var SelectSubject = React.createClass({
 getInitialState: function() {
    return {
      subjects: [],
      searchString: "",
      filteredSubjects: [],
      currentSubject: {},
      sectionList: {
       "LAB" : [],
       "LEC" : [],
      },
    };
  },

  search: function(searchString){
     searchString = searchString.trim()
     let splitSearchStrings = searchString.split(/\W+/);

     let filteredItem = this.state.subjects;
     splitSearchStrings.forEach(function(searchString){
       let re = new RegExp(searchString,"i");

       filteredItem = filteredItem.filter(function(subject){
         let text = subject.name+" "+subject.code;
         return text.match(re);
       });
     })

     let limitItem = 10;
     if (filteredItem.length >limitItem){
       filteredItem = filteredItem.slice(0,limitItem);
     }

     return filteredItem;
  },

  handleChangeSec: function(e){
     let subject = this.state.currentSubject;

     subject['lec'] = $('#lec-section').val()
     subject['lab'] = $('#lab-section').val()

     this.setState({ 
       currentSubject: subject,
     });
  },

  handleChangeSearch: function(e){

   this.setState({
     searchString: e.target.value,
   })
   if(e.target.value.length>=3)
     this.setState({ 
       filteredSubjects: this.search(e.target.value),
     });
  },

  componentDidMount: function() {
    
    this.serverRequest = $.get("/subjects", function (result) {
      this.setState({  
        subjects: result,//.slice(0,10)
      },loadingComplete);
    }.bind(this));

    $("#search-result").slideUp('fast');
  },

  componentWillUnmount: function() {
   this.serverRequest.abort();
  },

  selectSubject: function(subject){
   this.setState({ 
     searchString: subject.code + " " + subject.name,
     currentSubject: subject,
   },function(){

     $('#lec-section').val("-");
     $('#lab-section').val("-");
     this.handleChangeSec();
   
   });

   loadingStart();
   this.serverRequest = $.get(`/subject/${subject.code}`, function (result) {
     this.setState({  
       sectionList: result.section,//.slice(0,10)
     },function() {
      loadingComplete();
      $("#lec-section").focus();
    });
   }.bind(this));


  },

  onFocus: function(){
   $("#search-result").slideDown('fast');
  },

  onBlur: function(){
    setTimeout(function(){
     $("#search-result").slideUp('fast');
    },200);
  },

  onKeyPress: function(e){

   if (e.key === 'Enter') {
     let filteredItem = this.state.filteredSubjects;
     if(filteredItem.length>0) {
       this.selectSubject(filteredItem[0]);
     }
   }
  },

  sendSubject: function() {

    this.props.addSubject(this.state.currentSubject);

    this.setState({
      searchString: "",
      sectionList: {
       "LAB" : [],
       "LEC" : [],
      },
    });

  },

 render: function() {
   return (
      <span>
        <div className='form'>
          <span className='title'>Subject : </span>
          <div className="js-search">
            <input type="text" className="input" value={this.state.searchString} onChange={this.handleChangeSearch}
            onFocus={this.onFocus} onBlur={this.onBlur} onKeyPress={this.onKeyPress} placeholder="Search your Subject or Subject ID"/>
            <ul className="result" id="search-result">
              {this.state.filteredSubjects.map((subject) => {
                  return <li className="list" key={subject.code} onClick={this.selectSubject.bind(null,subject)}>{subject.code + " " + subject.name}</li>;
              }) } 
            </ul>
          </div>
        </div>
        <div className='form'>
         <span className='title'>Lecture Section : </span>
           <select id="lec-section" defaultValue="-" onChange={this.handleChangeSec} >
            <option>-</option>
             { this.state.sectionList.LEC.map((sec) => {
                  return <option value={sec} key={sec}>{sec}</option>;
              })} 
           </select>
         <span className='title'>Laboratory Section : </span>
           <select id="lab-section" defaultValue="-" onChange={this.handleChangeSec} >
            <option value="-">-</option>
             { this.state.sectionList.LAB.map((sec) => {
                  return <option value={sec} key={sec}>{sec}</option>;
              })} 
           </select>
         <div className='action add' onClick={this.sendSubject}> Add</div>
        </div>
      </span>
    );
 }
});

window.SelectSubject = SelectSubject;