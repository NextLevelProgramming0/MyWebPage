import React, { Component } from 'react';
import { variables } from './Variables';

export class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: [],
      modalTitle: '',
      ExperienceId: 0,
      JobTitle: '',
      CompanyName: '',
      Duration: '',
      Description: '',

      ExperienceIdFilter: '',
      JobTitleFilter: '',
      CompanyNameFilter: '',
      DurationFilter: '',
      DescriptionFilter: '',
      ExperiencesWithoutFilter: []
    };
  }

  FilterFn(){
    var ExperienceIdFilter = this.state.ExperienceIdFilter;
    var JobTitleFilter = this.state.JobTitleFilter;
    var CompanyNameFilter = this.state.CompanyNameFilter;
    var DurationFilter = this.state.DurationFilter;
    var DescriptionFilter = this.state.DescriptionFilter;

    var filteredData = this.state.ExperiencesWithoutFilter.filter(
      function(el){
        var id = el.id || el.ExperienceId || '';
        var job = el.jobTitle || el.JobTitle || '';
        var company = el.companyName || el.CompanyName || '';
        var duration = el.duration || el.Duration || '';
        var desc = el.description || el.Description || '';

        return String(id).toLowerCase().includes(String(ExperienceIdFilter).toLowerCase()) &&
          String(job).toLowerCase().includes(String(JobTitleFilter).toLowerCase()) &&
          String(company).toLowerCase().includes(String(CompanyNameFilter).toLowerCase()) &&
          String(duration).toLowerCase().includes(String(DurationFilter).toLowerCase()) &&
          String(desc).toLowerCase().includes(String(DescriptionFilter).toLowerCase());
      }
    );
    this.setState({experiences: filteredData});
  }

  sortResult(prop, asc){
    var sortedData = this.state.ExperiencesWithoutFilter.sort(function(a,b){
      var aProp = a[prop] || a[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';
      var bProp = b[prop] || b[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';

      if(asc){
        return aProp > bProp ? 1 : (aProp < bProp ? -1 : 0);
      }else{
        return bProp > aProp ? 1 : (bProp < aProp ? -1 : 0);
      }
    });

    this.setState({ExperiencesWithoutFilter:sortedData, experiences:sortedData});
  }

  componentDidMount() {
    this.refreshList();
  }

  // common handler used by all fetch requests in this class
  handleApiResponse = (res) => {
      if (!res.ok) {
          return res.json().catch(() => { throw new Error(`HTTP ${res.status}`); }).then(err => { throw err; });
      }
      return res.json();
  };

  refreshList() {
    fetch(variables.API_URL + 'experience')
      .then(this.handleApiResponse)
      .then(data => this.setState({ experiences: data, ExperiencesWithoutFilter: data }));
  }

  changeJobTitle = (e) => { this.setState({ JobTitle: e.target.value }); };
  changeCompanyName = (e) => { this.setState({ CompanyName: e.target.value }); };
  changeDuration = (e) => { this.setState({ Duration: e.target.value }); };
  changeDescription = (e) => { this.setState({ Description: e.target.value }); };

  changeExperienceIdFilter = (e) => { this.setState({ ExperienceIdFilter: e.target.value }, () => this.FilterFn()); };
  changeJobTitleFilter = (e) => { this.setState({ JobTitleFilter: e.target.value }, () => this.FilterFn()); };
  changeCompanyNameFilter = (e) => { this.setState({ CompanyNameFilter: e.target.value }, () => this.FilterFn()); };
  changeDurationFilter = (e) => { this.setState({ DurationFilter: e.target.value }, () => this.FilterFn()); };
  changeDescriptionFilter = (e) => { this.setState({ DescriptionFilter: e.target.value }, () => this.FilterFn()); };

  addClick() {
    this.setState({ modalTitle: 'Add Experience', ExperienceId: 0, JobTitle: '', CompanyName: '', Duration: '', Description: '' }, () => {
      const modalEl = document.getElementById('experienceModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(exp) {
    this.setState({
      modalTitle: 'Edit Experience',
      ExperienceId: exp.id || exp.ExperienceId,
      JobTitle: exp.jobTitle || exp.JobTitle,
      CompanyName: exp.companyName || exp.CompanyName,
      Duration: exp.duration || exp.Duration,
      Description: exp.description || exp.Description
    }, () => {
      const modalEl = document.getElementById('experienceModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    fetch(variables.API_URL + 'experience', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle: this.state.JobTitle, companyName: this.state.CompanyName, duration: this.state.Duration, description: this.state.Description })
    })
      .then(this.handleApiResponse)
      .then((result) => {
        this.refreshList();
        const modalEl = document.getElementById('experienceModal');
        if (window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      })
      .catch((error) => {
        console.error('Create experience failed', error);
        const msg = error.errors ? JSON.stringify(error.errors) : error.message || error;
        alert('Create failed: ' + msg);
      });
  }

  updateClick() {
    fetch(variables.API_URL + 'experience', {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.state.ExperienceId, jobTitle: this.state.JobTitle, companyName: this.state.CompanyName, duration: this.state.Duration, description: this.state.Description })
    })
      .then(this.handleApiResponse)
      .then((result) => {
        this.refreshList();
        const modalEl = document.getElementById('experienceModal');
        if (window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      })
      .catch((error) => {
        console.error('Update experience failed', error);
        const msg = error.errors ? JSON.stringify(error.errors) : error.message || error;
        alert('Update failed: ' + msg);
      });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      fetch(variables.API_URL + 'experience?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  render() {
    const { experiences, modalTitle, ExperienceId, JobTitle, CompanyName, Duration, Description } = this.state;

    return (
      <div className="Experience">
        <h2>My Experience</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Experience</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className = "d-flex flex-row">
                  <input className="form-control m-2" onChange={(e) => { this.setState({ ExperienceIdFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by ID" />
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
                Job Title
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ JobTitleFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Job Title" />
                Company
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ CompanyNameFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Company" />
                Duration
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ DurationFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Duration" />
                Options
              </th>
            </tr>
          </thead>

          <tbody>
            {experiences.map(exp => (
              <tr key={exp.id || exp.ExperienceId}>
                <td>{exp.jobTitle || exp.JobTitle}</td>
                <td>{exp.companyName || exp.CompanyName}</td>
                <td>{exp.duration || exp.Duration}</td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(exp)} aria-label="Edit Experience">
                    Edit Experience
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(exp.id || exp.ExperienceId)} aria-label="Delete Experience">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="experienceModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Job Title</span>
                  <input type="text" className="form-control" value={JobTitle} onChange={this.changeJobTitle} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Company</span>
                  <input type="text" className="form-control" value={CompanyName} onChange={this.changeCompanyName} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Duration</span>
                  <input type="text" className="form-control" value={Duration} onChange={this.changeDuration} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Description</span>
                  <input type="text" className="form-control" value={Description} onChange={this.changeDescription} />
                </div>

                {ExperienceId === 0 ? (
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