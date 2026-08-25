import React,{ Component } from 'react';
import { variables } from './Variables';

export class Skills extends Component {

    constructor(props){
        super(props);

        this.state={
            skills:[],
            modalTitle:"",
            SkillId:0,
            SkillName:"",
            SkillLearned:""
        } 
    }

    refreshList(){
        fetch(variables.API_URL+'skills/')
        .then(response=>response.json())
        .then(data=>{
            this.setState({skills:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    changeSkillName = (e)=>{
        this.setState({SkillName:e.target.value});
    };

    changeSkillLearned = (e)=>{
        this.setState({SkillLearned:e.target.value});
    };

    addClick(){
        this.setState({
            modalTitle:"Add Skill",
            SkillId:0,
            SkillName:"",
            SkillLearned:""
        }, ()=>{
          const modalEl = document.getElementById('exampleModal');
          if(window.bootstrap){
            const modal = new window.bootstrap.Modal(modalEl);
            modal.show();
          }
        });
    }

   editClick(skill){
      this.setState({
          modalTitle:"Edit Skill",
          SkillId:skill.SkillId,
          SkillName:skill.SkillName,
          SkillLearned:skill.SkillLearned
        }, ()=>{
          const modalEl = document.getElementById('exampleModal');
          if(window.bootstrap){
            const modal = new window.bootstrap.Modal(modalEl);
            modal.show();
          }
        });
    }

    createClick(){
      fetch(variables.API_URL + 'skills/', {
        method:'POST',
        headers:{'Accept':'application/json','Content-Type':'application/json'},
        body:JSON.stringify({SkillName:this.state.SkillName, SkillLearned:this.state.SkillLearned})
      })
      .then(res=>res.json())
      .then((result)=>{
        this.refreshList();
        const modalEl = document.getElementById('exampleModal');
        if(window.bootstrap){
          const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      }, (error)=>{console.error(error); alert('Create failed');});
    }

    updateClick(){
      fetch(variables.API_URL + 'skills/', {
        method:'PUT',
        headers:{'Accept':'application/json','Content-Type':'application/json'},
        body:JSON.stringify({SkillId:this.state.SkillId, SkillName:this.state.SkillName, SkillLearned:this.state.SkillLearned})
      })
      .then(res=>res.json())
      .then((result)=>{
        this.refreshList();
        const modalEl = document.getElementById('exampleModal');
        if(window.bootstrap){
          const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      }, (error)=>{console.error(error); alert('Update failed');});
    }

    deleteClick(id){
      if(window.confirm('Are you sure?')){
        fetch(variables.API_URL + 'skills/?id=' + id, {
          method:'DELETE',
          headers:{'Accept':'application/json','Content-Type':'application/json'},
        })
        .then(res=>res.json())
        .then((result)=>{
          this.refreshList();
          const modalEl = document.getElementById('exampleModal');
          if(window.bootstrap){
            const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
            modal.hide();
          }
        }, (error)=>{console.error(error); alert('Delete failed');});
      }
    }

    render() {
      const { skills, modalTitle, SkillId, SkillName, SkillLearned } = this.state;

      return (
      <div className="Skills">
        <h2>My Skills</h2>
        <button type = "button"
        className = "btn btn-primary m-2 float-end"
        onClick={()=>this.addClick()}>
            Add Skill
        </button>
        <table className = "table table-striped">
        <thead>
        <tr>
            <th>
              Skill Name
            </th>
            <th>
              Where the Skill was Learned
            </th>
            <th>
              Options
            </th>
        </tr>
        </thead>
        <tbody>
        {skills.map(skill=>
            <tr key={skill.SkillId}>
                <td>{skill.SkillName}</td>
                <td>{skill.SkillLearned}</td>
                <td>
                  <button type="button"
                    className="btn btn-light mr-1"
                    onClick={()=>this.editClick(skill)}
                    aria-label="Edit Skill">
                      Edit Skill
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                      </svg>
                  </button>

                <button type="button"
                className = "btn btn-light mr-1"
                onClick={()=>this.deleteClick(skill.SkillId)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                      </svg>
                </button>
                </td>
            </tr>
        )}
        </tbody>
        </table>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-lg modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{modalTitle}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
        </button>
      
      </div>

      <div className="modal-body">
        <div className="input-group mb-3">
          <span className="input-group-text">Skill Name</span>
          <input type="text" className="form-control"
            value={SkillName}
            onChange={this.changeSkillName}/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">Where Learned</span>
          <input type="text" className="form-control"
            value={SkillLearned}
            onChange={this.changeSkillLearned}/>
        </div>

        {SkillId===0 ?
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.createClick()}>
        Create</button>
        :
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.updateClick()}>
        Update</button>
        }

      </div>
    </div>
</div>
</div>
</div>
    );
  }
}
