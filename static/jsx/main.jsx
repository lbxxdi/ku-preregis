var Main = React.createClass({
  getInitialState: function() {
   return {
   };
 },

 componentDidMount: function() {
  loadingStart();
 },

 getSubjectList : function() {
    return this.refs.manage.getSubjectList();
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
          <Generate getSubjectList={this.getSubjectList}/>
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