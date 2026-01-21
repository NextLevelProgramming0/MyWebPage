import React, { Component } from 'react';
import { variables } from './Variables';

export class Education extends Component {
  constructor(props) {
    super(props);
    this.state = {
      educations: [],
      modalTitle: '',
      EducationId: 0,
      Degree: '',
      DegreeImage: '',
      DegreeImageFile: null,
      Institution: '',
      YearOfCompletion: '',

      EducationIdFilter: '',
      DegreeFilter: '',
      InstitutionFilter: '',
      YearFilter: '',
      EducationsWithoutFilter: []
    };
  }

  FilterFn(){
    var EducationIdFilter = this.state.EducationIdFilter;
    var DegreeFilter = this.state.DegreeFilter;
    var InstitutionFilter = this.state.InstitutionFilter;
    var YearFilter = this.state.YearFilter;

    var filteredData = this.state.EducationsWithoutFilter.filter(
      function(el){
        var id = el.id || el.EducationId || '';
        var degree = el.degree || el.Degree || '';
        var institution = el.institution || el.Institution || '';
        var year = el.yearOfCompletion || el.YearOfCompletion || '';

        return String(id).toLowerCase().includes(String(EducationIdFilter).toLowerCase()) &&
          String(degree).toLowerCase().includes(String(DegreeFilter).toLowerCase()) &&
          String(institution).toLowerCase().includes(String(InstitutionFilter).toLowerCase()) &&
          String(year).toLowerCase().includes(String(YearFilter).toLowerCase());
      }
    );
    this.setState({educations: filteredData});
  }
  sortResult(prop, asc){
    var sortedData = this.state.EducationsWithoutFilter.sort(function(a,b){
      var aProp = a[prop] || a[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';
      var bProp = b[prop] || b[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';

      if(asc){
        return aProp > bProp ? 1 : (aProp < bProp ? -1 : 0);
      }else{
        return bProp > aProp ? 1 : (bProp < aProp ? -1 : 0);
      }
    });

    this.setState({EducationsWithoutFilter:sortedData, educations:sortedData});
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    fetch(variables.API_URL + 'education')
      .then(res => res.json())
      .then(data => this.setState({ educations: data, EducationsWithoutFilter: data }));
  }

  changeDegree = (e) => { this.setState({ Degree: e.target.value }); };

  changeDegreeImage = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const preview = URL.createObjectURL(file);
      if (this.state.DegreeImage && this.state.DegreeImage.startsWith('blob:')) {
        URL.revokeObjectURL(this.state.DegreeImage);
      }
      this.setState({ DegreeImageFile: file, DegreeImage: preview });
    } else {
      this.setState({ DegreeImageFile: null, DegreeImage: '' });
    }
  };

  changeInstitution = (e) => { this.setState({ Institution: e.target.value }); };
  changeYearOfCompletion = (e) => { this.setState({ YearOfCompletion: e.target.value }); };

  changeEducationIdFilter = (e) => { this.setState({ EducationIdFilter: e.target.value }, () => this.FilterFn()); };
  changeDegreeFilter = (e) => { this.setState({ DegreeFilter: e.target.value }, () => this.FilterFn()); };
  changeInstitutionFilter = (e) => { this.setState({ InstitutionFilter: e.target.value }, () => this.FilterFn()); };
  changeYearFilter = (e) => { this.setState({ YearFilter: e.target.value }, () => this.FilterFn()); };

  addClick() {
    this.setState({ modalTitle: 'Add Education', EducationId: 0, Degree: '', DegreeImage: '', DegreeImageFile: null, Institution: '', YearOfCompletion: '' }, () => {
      const modalEl = document.getElementById('educationModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(ed) {
    this.setState({
      modalTitle: 'Edit Education',
      EducationId: ed.id || ed.EducationId,
      Degree: ed.degree || ed.Degree,
      DegreeImage: ed.degreeImage || ed.DegreeImage,
      DegreeImageFile: null,
      Institution: ed.institution || ed.Institution,
      YearOfCompletion: ed.yearOfCompletion || ed.YearOfCompletion
    }, () => {
      const modalEl = document.getElementById('educationModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    if (this.state.DegreeImageFile) {
      const fd = new FormData();
      fd.append('degree', this.state.Degree);
      fd.append('institution', this.state.Institution);
      fd.append('yearOfCompletion', this.state.YearOfCompletion);
      fd.append('degreeImage', this.state.DegreeImageFile);

      fetch(variables.API_URL + 'education', { method: 'POST', body: fd })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Create failed'); });
    } else {
      fetch(variables.API_URL + 'education', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ degree: this.state.Degree, institution: this.state.Institution, yearOfCompletion: this.state.YearOfCompletion }) })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Create failed'); });
    }
  }

  updateClick() {
    if (this.state.DegreeImageFile) {
      const fd = new FormData();
      fd.append('id', this.state.EducationId);
      fd.append('degree', this.state.Degree);
      fd.append('institution', this.state.Institution);
      fd.append('yearOfCompletion', this.state.YearOfCompletion);
      fd.append('degreeImage', this.state.DegreeImageFile);

      fetch(variables.API_URL + 'education', { method: 'PUT', body: fd })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Update failed'); });
    } else {
      fetch(variables.API_URL + 'education', { method: 'PUT', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ id: this.state.EducationId, degree: this.state.Degree, institution: this.state.Institution, yearOfCompletion: this.state.YearOfCompletion }) })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Update failed'); });
    }
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      fetch(variables.API_URL + 'education?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  render() {
    const { educations, modalTitle, EducationId, Degree, DegreeImage, Institution, YearOfCompletion } = this.state;

    return (
      <div className="Education">
        <h2>My Education</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Education</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className = "d-flex flex-row">
                  <input className="form-control m-2" onChange={(e) => { this.setState({ EducationIdFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by ID" />
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
                Degree
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ DegreeFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Degree" />
                Institution
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ InstitutionFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Institution" />
                Year
              </th>
              <th>
                <input className="form-control m-2" onChange={(e) => { this.setState({ YearFilter: e.target.value }, () => this.FilterFn()); }} placeholder="Filter by Year" />
                Options
              </th>
            </tr>
          </thead>

          <tbody>
            {educations.map(ed => (
              <tr key={ed.id || ed.EducationId}>
                <td>{ed.degree || ed.Degree}</td>
                <td>{ed.institution || ed.Institution}</td>
                <td>{ed.yearOfCompletion || ed.YearOfCompletion}</td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(ed)} aria-label="Edit Education">
                    Edit Education
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(ed.id || ed.EducationId)} aria-label="Delete Education">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="educationModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Degree</span>
                  <input type="text" className="form-control" value={Degree} onChange={this.changeDegree} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Image (file)</span>
                  <input type="file" className="form-control" onChange={this.changeDegreeImage} />
                </div>

                {DegreeImage ? (
                  <div className="mb-3">
                    <img src={DegreeImage} alt="Degree" style={{ maxWidth: '150px' }} />
                  </div>
                ) : null}

                <div className="input-group mb-3">
                  <span className="input-group-text">Institution</span>
                  <input type="text" className="form-control" value={Institution} onChange={this.changeInstitution} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Year</span>
                  <input type="text" className="form-control" value={YearOfCompletion} onChange={this.changeYearOfCompletion} />
                </div>

                {EducationId === 0 ? (
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