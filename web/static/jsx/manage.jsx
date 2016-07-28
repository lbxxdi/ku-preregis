var Manage = React.createClass({

  getInitialState: function() {
    return {
      subjectList: [
      ],
    };
  },

  getSubjectList: function() {
   return this.state.subjectList;
  },

  setSubjectList: function(subjectList) {
    this.setState({
      subjectList
    });
  },
  
  removeSubject: function(subject) {

   let index = this.findIndexSubjectInList(subject);
   let subjectList = this.state.subjectList;

   if (index >= 0) {
     subjectList.splice(index, 1);
     this.setState({subjectList})
   }
  },
  
  findIndexSubjectInList: function(S) {
   let subjectList = this.state.subjectList;
   for(let index=0;index<subjectList.length;index++) {
     let s = subjectList[index];
     if (s.code == S.code && s.lec  == S.lec && s.lab  == S.lab ) {
       return index;
     }
   }
   return -1;
  },

  addSubject: function(subject) {
   let subjectList = this.state.subjectList;
   let cloneSubject = $.extend(true, {}, subject);
   let findSubject = this.findIndexSubjectInList(cloneSubject);

   if(findSubject<0 && subject.code && subject.name) {
     subjectList.push(cloneSubject);
   }

   this.setState({subjectList})
  },

   render: function() {
     return (
      <section className='manage'>

        <div className='table-wrapper'>
          <div className='js-table' data-table='regis'>
            <div className="row highlight">
              <div className="col-2">Subject ID</div>
              <div className="col-4">Subject</div>
              <div className="col-2">Lecture Section</div>
              <div className="col-2">Laboratory Section</div>
              <div className="col-2">Edit</div>
            </div>
              { this.state.subjectList.map((subject) => {
                return (<div className="row" key={subject.code + subject.lec + subject.lab}>
                    <div className="col-2">{subject.code}</div>
                    <div className="col-4">{subject.name}</div>
                    <div className="col-2">{subject.lec}</div>
                    <div className="col-2">{subject.lab}</div>
                    <div className="col-2 action remove" onClick={this.removeSubject.bind(null,subject)} >Remove</div>
                  </div>);
              })}
            </div>  
          </div>

          <SelectSubject addSubject={this.addSubject}/>

      </section>
     );
   }
});

window.Manage = Manage;
