import React, { Component } from 'react';
import { variables } from './Variables';

export class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      modalTitle: '',
      ProjectId: 0,
      ProjectName: '',
      ProjectDescription: '',
      ProjectLink: '',

      ProjectIdFilter: '',
      ProjectNameFilter: '',
      ProjectDescriptionFilter: '',
      ProjectLinkFilter: '',
      ProjectsWithoutFilter: []
    };
  }

  FilterFn(){
    var ProjectIdFilter = this.state.ProjectIdFilter;
    var ProjectNameFilter = this.state.ProjectNameFilter;
    var ProjectDescriptionFilter = this.state.ProjectDescriptionFilter;
    var ProjectLinkFilter = this.state.ProjectLinkFilter;

    var filteredData = this.state.ProjectsWithoutFilter.filter(
      function(el){
        var id = el.id || el.ProjectId || '';
        var name = el.projectName || el.ProjectName || '';
        var desc = el.projectDescription || el.ProjectDescription || '';
        var link = el.projectLink || el.ProjectLink || '';

        return String(id).toLowerCase().includes(String(ProjectIdFilter).toLowerCase()) &&
          String(name).toLowerCase().includes(String(ProjectNameFilter).toLowerCase()) &&
          String(desc).toLowerCase().includes(String(ProjectDescriptionFilter).toLowerCase()) &&
          String(link).toLowerCase().includes(String(ProjectLinkFilter).toLowerCase());
      }
    );
    this.setState({projects: filteredData});
  }

  sortResult(prop, asc){
    var sortedData = this.state.ProjectsWithoutFilter.sort(function(a,b){
      var aProp = a[prop] || a[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';
      var bProp = b[prop] || b[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';

      if(asc){
        return aProp > bProp ? 1 : (aProp < bProp ? -1 : 0);
      }else{
        return bProp > aProp ? 1 : (bProp < aProp ? -1 : 0);
      }
    });

    this.setState({ProjectsWithoutFilter:sortedData, projects:sortedData});
  }

  componentDidMount() {
    this.refreshList();
  }

  // parse JSON and surface any non‑OK HTTP status as a rejected promise
  handleApiResponse = (res) => {
      if (!res.ok) {
          return res.json().catch(() => { throw new Error(`HTTP ${res.status}`); }).then(err => { throw err; });
      }
      return res.json();
  };

  refreshList() {
    fetch(variables.API_URL + 'projects')
      .then(this.handleApiResponse)
      .then(data => { this.setState({ projects: data, ProjectsWithoutFilter: data }); });
  }

  changeProjectName = (e) => { this.setState({ ProjectName: e.target.value }); };
  changeProjectDescription = (e) => { this.setState({ ProjectDescription: e.target.value }); };
  changeProjectLink = (e) => { this.setState({ ProjectLink: e.target.value }); };

  changeProjectIdFilter = (e) => { this.setState({ ProjectIdFilter: e.target.value }, () => this.FilterFn()); };
  changeProjectNameFilter = (e) => { this.setState({ ProjectNameFilter: e.target.value }, () => this.FilterFn()); };
  changeProjectDescriptionFilter = (e) => { this.setState({ ProjectDescriptionFilter: e.target.value }, () => this.FilterFn()); };
  changeProjectLinkFilter = (e) => { this.setState({ ProjectLinkFilter: e.target.value }, () => this.FilterFn()); };

  addClick() {
    this.setState({ modalTitle: 'Add Project', ProjectId: 0, ProjectName: '', ProjectDescription: '', ProjectLink: '' }, () => {
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(project) {
    this.setState({
      modalTitle: 'Edit Project',
      ProjectId: project.id || project.ProjectId,
      ProjectName: project.projectName || project.ProjectName,
      ProjectDescription: project.projectDescription || project.ProjectDescription,
      ProjectLink: project.projectLink || project.ProjectLink
    }, () => {
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    fetch(variables.API_URL + 'projects', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName: this.state.ProjectName, projectDescription: this.state.ProjectDescription, projectLink: this.state.ProjectLink })
    })
    .then(this.handleApiResponse)
    .then((result) => {
      this.refreshList();
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modal.hide();
      }
    })
    .catch((error) => {
      console.error('Create project failed', error);
      const msg = error.errors ? JSON.stringify(error.errors) : error.message || error;
      alert('Create failed: ' + msg);
    });
  }

  updateClick() {
    fetch(variables.API_URL + 'projects', {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.state.ProjectId, projectName: this.state.ProjectName, projectDescription: this.state.ProjectDescription, projectLink: this.state.ProjectLink })
    })
    .then(this.handleApiResponse)
    .then((result) => {
      this.refreshList();
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modal.hide();
      }
    })
    .catch((error) => {
      console.error('Update project failed', error);
      const msg = error.errors ? JSON.stringify(error.errors) : error.message || error;
      alert('Update failed: ' + msg);
    });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      fetch(variables.API_URL + 'projects?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  render() {
    const { projects, modalTitle, ProjectId, ProjectName, ProjectDescription, ProjectLink } = this.state;

    return (
      <div className="Projects">
        <h2>My Projects</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Project</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className = "d-flex flex-row">
                  <input className="form-control m-2" onChange={(e) => { this.setState({ ProjectIdFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by ID" />
                  <button type = "button" className = "btn btn-light" onClick={()=>this.sortResult('id',true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>

                  <button type = "button" className = "btn btn-light" onClick={()=>this.sortResult('id',false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0"/>
                    </svg>
                  </button>

                </div>
                Project Name
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ ProjectNameFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Name" />
                Description
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ ProjectDescriptionFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Description" />
                Link
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ ProjectLinkFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Link" />
                Options
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map(proj => (
              <tr key={proj.id || proj.ProjectId}>
                <td>{proj.projectName || proj.ProjectName}</td>
                <td>{proj.projectDescription || proj.ProjectDescription}</td>
                <td><a href={proj.projectLink || proj.ProjectLink} target="_blank" rel="noreferrer">{proj.projectLink || proj.ProjectLink}</a></td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(proj)} aria-label="Edit Project">
                    Edit Project
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(proj.id || proj.ProjectId)} aria-label="Delete Project">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="projectModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Project Name</span>
                  <input type="text" className="form-control" value={ProjectName} onChange={this.changeProjectName} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Description</span>
                  <input type="text" className="form-control" value={ProjectDescription} onChange={this.changeProjectDescription} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Link</span>
                  <input type="text" className="form-control" value={ProjectLink} onChange={this.changeProjectLink} />
                </div>

                {ProjectId === 0 ? (
                  <button type="button" className="btn btn-primary float-start" onClick={() => this.createClick()}>Create</button>
                ) : (
                  <button type="button" className="btn btn-primary float-start" onClick={() => this.updateClick()}>Update</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
} 