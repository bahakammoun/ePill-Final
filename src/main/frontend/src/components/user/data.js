import axios from "axios";
import React from "react";
import Moment from 'moment';

import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
import {translate} from "react-i18next";
import Cookies from "universal-cookie";

import User from "./../../util/User";
import {Panel} from "primereact/panel";
import {InputMask} from "primereact/inputmask";
import {InputNumber} from "primereact/inputnumber";
import {RadioButton} from "primereact/radiobutton";
import {Checkbox} from "primereact/checkbox";
import {AutoComplete} from "primereact/autocomplete";

// See https://facebook.github.io/react/docs/forms.html for documentation about
// forms.
class UserData extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
	        	firstname	: '',
	        	lastname		: '',
	        	dateOfBirth	: '',
	        	gender		: {id : 0},
	        	email		: '',
	        	redGreenColorblind    : false,
				levelOfDetail       : 3,
				preferredFontSize   : 'defaultFontSize',
	        	sending		: false,
				size	: 0,
				weight : 0.0,
				allergyCheck : false,
				allergies: [],
				allAllergies: ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11"],
				chronicDiseasesCheck  : false,
				chronicDiseases: [],
				sufferedChronicDiseases: [],

				drugFeaturesCheck : false,
				drugFeatures: [],

				pharmaceuticalFormsCheck : false,
				pharmaceuticalForms: [],
				checked: false,
				preferredPharmaceuticalForms : [],
				preferredDrugFeature : []
        };
        
        this.handleFirstnameChange		= this.handleFirstnameChange.bind(this);
        this.handleLastnameChange		= this.handleLastnameChange.bind(this);
        this.handleDateOfBirthChange     = this.handleDateOfBirthChange.bind(this);
        
        this.handleGenderChange			= this.handleGenderChange.bind(this);
        this.handleRedGreenColorblind    = this.handleRedGreenColorblind.bind(this);

        
        this.handleEmailChange			= this.handleEmailChange.bind(this);

        this.handleChangeLevelOfDetail		= this.handleChangeLevelOfDetail.bind(this);
        this.handleChangePreferredFontSize	= this.handleChangePreferredFontSize.bind(this);
        
        this.handleSubmit				= this.handleSubmit.bind(this);


		this.handleSizeChange	= this.handleSizeChange.bind(this);
		this.handleWeightChange	= this.handleWeightChange.bind(this);
		this.handleAllergyChange	= this.handleAllergyChange.bind(this);
		this.handleChronicDiseasesChange	= this.handleChronicDiseasesChange.bind(this);
		this.handleDrugFeatureChange =this.handleDrugFeatureChange.bind(this);
		this.handlePharmaceuticalFormChange =this.handlePharmaceuticalFormChange.bind(this);


		this.cookies = this.props.cookies;
    }


    componentWillMount() {
    		if(!User.isAuthenticated()) {
    			return;
    		}

			axios.get("/pharmaceuticalForm/all")
				.then(({data, status})  => {
					console.log(data);
					this.state.pharmaceuticalForms = data.value.map(item => {item.isChecked = false; return item;});
					this.state.pharmaceuticalForms = this.state.pharmaceuticalForms.map(pharmaceuticalForm => {
						for (let i = 0; i < this.state.preferredPharmaceuticalForms.length; i++) {
							if (this.state.preferredPharmaceuticalForms[i].id === pharmaceuticalForm.id) {
								pharmaceuticalForm.isChecked = true;
								break;
							}
						}
						return pharmaceuticalForm;
					});

				});

			axios.get("/drugFeature/all")
				.then(({data, status})  => {
					console.log(data);
					this.state.drugFeatures = data.value.map(item => {item.isChecked = false; return item;});
					this.state.drugFeatures = this.state.drugFeatures.map(drugFeature => {
						for (let i = 0; i < this.state.preferredDrugFeature.length; i++) {
							if (this.state.preferredDrugFeature[i].id === drugFeature.id) {
								drugFeature.isChecked = true;
								break;
							}
						}
						return drugFeature;

				});
				});

		axios.get("/disease_group/all")
			.then(({data, status})  => {
				console.log(data);
				this.state.chronicDiseases = data.value.map(item => {item.isChecked = false; return item;});
				this.state.chronicDiseases = this.state.chronicDiseases.map(chronicDisease => {
					for (let i = 0; i < this.state.sufferedChronicDiseases.length; i++) {
						if (this.state.sufferedChronicDiseases[i].id === chronicDisease.id) {
							chronicDisease.isChecked = true;
							break;
						}
					}
					return chronicDisease;

				});
			});

			axios.get("/activeSubstance/all")
				.then(({data, status})  => {
					console.log(data);
					this.state.allAllergies = data.value;
					console.log(this.state.allAllergies);

				});

    		axios.get(`/user/${User.id}`)
            .then(({data, status}) => {
                
            		this.state.firstname		= data.firstname;
            		this.state.lastname		= data.lastname;
            		this.state.email			= data.email		|| '';
            		this.state.gender		= data.gender			|| {id : 0};
            		this.state.username		= data.username;
            		this.state.redGreenColorblind    = data.redGreenColorblind || false;
            		this.state.levelOfDetail	    = data.levelOfDetail	|| 3;
            		this.state.preferredFontSize	= data.preferredFontSize   || 'defaultFontSize';
					this.state.size = data.size;
					this.state.weight = data.weight;
					let date = Moment(data.dateOfBirth, "YYYY-MM-DD");
					this.state.dateOfBirth = date.format("DD.MM.YYYY");

					// Pharmaceutical form import

            		if (data.preferredPharmaceuticalForms && data.preferredPharmaceuticalForms.length > 0) {
					this.state.pharmaceuticalFormsCheck = true;

					this.state.preferredPharmaceuticalForms = data.preferredPharmaceuticalForms.map(pharmaceuticalForm => {
						pharmaceuticalForm.isChecked = true;
						return pharmaceuticalForm
						});
					}

					this.state.pharmaceuticalForms = this.state.pharmaceuticalForms.map(pharmaceuticalForm => {
						for (let i = 0; i < this.state.preferredPharmaceuticalForms.length; i++) {
							if (this.state.preferredPharmaceuticalForms[i].id === pharmaceuticalForm.id) {
								pharmaceuticalForm.isChecked = true;
								break;
							}
						}
						return pharmaceuticalForm;});



					// Drug Features import

					if (data.preferredDrugFeature && data.preferredDrugFeature.length > 0) {
						this.state.drugFeaturesCheck = true;

						this.state.preferredDrugFeature = data.preferredDrugFeature.map(drugFeature => {
							drugFeature.isChecked = true;
							return drugFeature
						});
					}

					this.state.drugFeatures = this.state.drugFeatures.map(drugFeature => {
						for (let i = 0; i < this.state.preferredDrugFeature.length; i++) {
							if (this.state.preferredDrugFeature[i].id === drugFeature.id) {
								drugFeature.isChecked = true;
								break;
							}
						}
						return drugFeature;});

				if (data.sufferedDiseaseGroup && data.sufferedDiseaseGroup.length > 0) {
					this.state.chronicDiseasesCheck = true;

					this.state.sufferedChronicDiseases = data.sufferedDiseaseGroup.map(chronicDisease => {
						chronicDisease.isChecked = true;
						return chronicDisease
					});
				}

				this.state.chronicDiseases = this.state.chronicDiseases.map(chronicDisease => {
					for (let i = 0; i < this.state.sufferedChronicDiseases.length; i++) {
						if (this.state.sufferedChronicDiseases[i].id === chronicDisease.id) {
							chronicDisease.isChecked = true;
							break;
						}
					}
					return chronicDisease;});

				this.state.allergies = data.allergicSubstances || [];

				if (data.allergicSubstances && data.allergicSubstances.length > 0) {
					this.state.allergyCheck = true;
					}



				console.log(data);
				console.log(this.state.allergies);
                this.setState(this.state);
            });
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
		console.log('onChange:', current);
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
		console.log('onChange:', current);
		this.setState({ current });
	};
    
    handleFirstnameChange(event) {
	    this.state.firstname	= event.target.value;
	    	this.setState(this.state);
    }

    handleLastnameChange(event) {
	    this.state.lastname = event.target.value;
	    	this.setState(this.state);
    }
    
    handleGenderChange(event) {
	    this.state.gender = {id : event.target.value };
	    this.setState(this.state);
    }
    
    handleDateOfBirthChange(event) {
	    this.state.dateOfBirth = event.target.value
	    	this.setState(this.state);
    }
    
    handleUsernameChange(event) {
	    this.state.username = event.target.value;
	    	this.setState(this.state);
    }
    
    handleRedGreenColorblind(event) {
        this.state.redGreenColorblind = (event.target.value == 1) ? true : false;
        this.setState(this.state);
        
        User.setRedGreenColorblind(this.state.redGreenColorblind);
    }
    
    handleChangeLevelOfDetail(event) {
	    this.state.levelOfDetail = event.target.value;
	    	this.setState(this.state);
	    	
	    User.setLevelOfDetail(this.state.levelOfDetail);
    }
    
    handleChangePreferredFontSize(event) {
	    this.state.preferredFontSize = event.target.value;
	    	this.setState(this.state);

		User.setPreferredFontSize(this.state.preferredFontSize);
		this.props.updateFontSize(this.state.preferredFontSize);
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
		console.log(event);
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


	handleEmailChange(event) {
	    this.state.email = event.target.value;
    		this.setState(this.state);
    }





    handleSubmit(event) {
        event.preventDefault();
        
        if(this.state.sending)
        		return;

		const {t} = this.props;
	    const options = {
	    	    position: toast.POSITION.BOTTOM_CENTER
	    };
        
        
        var date = null;
        
        if(this.state.dateOfBirth != '') {
            date = Moment(this.state.dateOfBirth);
            
            if(!date.isValid()) {
        	        	if(Moment(this.state.dateOfBirth, "DD.MM.YYYY").isValid()) {
        	    			date = Moment(this.state.dateOfBirth, "DD.MM.YYYY");
        	    		} else {
        	            toast.error(t('invalidDateFormat'), options);
        	    			return;
        	    		}
            }
            
            date = date.format("YYYY-MM-DD");
        }
        
        this.state.sending = true;
        this.setState(this.state);

        axios.post('/user/update',
               {
	           		firstname			: this.state.firstname,
	           		lastname				: this.state.lastname,
	                	dateOfBirth			: date,
	        			gender				: this.state.gender,
	        			email				: this.state.email,
	        			redGreenColorblind   : this.state.redGreenColorblind,
    	        		levelOfDetail		: this.state.levelOfDetail,
	    	        	preferredFontSize	: this.state.preferredFontSize,
						   size       : this.state.size,
						   weight 		: this.state.weight,
				   sufferedDiseaseGroup		: this.state.chronicDiseases.filter(item => item.isChecked),
						   preferredPharmaceuticalForms : this.state.pharmaceuticalForms.filter(item => item.isChecked),
						   preferredDrugFeature : this.state.drugFeatures.filter(item => item.isChecked),
				   allergicSubstances : this.state.allergies

                })
                .then(({data, status}) => {
                     this.state.sending = false;
                     this.setState(this.state);
                     
                     const {t} = this.props;
                     const options = {
                     	    position: toast.POSITION.BOTTOM_CENTER
                     };
                     
                     switch (status) {
                         case 200:

                             var data = this.state;
                             data.id = User.id;
                             
                             User.set(data);
                             
                             const cookies = new Cookies();
                             const auth = cookies.get('auth');

                             auth["user"] = data;
                             cookies.set('auth', auth);
                             
                             toast.success(t('savingSuccessfull'), options);
                             
                             break;
                         case 400:
                          	toast.error(t('savingFailed'), options);
                             break;
                         case 401:
                         	console.log(data, "not permitted");
                            	break;
                     }
                });
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

    render() {
        const {t} 		= this.props;
        const firstname 	= this.state.firstname;
        const lastname 	= this.state.lastname;

        return (
	       <div className="container marketing no-banner">
	        	<div className='page-header'>
	        	      <h3>{t("userData")}</h3>
	        	</div>
	     	
	        	{User.levelOfDetail > 1 &&
			    <div className="alert alert-info">
                    <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    <span className="sr-only">Info:</span>&nbsp;
	        			{t("userCockpitDescr").replace("%User.firstname%", firstname).replace("%User.lastname%", lastname)}
				</div>
		    } 
	        	   <form onSubmit={this.handleSubmit} className="row">
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
								   <InputMask mask="99.99.9999" value={this.state.dateOfBirth} placeholder="99.99.9999" slotChar="mm.dd.yyyy" onChange={this.handleDateOfBirthChange}></InputMask>
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
								   <label htmlFor="email">{t('email')}</label>
								   <input type="text" name="email" id="email" className="form-control" value={this.state.email} onChange={this.handleEmailChange} />
							   </div>

						   </div>
						   <fieldset>
							   <div className="form-group col-lg-9 col-md-9">
								   <p><b>{t("helpenabled")}</b></p>
								   <ul className="list-inline degree-of-detail-list">
									   <li className="col-lg-4 col-md-4 col-xs-4 list-group-item">
										   <label htmlFor="settings-detail-max" className="radio-inline">
											   <input type="radio" value="3" id="settings-detail-max" name="levelOfDetail" checked={this.state.levelOfDetail == 3} onChange={this.handleChangeLevelOfDetail} />
											   {t('yes')}
										   </label>
									   </li>
									   <li className="col-lg-4 col-md-4 col-xs-4 list-group-item">
										   <label htmlFor="settings-detail-min" className="radio-inline">
											   <input type="radio" value="1" id="settings-detail-min" name="levelOfDetail" checked={this.state.levelOfDetail == 1} onChange={this.handleChangeLevelOfDetail} />
											   {t('no')}
										   </label>
									   </li>
								   </ul>
							   </div>
						   </fieldset>
						   <fieldset>
							   <div className="form-group col-lg-9 col-md-9">
								   <p><b>{t("preferredFontSize")}</b></p>
								   <ul className="list-inline font-size-list">
									   <li className="col-lg-4 col-md-4 col-xs-4 list-group-item">
										   <label htmlFor="settings-preferred-font-size-min" className="radio-inline">
											   <input type="radio" value="minFontSize" id="settings-preferred-font-size-min" name="preferredFontSize" checked={this.state.preferredFontSize == 'minFontSize'} onChange={this.handleChangePreferredFontSize} />
											   <span className="small-text">AAA</span>
										   </label>
									   </li>
									   <li className="col-lg-4 col-md-4 col-xs-4 list-group-item">
										   <label htmlFor="settings-preferred-font-size-default" className="radio-inline">
											   <input type="radio" value="defaultFontSize" id="settings-preferred-font-size-default" name="preferredFontSize" checked={this.state.preferredFontSize == 'defaultFontSize'} onChange={this.handleChangePreferredFontSize} />
											   <span className="medium-text">AAA</span>
										   </label>
									   </li>
									   <li className="col-lg-4 col-md-4 col-xs-4 list-group-item">
										   <label htmlFor="settings-preferred-font-size-max" className="radio-inline">
											   <input type="radio" value="maxFontSize" id="settings-preferred-font-size-max" name="preferredFontSize" checked={this.state.preferredFontSize == 'maxFontSize'} onChange={this.handleChangePreferredFontSize} />
											   <span className="big-text">AAA</span>
										   </label>
									   </li>
								   </ul>
							   </div>
						   </fieldset>

					   </Panel>

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
								   <label htmlFor="Do you have some medicaments allergies">{t('Do you have some medicaments allergies')}</label>
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
								   <label htmlFor="Do you have a chronic diseases">{t('Do you have a chronic diseases')}</label>

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
								   <label htmlFor="Do you have prefered feature?">{t('Do you have prefered prefered feature?')}</label>
								   <div className="p-formgroup-inline">
									   <div className="p-field p-col-4 p-md-4">
										   <RadioButton inputId="df1" name="DrugFeatures" value="Yes" onChange={(e) => this.setState({drugFeaturesCheck: true})} checked={this.state.drugFeaturesCheck} />
										   <label htmlFor="df1" className="p-radiobutton-label">Yes</label>
									   </div>
									   <div className="p-field p-col-4 p-md-4">
										   <RadioButton inputId="df2" name="DrugFeatures" value="No" onChange={(e) => {this.setState({drugFeaturesCheck: false, drugFeatures: this.state.drugFeatures.map(item => {item.isChecked =false; return item; })});console.log(this.state.drugFeatures)}} checked={!this.state.drugFeaturesCheck } />
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
								   <label htmlFor="Do you have prefered pharmaceutical forms?">{t('Do you have prefered pharmaceutical forms?')}</label>
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


					   <div className="form-actions container">
			            {!this.state.sending ?
	            				<button type="submit" className="btn btn-primary">{t('save')}</button>
	            				: <button className="btn btn-default"><img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="></img></button> }
				        </div>
	        	    </form>
	        	</div>
        );
    }
}

export default translate()(UserData);