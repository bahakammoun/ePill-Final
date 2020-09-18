import axios from "axios";
import React from "react";

import {Link} from "react-router-dom";
import {translate} from "react-i18next";
import { toast } from 'react-toastify';
import {Checkbox} from 'primereact/checkbox';
import { Button } from 'primereact/button';
import {Steps} from 'primereact/steps';
import {Message} from 'primereact/message';
import {Card} from 'primereact/card';
import {InputMask} from 'primereact/inputmask';
import {Panel} from 'primereact/panel';
import 'primeflex/primeflex.css';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from "primereact/inputnumber";
import {RadioButton} from "primereact/radiobutton";
import Moment from "moment";
import { AutoComplete } from 'primereact/autocomplete';


// See https://facebook.github.io/react/docs/forms.html for documentation about forms.
class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dateOfBirth	: null ,
			firstname	: '',
			lastname		: '',
			username		: '',
			gender		: {id : 0},
			redGreenColorblind    : false,
			password		: '',
			passwordRepeat: '',


			size	: 0,
			weight : 0.0,
			allergyCheck : false,
			allergies: [],
			allAllergies: [],
			chronicDiseasesCheck  : false,
			chronicDiseases: [],

			drugFeaturesCheck : false,
			drugFeatures: [],

			pharmaceuticalFormsCheck : false,
			pharmaceuticalForms: [],
			sending		: false ,
			current: 0,
			checked: false
		};
		this.handleBirthdayChange	= this.handleBirthdayChange.bind(this);
		this.handleFirstnameChange	= this.handleFirstnameChange.bind(this);
		this.handleLastnameChange	= this.handleLastnameChange.bind(this);
		this.handleGenderChange		= this.handleGenderChange.bind(this);
		this.handleRedGreenColorblind = this.handleRedGreenColorblind.bind(this);

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);

		this.handleSizeChange	= this.handleSizeChange.bind(this);
		this.handleWeightChange	= this.handleWeightChange.bind(this);
		this.handleAllergyChange	= this.handleAllergyChange.bind(this);
		this.handleChronicDiseasesChange	= this.handleChronicDiseasesChange.bind(this);
		this.handleDrugFeatureChange =this.handleDrugFeatureChange.bind(this);
		this.handlePharmaceuticalFormChange =this.handlePharmaceuticalFormChange.bind(this);


		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		axios.get("/pharmaceuticalForm/all")
			.then(({data, status})  => {
				console.log(data);
				this.state.pharmaceuticalForms = data.value.map(item => {item.isChecked = false; return item;});

			});
		axios.get("/drugFeature/all")
			.then(({data, status})  => {
				console.log(data);
				this.state.drugFeatures = data.value.map(item => {item.isChecked = false; return item;});
			});
		axios.get("/activeSubstance/all")
			.then(({data, status})  => {
				console.log(data);
				this.state.allAllergies = data.value;
			});
		axios.get("/disease_group/all")
			.then(({data, status}) => {
				console.log(data);
				this.state.chronicDiseases = data.value.map(item => {item.isChecked = false; return item;});
			})
	}

	suggestAllergies(event) {
		let results = this.state.allAllergies.filter((allergy) => {
			return allergy.name.toLowerCase().startsWith(event.query.toLowerCase());
		});

		this.setState({ allergySuggestions: results });
	}


	handlePharmaceuticalFormChange(event) {
		let pharmaceuticalForms= this.state.pharmaceuticalForms;
		pharmaceuticalForms.forEach(pharmaceuticalForm => {
			if ((pharmaceuticalForm.name === event.target.value)) {
				pharmaceuticalForm.isChecked = event.target.checked;
			}
		});
		this.setState({pharmaceuticalForms : pharmaceuticalForms});
	}
	onChange = current => {
		// console.log('onChange:', current);
		this.setState({ current });
	};

	handleDrugFeatureChange(event) {
		let DrugFeatures= this.state.drugFeatures;
		DrugFeatures.forEach(drugFeature => {
			if ((drugFeature.drugFeature === event.target.value)) {
				drugFeature.isChecked = event.target.checked;
			}
		});
		this.setState({drugFeatures : DrugFeatures});
	}

	onChange = current => {
		// console.log('onChange:', current);
		this.setState({ current });
	};

	handleBirthdayChange(event) {
		this.state.dateOfBirth = event.target.value;
		this.setState(this.state);
	}

	handleFirstnameChange(event) {
		this.state.firstname = event.target.value;
		this.setState(this.state);
	}

	handleLastnameChange(event) {
		this.state.lastname = event.target.value;
		this.setState(this.state);
	}

	handleGenderChange(event) {
		this.state.gender.id = event.target.value;
		this.setState(this.state);
	}

	handleRedGreenColorblind(event) {
		this.state.redGreenColorblind = (event.target.value == 1) ? true : false;
		this.setState(this.state);
	}

	handleUsernameChange(event) {
		this.setState({username: event.target.value});
		this.state.username = event.target.value;
		this.setState(this.state);
	}

	handlePasswordChange(event) {
		this.state.password = event.target.value;
		this.setState(this.state);
	}

	handlePasswordRepeatChange(event) {
		this.state.passwordRepeat = event.target.value;
		this.setState(this.state);
	}

	handleSizeChange(event) {
		this.state.size = event.target.value;
		this.setState(this.state);
	}

	handleWeightChange(event) {
		this.state.weight = event.target.value;
		this.setState(this.state);
	}
	handleAllergyChange(event) {
		let selectedAllergies = [...this.state.allergies];
		// console.log(event);
		if(event.checked)
			selectedAllergies.push(event.value);

		else
			selectedAllergies.splice(selectedAllergies.indexOf(event.value), 1);

		this.setState({allergies: selectedAllergies});

	}

	handleChronicDiseasesChange(event) {
		let chronicDiseases= this.state.chronicDiseases;
		chronicDiseases.forEach(chronicDisease => {
			if ((chronicDisease.diseaseGroup === event.target.value)) {
				chronicDisease.isChecked = event.target.checked;
			}
		});
		this.setState({chronicDiseases : chronicDiseases});

	}


	handleSubmit(event) {
		event.preventDefault();

		const {t} = this.props;
		const options = {
			position: toast.POSITION.BOTTOM_CENTER
		};

		if(this.state.firstname.length == 0 || this.state.lastname.length == 0 || this.state.username.length == 0 || this.state.password == 0) {
			return;
		}

		if(this.state.password != this.state.passwordRepeat) {
			toast.error(t('passwordsDifferent'), options);
			return;
		}

		var date = null;

		if(this.state.dateOfBirth != '') {
			date = Moment(this.state.dateOfBirth);

			if(!date.isValid()) {
				if(Moment(this.state.dateOfBirth, "DD.MM.YYYY").isValid()) {
					date = Moment(this.state.dateOfBirth, "DD.MM.YYYY");
				} else {
					date= Moment();
				}
			}

			date = date.format("YYYY-MM-DD");
		}


		this.state.sending = true;
		this.setState(this.state);


		let data = {
			dateOfBirth		: date,
			firstname       : this.state.firstname,
			lastname        : this.state.lastname,
			gender          : this.state.gender,
			redGreenColorblind    : this.state.redGreenColorblind,
			username        : this.state.username,
			password        : this.state.password,
			size       : this.state.size,
			weight 		: this.state.weight,
			sufferedDiseaseGroup		: this.state.chronicDiseases.filter(item => item.isChecked),
			preferredPharmaceuticalForms : this.state.pharmaceuticalForms.filter(item => item.isChecked),
			preferredDrugFeature : this.state.drugFeatures.filter(item => item.isChecked),
			allergicSubstances : this.state.allergies

		};

		console.log("SENT DATA: ");
		console.log(data);

		axios.post('/user/save',
			data)
			.then(({data, status}) => {

				this.state.sending = false;
				this.setState(this.state);

				switch (status) {
					case 200:
						toast.success(t('registrationSuccess'), options);
						this.props.history.push("/user/login");
						break;
					case 409:
						toast.error(t('usernameUsed'), options);
						break;
					default:
						toast.error(t('errorOccured'), options);
						break;
				}
			});
	}

	renderChronicDiseases(chronicDiseases) {
		return chronicDiseases.map(( (chronicDisease,ind) => {
			// console.log("chronic!!");
			// console.log(chronicDisease);
			return (
			<div className="p-col-4" key={chronicDisease.id} style={{lineHeight:'2'}}>
				<Checkbox  inputId={`${chronicDisease.id}`} onChange={this.handleChronicDiseasesChange} value={chronicDisease.diseaseGroup} checked={chronicDisease.isChecked} />
				<label htmlFor="cb1" className="p-checkbox-label">{chronicDisease.diseaseGroup}</label>
			</div>);
		}));
	}

	renderPharmaceuticalForms(pharmaceuticalForms) {
		return pharmaceuticalForms.map(( (pharmaceuticalForm, i) => {

			return (

				<div className="p-col-4" key={pharmaceuticalForm.id} style={{lineHeight:'2'}}>
					<Checkbox  inputId={`${pharmaceuticalForm.id}`} onChange={this.handlePharmaceuticalFormChange} value={pharmaceuticalForm.name} checked={pharmaceuticalForm.isChecked} />
					<label htmlFor="cb1" className="p-checkbox-label">{pharmaceuticalForm.name}</label>
				</div>
			);
		}));
	}
	renderDrugFeatures(drugFeatures) {
		return drugFeatures.map(( (drugFeature, i) => {

			return (

				<div className="p-col-4" key={drugFeature.id} style={{lineHeight:'2'}}>
					<Checkbox  inputId={`${drugFeature.id}`} onChange={this.handleDrugFeatureChange} value={drugFeature.drugFeature} checked={drugFeature.isChecked} />
					<label htmlFor="cb1" className="p-checkbox-label">{drugFeature.drugFeature}</label>

				</div>
			);
		}));
	}


	render() {
		const {t} = this.props;

		const CardStyle = {
			backgroundColor: 'blue',
			color: 'red',
			width: '800px',
			height: '100px'
		};

		return (
			<div className="container no-banner">
				<div className="page-header">
					<h2>{t('registration')}</h2>
				</div>
				<Card title="Warum du dich registrieren kannst?"style={{color:'#0b5f5b', backgroundColor: '#FBFDFC'}} >
					<div className="Registerinfotext">Es gibt viele tolle Features, die dir dabei helfen können. Es gibt viele tolle Features, die dir dabei helfen können,beispielsweise können wir dir genau die Informationen...</div>

				</Card>
				{/*          *********************************** Login data ******************************************************/}
				<span> </span>
				<form onSubmit={this.handleSubmit} >
				<Panel header="Personal data" style={{ marginTop: '15px' }}>
					<div className="p-fluid p-formgrid p-grid">

						<div className="p-field p-col-12 p-md-6">
							<label htmlFor="firstname">{t('firstname')}</label>
							<input type="text" name="firstname" id="firstname" className="form-control" value={this.state.firstname} onChange={this.handleFirstnameChange} />
						</div>
						<div className="p-field p-col-12 p-md-6">
							<label htmlFor="lastname">{t('lastname')}</label>
							<input type="text" name="lastname" id="lastname" className="form-control" value={this.state.lastname} onChange={this.handleLastnameChange} />
						</div>
						<div className="p-field p-col-12 p-md-12">
							<label htmlFor="date of birth">{t('date of birth')} </label>
							<InputMask mask="99.99.9999" value={this.state.dateOfBirth} placeholder="99.99.9999" slotChar="mm.dd.yyyy" onChange={this.handleBirthdayChange}></InputMask>
						</div>
						<div className="p-field p-col-12">
							<label htmlFor="gender">{t('gender')}</label>
							<select id="gender" value="0" name="gender" className="form-control" title={t('gender')} value={this.state.gender.id} onChange={this.handleGenderChange}>
								<option value="0" disabled>{t('noInfo')}</option>
								<option value="2">{t('female')}</option>
								<option value="1">{t('male')}</option>
							</select>
						</div>
						<div className="p-field p-col-12 ">
							<label htmlFor="red-green-colorblind">{t('redGreenColorblind')}</label>
							<ul id="red-green-colorblind" className="inline">
								<li className="col-lg-6 col-md-6 col-xs-6">
									<label htmlFor="red-green-colorblind-yes" className="radio-inline">
										<input type="radio" value="1" id="red-green-colorblind-yes" name="redGreenColorblind" checked={this.state.redGreenColorblind == true} onChange={this.handleRedGreenColorblind} />
										{t('yes')}

									</label>
								</li>
								<li className="col-lg-6 col-md-6 col-xs-6">
									<label htmlFor="red-green-colorblind-no" className="radio-inline">
										<input type="radio" value="0" id="red-green-colorblind-no" name="redGreenColorblind" checked={this.state.redGreenColorblind == false} onChange={this.handleRedGreenColorblind} />
										{t('no')}
									</label>
								</li>
							</ul>

						</div>

						<div className="p-field p-col-12 p-md-12">
							<label htmlFor="username">{t('username')}</label>
							<input type="text" name="username" id="username" className="form-control" value={this.state.username} onChange={this.handleUsernameChange} />

						</div>

						<div className="p-field p-col-12 p-md-6">
							<label htmlFor="password">{t('password')}</label>
							<input type="password" name="password" id="password" className="form-control" value={this.state.password} onChange={this.handlePasswordChange} />
						</div>
						<div className="p-field p-col-12 p-md-6">
							<label htmlFor="password_rep">{t('passwordRepeat')}</label>
							<input type="password" name="password_rep" id="password_rep" className="form-control" value={this.state.password_repeat} onChange={this.handlePasswordRepeatChange} />
						</div>
					</div>

				</Panel>
				{/*          *********************************** Health data ******************************************************/}
				<Panel header="Health data" style={{ marginTop: '15px' }}>
					<div className="p-fluid p-formgrid p-grid">
					{/* Size and Weight block*/}
					<div className="p-field p-col-12 p-md-6">
						<label htmlFor="size">{t('size')}</label>
						<InputNumber type="text" name="size" id="size" value={this.state.size} onChange={(e) => this.setState({size: e.value})} suffix=" cm" />
					</div>
					<div className="p-field p-col-12 p-md-6">
						<label htmlFor="weight">{t('weight')}</label>
						<InputNumber type="text" name="weight" id="weight" value={this.state.weight} onChange={(e) => this.setState({weight: e.value})} suffix=" Kg" />
					</div>

					{/* Allergy block*/}
					<div className="p-field p-col-12 p-md-12">
						<label htmlFor="Do you have  allergies">{t('Do you have allergies from specific active substances?')}</label>
						<div className="p-formgroup-inline">
							<div className="p-field p-col-4 p-md-4">
								<RadioButton inputId="rb1" name="Allergy" value="Yes" onChange={(e) => this.setState({allergyCheck: true})} checked={this.state.allergyCheck} />
								<label htmlFor="rb1" className="p-radiobutton-label">Yes</label>
							</div>
							<div className="p-field p-col-4 p-md-4">
								<RadioButton inputId="rb2" name="Allergy" value="No" onChange={(e) => this.setState({allergyCheck: false, allergies: []})} checked={!this.state.allergyCheck } />
								<label htmlFor="rb2" className="p-radiobutton-label">No</label>
							</div>
						</div>



						{this.state.allergyCheck ?

							<div  className="p-grid p-align-center" style={{flex:5 ,padding:'20'}}>
								{/*{this.state.allAllergies.map((allergy,i) =>*/}
									<div className="p-col-4"  style={{lineHeight:'2'}}>
										{/*<Checkbox inputId={`${i}`} value={allergy}  onChange={ (e) => this.handleAllergyChange(e)} checked={this.state.allergies.includes(allergy)}></Checkbox>*/}
										<AutoComplete multiple={true} value={this.state.allergies} onChange={(e) => this.setState({allergies: e.value})}
													  suggestions={this.state.allergySuggestions} field="name" completeMethod={this.suggestAllergies.bind(this)} />

										{/*<label htmlFor="cb1" className="p-checkbox-label">{allergy}</label>*/}
									</div>
								<p>Selected allergies : {this.state.allergies.map((allergy) => <span style={{fontWeight: 'bold'}} key={allergy.id}>{allergy.name} </span>)}</p>

							</div>
							:
							<div></div>
						}

					</div>

					<div className="p-field p-col-12 p-md-12">
						<div></div>
						<label htmlFor="Do you have a related to specific disease group?">{t('Do you have a related to specific disease group?')}</label>

						<div className="p-formgroup-inline">
							<div className="p-field p-col-4 p-md-4">
								<RadioButton inputId="rb1" name="chronicDisease" value="Yes" onChange={(e) => this.setState({chronicDiseasesCheck: true})} checked={this.state.chronicDiseasesCheck} />
								<label htmlFor="rb1" className="p-radiobutton-label">Yes</label>
							</div>
							<div className="p-field p-col-4 p-md-4">
								<RadioButton inputId="rb2" name="chronicDisease" value="No" onChange={(e) => this.setState({chronicDiseasesCheck: false, chronicDiseases: this.state.chronicDiseases.map(item => {item.isChecked = false; return item;})})} checked={!this.state.chronicDiseasesCheck } />
								<label htmlFor="rb2" className="p-radiobutton-label">No</label>
							</div>

						</div>

						{this.state.chronicDiseasesCheck ?
							// specific chronic diseases
							<div  className="p-grid p-align-center" style={{flex:5 ,padding:'20'}}>
								{/*other chronic diseases*/}
								{this.renderChronicDiseases(this.state.chronicDiseases)}
								{/*<p>Selected all Diseases : {this.state.chronicDiseases.filter(item => item.isChecked).map((chronicDisease) => <span style={{fontWeight: 'bold'}} key={chronicDisease.id}>{chronicDisease.diseaseGroup} </span>)}</p>*/}
							</div>
							:
							<div></div>
						}

					</div>

					</div>

				</Panel>

				<Panel header="Drug preferences" style={{ marginTop: '15px'}}>
					<div className="p-fluid p-formgrid p-grid">
						{/*prefered pharmaceutical eigenschaft block*/}
						<div className="p-field p-col-12 p-md-12">
							<label htmlFor="Do you have prefered drug features?">{t('Do you have prefered drug features?')}</label>
							<div className="p-formgroup-inline">
								<div className="p-field p-col-4 p-md-4">
									<RadioButton inputId="df1" name="DrugFeatures" value="Yes" onChange={(e) => this.setState({drugFeaturesCheck: true})} checked={this.state.drugFeaturesCheck} />
									<label htmlFor="df1" className="p-radiobutton-label">Yes</label>
								</div>
								<div className="p-field p-col-4 p-md-4">
									<RadioButton inputId="df2" name="DrugFeatures" value="No" onChange={(e) => {this.setState({drugFeaturesCheck: false, drugFeatures: this.state.drugFeatures.map(item => {item.isChecked =false; return item; })})}} checked={!this.state.drugFeaturesCheck } />
									<label htmlFor="df2" className="p-radiobutton-label">No</label>
								</div>
							</div>



							{this.state.drugFeaturesCheck ?

								<div  className="p-grid p-align-center" style={{flex:5 ,padding:'20'}}>
									{this.renderDrugFeatures(this.state.drugFeatures)}
								</div>
								:
								<div></div>
							}

						</div>

						{/*prefered pharmaceutical forms block*/}
						<div className="p-field p-col-12 p-md-12">
							<label htmlFor="Do you have prefered Dosage forms?">{t('Do you have Dosage forms?')}</label>
							<div className="p-formgroup-inline">
								<div className="p-field p-col-4 p-md-4">
									<RadioButton inputId="rb1" name="pharmaceuticalForms" value="Yes" onChange={(e) => this.setState({pharmaceuticalFormsCheck: true})} checked={this.state.pharmaceuticalFormsCheck} />
									<label htmlFor="rb1" className="p-radiobutton-label">Yes</label>
								</div>
								<div className="p-field p-col-4 p-md-4">
									<RadioButton inputId="rb2" name="pharmaceuticalForms" value="No" onChange={(e) => {this.setState({pharmaceuticalFormsCheck: false, pharmceuticalForms: this.state.pharmaceuticalForms.map(item => {item.isChecked =false; return item; })});}} checked={!this.state.pharmaceuticalFormsCheck } />
									<label htmlFor="rb2" className="p-radiobutton-label">No</label>
								</div>
							</div>



							{this.state.pharmaceuticalFormsCheck ?

								<div  className="p-grid p-align-center" style={{flex:5 ,padding:'20'}}>
										{this.renderPharmaceuticalForms(this.state.pharmaceuticalForms)}
								</div>
								:
								<div></div>
							}

						</div>


					</div>

				</Panel>

					<div className="form-actions" style={{ marginTop: '25px'  ,textAlign: 'center' }}>
						{!this.state.sending ?
							<button type="submit" className="btn btn-primary" style={{width:'300px',marginRight:'15px'}}>{t('register')}</button>
							:
							<button className="btn btn-default" style={{width:'300px'}}>
								<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="></img>
							</button>
						}
						<Link to="/user/login"><button type="button" className="btn btn-default" style={{width:'300px'}}>{t('login')}</button></Link>
					</div>

				</form>


			</div>

		);
	}
}

export default translate()(Register);