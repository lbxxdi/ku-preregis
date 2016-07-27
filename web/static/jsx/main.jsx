var Main = React.createClass({
  getInitialState: function() {
   return {
   };
 },

 componentDidMount: function() {
  loadingStart();

  let params = this.getGetParam()

  if (params.token) {
    this.loadTable(params.token);
  }

 },

 getGetParam : function() {
    let GET = {}; 
    location.search.substr(1).split("&").forEach(function(item) {item = item.split("=");GET[item[0]] = item[1]})
    return GET
 },

 getSubjectList : function() {
    return this.refs.manage.getSubjectList();
 },

 loadTable : function(token) {

    console.log("loadTable")

    $.get(`/api/load/${token}`,(result) => {
      //console.log(result);
      this.refs.manage.setSubjectList(result.subject_list);
      this.refs.generate.submit(false);

    }).fail(() => {
      document.location.href = '/'
    });


 },
 saveTable : function() {

    console.log("saveTable");

    let subjectList = this.getSubjectList();

    if (subjectList.length==0) {
      return;
    }

    let params = this.getGetParam();

    let postData = {
      subject_list: subjectList,
    };

    if (params.token) {
      postData.token = params.token;
    }

    $.ajax({
      url:`/api/save`,
      type:"POST",
      data:JSON.stringify(postData),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(result){
        window.history.pushState('KU-PreRegis', 'KU-PreRegis', '?token='+result.token);
      }
    })

 },

 render: function() {
   return (
      <span>
        <div className='main-loading'></div>

        <section className='jumbo'>
          <h1>KU-PreRegis</h1>
        </section>


        <article className='paragraph'>
          <header>Step 1 : Manage your subject, add or remove as you want.</header>
          <Manage ref="manage"/>
        </article>

        <article className='paragraph'>
          <header>Step 2 : Generate your table, just click Go!.</header>
          <Generate ref="generate" getSubjectList={this.getSubjectList} saveTable={this.saveTable}/>
        </article>

        <div className='footer'>
          <a className='link' href='https://www.facebook.com/universez' target='blank'>Contact Us</a>
        </div>
      </span>
    );
 }
});

ReactDOM.render(
  <Main/>,
  document.getElementById('main')
);