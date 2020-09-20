import axios from "axios";
import React from "react";
import {Card} from 'primereact/card';
import {translate} from "react-i18next";
import { toast } from 'react-toastify';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
// import { Accordion, AccordionTab } from 'primereact/accordion';
import Loading from "./loading";
import User from "./../util/User";
import Moment from "moment";
import DrugMiniature from "./drug_miniature";
import Accordion from "./accordion";

class DrugDetail extends React.Component {
    constructor(props) {
        super();
        this.state = {
            drug: undefined,
            showAdditionalInfo	: false,
			showAdditionalInfoForSideEffects : false
        }
        
        this.toggleShowAdditionalInfo = this.toggleShowAdditionalInfo.bind(this);
        this.toggleOriginalAndTailoredText = this.toggleOriginalAndTailoredText.bind(this);
        this.allergiesFilter = this.allergiesFilter.bind(this);
        this.sideEffectsFilter = this.sideEffectsFilter.bind(this);
    }

    init() {
		axios.get('/drug/list/all')
			.then(({data, status}) => {
				this.state.drugs = data.value;
				console.log("drugs: ", data);
				this.setState(this.state);
			});


        axios.get(`/drug/${this.props.match.params.id}/de`)
        .then(({data, status}) => {
            this.setState({
                drug: data
            });
            console.log("druggiiieee: ", data);
        });

        if (!User.isAuthenticated()) {
        	return;
		}

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
				this.state.age = this.calculateAge(this.state.dateOfBirth);
				this.state.sufferedChronicDiseases = data.sufferedDiseaseGroup || [];


				// Pharmaceutical form import

				if (data.preferredPharmaceuticalForms && data.preferredPharmaceuticalForms.length > 0) {
					this.state.pharmaceuticalFormsCheck = true;

					this.state.preferredPharmaceuticalForms = data.preferredPharmaceuticalForms.map(pharmaceuticalForm => {
						pharmaceuticalForm.isChecked = true;
						return pharmaceuticalForm
					});
				}

				// this.state.pharmaceuticalForms = this.state.pharmaceuticalForms.map(pharmaceuticalForm => {
				// 	for (let i = 0; i < this.state.preferredPharmaceuticalForms.length; i++) {
				// 		if (this.state.pharmaceuticalForms[i].id === pharmaceuticalForm.id) {
				// 			pharmaceuticalForm.isChecked = true;
				// 			break;
				// 		}
				// 	}
				// 	return pharmaceuticalForm;});



				// Drug Features import

				if (data.preferredDrugFeature && data.preferredDrugFeature.length > 0) {
					this.state.drugFeaturesCheck = true;

					this.state.preferredDrugFeature = data.preferredDrugFeature.map(drugFeature => {
						drugFeature.isChecked = true;
						return drugFeature
					});
				}

				// this.state.drugFeatures = this.state.drugFeatures.map(drugFeature => {
				// 	for (let i = 0; i < this.state.preferredDrugFeature.length; i++) {
				// 		if (this.state.drugFeatures[i].id === drugFeature.id) {
				// 			drugFeature.isChecked = true;
				// 			break;
				// 		}
				// 	}
				// 	return drugFeature;});

				if (data.sufferedDiseaseGroup && data.sufferedDiseaseGroup.length > 0) {
					this.state.chronicDiseasesCheck = true;

					this.state.sufferedChronicDiseases = data.sufferedDiseaseGroup.map(chronicDisease => {
						chronicDisease.isChecked = true;
						return chronicDisease
					});
				}

				// this.state.chronicDiseases = this.state.chronicDiseases.map(chronicDisease => {
				// 	for (let i = 0; i < this.state.sufferedChronicDiseases.length; i++) {
				// 		if (this.state.sufferedChronicDiseases[i].id === chronicDisease.id) {
				// 			chronicDisease.isChecked = true;
				// 			break;
				// 		}
				// 	}
				// 	return chronicDisease;});


				this.state.allergies = data.allergicSubstances || [];

				if (data.allergicSubstances && data.allergicSubstances.length > 0) {
					this.state.allergyCheck = true;
				};






				console.log(data);
				console.log(this.state.allergies);
				console.log("age", this.state.age);
				this.setState(this.state);
			});
    }

	calculateAge(birthday) { // birthday is a date


		let today = new Date();
		let birthDate = new Date(birthday);  // create a date object directly from `dob1` argument
		let age_now = today.getFullYear() - birthDate.getFullYear();
		let m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
		{
			age_now--;
		}
		console.log(age_now);
		return age_now;
	}

    componentWillMount() {
		this.init();
    }
    
    componentWillReceiveProps(props){
    		this.props = props;
        this.init();
     }
    
    createMarkup(text) { return {__html: text}; };
    
    //=============================
    
    toggleShowAdditionalInfo() {
    		this.setState({ showAdditionalInfo : !this.state.showAdditionalInfo});
    }
    
    
    
    toggleOriginalAndTailoredText(section) {

    		var url = (section.isTailored) ? `packagingSection/tailored/${section.topic.id}/${this.props.match.params.id}` : `packagingSection/${section.topic.id}/${this.props.match.params.id}`;

    		axios.get(url).then(({data, status}) => {

        	 	switch(status) {
        	 		case 200:
        	 			var idx = -1;
        	 			for(var i=0; i<this.state.drug.packagingSection.length; i++) {
        	 				if(this.state.drug.packagingSection[i]["id"] == section["id"]) {
        	 					idx = i;
        	 					break;
        	 				}
        	 			}
        	 			
                		this.state.drug.packagingSection[idx] = data;
                		this.setState(this.state);
                		
        	 			break;
        	 		default:
        	 			const {t} = this.props;
        	 			const options = {
        	 				position: toast.POSITION.BOTTOM_CENTER
        	 			};
        	 			toast.error(t('errorOccured'), options);
        	 			break;
        	 	}
         });

    }
    
    
    //=============================
    
    toggleTaking(drug) {
		if(drug.isTaken) {
			this.removeFromTakingList(drug.id);
		} else {
			this.addToTakingList(drug.id);
		}
    }
    
    addToTakingList(id) {
    	
    	 	axios.post('/drug/taking/add', { id : id }, {
	            validateStatus: (status) => {
	                return (status >= 200 && status < 300) || status == 400 || status == 401
	            }
     		})
         .then(({data, status}) => {
             const {t} = this.props;
             const options = {
             	    position: toast.POSITION.BOTTOM_CENTER
             };

             switch (status) {
                 case 200:
                     toast.success(t('addToTakingListSuccess'), options);
                     this.state.drug.isTaken = true;
                     this.setState(this.state.drug);
                     break;
                 case 400:
                  	toast.error(t('addToTakingListFailed'), options);
                     break;
                 case 401:
                 	console.log(data, "not permitted");
                    	break;
             }
         });
    }
    
    removeFromTakingList(id) {
	 	axios.post('/drug/taking/remove', { id : id }, {
            validateStatus: (status) => {
                return (status >= 200 && status < 300) || status == 400 || status == 401
            }
 		})
	     .then(({data, status}) => {
             const {t} = this.props;
             const options = {
             	    position: toast.POSITION.BOTTOM_CENTER
             };
             
	         switch (status) {
	             case 200:
                     toast.success(t('removeFromTakingListSuccess'), options);
                     this.state.drug.isTaken = !this.state.drug.isTaken;
                     this.setState(this.state.drug);
	                 break;
	             case 400:
                     toast.error(t('removeFromTakingListFailed'), options);
	                 break;
	             case 401:
	             	console.log(data, "not permitted");
	                	break;
	         }
	     });
	}
    
    
    
    /**
     * toggle add/remove to/from remember/taking list
     */
    
    toggleRemember(drug) {
		if(drug.isRemembered) {
			this.removeFromRememberList(drug.id);
		} else {
			this.addToRememberList(drug.id);
		}
    }

	toggleShowAdditionalInfoFor(object) {
    	for (let i = 0; i  < this.state.filteredChronicDiseases.length; i++) {
    		if (object.id == this.state.filteredChronicDiseases[i].id) {
    			this.state.filteredChronicDiseases[i].showAdditionalInfo = !this.state.filteredChronicDiseases[i].showAdditionalInfo;
    			break;
			}
		}
    	this.setState(this.state)
	}

    addToRememberList(id) {
	 	axios.post('/drug/remember/add', { id : id }, {
            validateStatus: (status) => {
                return (status >= 200 && status < 300) || status == 400 || status == 401 || status == 405
            }
 		})
	     .then(({data, status}) => {
             const {t} = this.props;
             const options = {
             	    position: toast.POSITION.BOTTOM_CENTER
             };
             
	         switch (status) {
	             case 200:
	                 toast.success(t('addToRememberListSuccess'), options);
                     this.state.drug.isRemembered = true;
                     this.setState(this.state.drug);
	                 break;
	             case 400:
	            	 	toast.error(t('addToRememberListFailed'), options);
	            	 	break;
	             case 401:
	             	console.log(data, "not permitted");
	                	break;
	             case 405:
		            console.log(data, "Method not allowed");
		            break;
	         }
	     });
    }
    
    removeFromRememberList(id) {
	 	axios.post('/drug/remember/remove', { id : id }, {
            validateStatus: (status) => {
                return (status >= 200 && status < 300) || status == 400 || status == 401 || status == 405
            }
 		})
	     .then(({data, status}) => {
             const {t} = this.props;
             const options = {
             	    position: toast.POSITION.BOTTOM_CENTER
             };
             
	         switch (status) {
	             case 200:
	                 toast.success(t('removeFromRememberListSuccess'), options);
                     this.state.drug.isRemembered = !this.state.drug.isRemembered;
                     this.setState(this.state.drug);
	                 break;
	             case 400:
	            	 	toast.error(t('removeFromRememberListFailed'), options);
	            	 	break;
	             case 401:
	             	console.log(data, "not permitted");
	                	break;
	             case 405:
		            console.log(data, "Method not allowed");
		            break;
	         }
	     });
    }
    
    
    //=============================
    
    
    renderDrugFeatures(drug) {
		
		if(!drug.drugFeature)
			return;
		
		return (
        		<p>
        			{ drug.drugFeature.map(feature => <img key={feature.id} src={"./../../assets/icons/"+feature.id + ".svg"} alt={feature.drugFeature} title={feature.drugFeature} className="drug-feature-icon"></img> ) }
        		</p>
		);
    }
    
	renderDisease(drug) {
		if(!drug.disease) {
			return;
		}

        const {t} = this.props;
        return (
        		<section className="diseases">
	    			{t('usedWhen')+": "}
	    			{ drug.disease.map(disease => <span key={disease.id}>{disease.name}</span> )
	    				.reduce((prev, curr) => [prev, ', ', curr]) }
	        </section>
		);
	}
	
	renderPharmaceuticalForm(drug) {
		if(!drug.pharmaceuticalForm) {
			return;
		}

        const {t} = this.props;
        return (
        		<section className="diseases">
	    			{t('pharmaceuticalForm')+": "}
	    			{ drug.pharmaceuticalForm.map(pharmaceuticalForm => <span key={pharmaceuticalForm.id}>{pharmaceuticalForm.name}</span> )
	    				.reduce((prev, curr) => [prev, ', ', curr]) }
	        </section>
		);	
	}
	
	renderActiveSubstance(drug) {
		if(!drug.activeSubstance)
			return null;

        const {t} = this.props;
        
        return (
	        <p> {t('activeSubstance')+": "}
			{ drug.activeSubstance.map(substance => <span key={substance.id}>{substance.name}</span> )
				.reduce((prev, curr) => [prev, ', ', curr]) }
			</p>
		);
	}
	
	renderPZN(drug) {
		if(!drug.packaging)
			return null;
			
        const {t} = this.props;
        
        return (
        		<section className="pzn">
	    			{t('pzn')+": "}
	    			{ drug.packaging.map(packaging => <span key={packaging.id}>{packaging.name} {packaging.pzn}</span> )
	    				.reduce((prev, curr) => [prev, ', ', curr]) }
	    		</section>
		);
	}
	

	renderIndicationGroup(drug) {
		if(!drug.indicationGroup || !drug.indicationGroup.name)
			return null;
			
        const {t} = this.props;
        
        return (
        		<section>
	    			{t('indicationGroup')+": "+drug.indicationGroup.name}
	    		</section>
		);
	}
	
	renderProductGroup(drug) {
		
		if(!drug.productGroup || !drug.productGroup.name)
			return null;
			
        const {t} = this.props;
        
        return (
        		<section>
	    			{t('productGroup')+": "+drug.productGroup.name}
	    		</section>
		);
	}
    
    renderSectionOverview(drug) {
    		if(!drug.packagingSection) {
			return null;
		}

        return drug.packagingSection.map((section => {
            return (
            		<li key={section.id}>{section.topic.title}</li>
            );
        }));
    }

    renderSectionList(drug) {
    		if(!drug.packagingSection) {
			return null;
		}
   
    		return drug.packagingSection.map((section => {
            return (	<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"  ><Accordion  section={section} toggleOriginalAndTailoredText={this.toggleOriginalAndTailoredText} key={section.id} /> </div>);
        }));
    }
    
    
    
    
    
    render() {
        const {t}	= this.props;
        const drug	= this.state.drug;
        const showAdditionalInfo = this.state.showAdditionalInfo;
        
        if (!drug) {
            // Do not show anything while loading.
            return (
                	<div className="container marketing no-banner">
	            		<div className='page-header'>
	            			<h3> </h3>
	            		</div>
	            		<Loading />
            		</div>
            );
        }

        return (
	        	<div className="container marketing no-banner">
	        		<div className='page-header'>
	        			<div className='btn-toolbar pull-right'>
	        				<div className='btn-group'></div>
	        			</div>
	        			{User.isAuthenticated()
	        				&&
		        			<div className='btn-toolbar pull-right'>
			        		    <div className='btn-group'>
				    				<button type="button" className="btn btn-like" onClick={() => this.toggleTaking(drug)}>
									<span className={"glyphicon white" + ((!drug.isTaken) ? " glyphicon-heart" : " glyphicon-minus")}></span>
								</button>
								
			        				<button type="button" className="btn btn-add" onClick={() => this.toggleRemember(drug)}>
			        					<span className={"glyphicon white" + ((!drug.isRemembered) ? " glyphicon-plus" : " glyphicon-minus")}></span>
			        				</button>
			        		    </div>
			        		  </div>	
		        			}
						{!User.isAuthenticated() &&
						<div className="alert alert-info" role="alert">
							<span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
							<strong style={{ paddingLeft:'20px', fontSize: '120%'}}>To get Personalized drug information, you need to login/ register!</strong>
						</div>
						}
	        			<h3>{drug.name} {drug.productGroup && drug.productGroup.name && <span className="text-muted">{drug.productGroup.name}</span> }</h3>
	        			<span>v. {drug.version} | {t('publishingDate')}: {new Date(drug.year).toLocaleDateString()}</span>
	  
	        		</div>
	        		<div className="row featurette drug-detail-header">
	        			<div className="col-xs-12 col-sm-12 col-md-3">
	        				<img className="featurette-image img-responsive center-block" alt={drug.name} title={drug.name} src={`/image/drug/${drug.id}`}></img>
	                		<div className="drug-features margin-s">
		    					{this.renderDrugFeatures(drug)}
		            		</div>
	        			</div>
	        			<div className="col-xs-12 col-sm-12 col-md-9">
	        				{ User.isAuthenticated() && drug.personalizedInformation &&
	        					<div className="alert alert-info alert-dismissable">
	        						<a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
	        						<span dangerouslySetInnerHTML={this.createMarkup(drug.personalizedInformation)} />
	        					</div>
	        				}

	        				{ this.renderPharmaceuticalForm(drug)}
	      
	        				{ this.renderDisease(drug) }
	        				
	        				{this.renderActiveSubstance(drug)}
	
	        			
		    	    			<div className="additional-information">
		    	    				{showAdditionalInfo &&
		    		    				<section>
		    		        				{this.renderIndicationGroup(drug)}
		    		        				
		    		        				{this.renderProductGroup(drug)}

		    		    					{this.renderPZN(drug)}
		    		    				</section>
		    	    				}

		    	    				<p>
			    	    				<a onClick={this.toggleShowAdditionalInfo}>
			    	    					[{!showAdditionalInfo && <span>{t('viewDetails')}</span> }
			    	    					{showAdditionalInfo && <span>{t('hideDetails')}</span> }]
			    	    				</a>
		    	    				</p>
		    	    			</div>
	        				
	        			</div>
	        		</div>
	    			
	    			
	        		<hr />

					{User.isAuthenticated() &&
					<div> </div>

					}

					{this.renderAllergiesWarning()}

					{this.renderDiseaseGroupRelatedSideEffects()}
					{this.renderPharmaceuticalRelatedSuggestions()}

					{this.renderDrugFeatureRelatedSuggestions()}



	        		{this.renderSectionList(drug)}
	
	        	</div>
        );
    }
	allergiesFilter = allergy => {
		for(let i = 0; i < this.state.drug.activeSubstance.length; i++) {
			if (this.state.drug.activeSubstance[i].id == allergy.id) {
				return true;
			}
		}
		return false;
	};
    renderAllergiesWarning() {
    	if (!User.isAuthenticated() || !this.state.allergies) {
    		return null;
		}
    	const allergies = [...this.state.allergies];
    	let filteredAllergies = allergies.filter(this.allergiesFilter);


    	return (
    		<div>
				{(filteredAllergies.length == 0) &&
				<div className="alert alert-success" role="alert">
					<span className="glyphicon glyphicon-ok" style={{size:'120%',paddingRight:'30px'}}></span>
					<strong style={{fontSize: '16px'}}>{User.firstname + ',You do not have an allergic reaction risk to the active sustance of this drug.'}</strong>
				</div>
				}
				{filteredAllergies.map(allergy =>
					<div class="alert alert-danger" key={allergy.id} style={{fontSize: '16px', size:'200%',fontWeight:'bold'}} >
						<span className="glyphicon glyphicon-warning-sign" style={{size:'180%',paddingRight:'30px'}}></span>
						{User.firstname},this drug contains {allergy.name} substance, which you are allergic to!!
					</div>
				)}
			</div>
		);

	}
	sideEffectsFilter = sideEffect => {
		for (let i = 0; i < this.state.sufferedChronicDiseases.length; i++) {
			if (this.state.sufferedChronicDiseases[i].id == sideEffect.diseaseGroup.id) {
				return true;
			}
		}
		return false;
	}
	renderDiseaseGroupRelatedSideEffects() {
		const {t}	= this.props;
    	if (!User.isAuthenticated() ){
    		return null;
		}
			if (!this.state.sufferedChronicDiseases || this.state.sufferedChronicDiseases.length == 0){
				return <div className="alert alert-danger">
					<span className="glyphicon glyphicon-remove" style={{size:'130%',paddingRight:'20px'}}></span>
					<strong style={{fontSize: '16px', size:'200%'}}> {User.firstname + ', you can have disease Group'} </strong> </div>
			}
			if (!this.state.drug || !this.state.drug.sideEffects) {
				return <div className="alert alert-danger">
					<span className="glyphicon glyphicon-remove" style={{size:'130%',paddingRight:'20px'}}></span>
					<strong style={{fontSize: '16px', size:'200%'}}> {User.firstname + ', you can have disease Group according to your registration data'} </strong></div>;
		}

		const sideEffects = [...this.state.drug.sideEffects];
		let filteredChronicDiseases = sideEffects.filter(this.sideEffectsFilter)


    	this.state.filteredChronicDiseases = filteredChronicDiseases.map(sideEffect => {
    		if (!sideEffect.showAdditionalInfo) sideEffect.showAdditionalInfo = false;
    		return sideEffect;
		})

		return (
			<div>
				<div className="alert alert-warning">
					<span className="glyphicon glyphicon-exclamation-sign" style={{size:'130%',paddingRight:'20px'}}></span>
					<strong style={{fontSize: '16px', size:'200%'}}> {User.firstname + ', you can have side Effects related to your disease Group'} </strong>
					<a onClick={() => {this.setState({showAdditionalInfoForSideEffects:!this.state.showAdditionalInfoForSideEffects}) }}>
						[{!this.state.showAdditionalInfoForSideEffects && <span>{t('viewDetails')}</span> }
						{this.state.showAdditionalInfoForSideEffects && <span>{t('hideDetails')}</span> }]
					</a>
					{this.state.showAdditionalInfoForSideEffects && this.state.filteredChronicDiseases.map(sideEffect =>
						<div className="alert alert-light" key={sideEffect.id} >
							<strong style ={{color:"black",paddingRight:'25px',fontSize: '16px',paddingLeft:'20px',paddingdown:'20px' }}>{'There are side related to  your disease '+ sideEffect.diseaseGroup.diseaseGroup} </strong>
							<a onClick={() => this.toggleShowAdditionalInfoFor(sideEffect)}>
								[{!sideEffect.showAdditionalInfo && <span>{t('viewDetails')}</span> }
								{sideEffect.showAdditionalInfo && <span>{t('hideDetails')}</span> }]
							</a>
							{sideEffect.showAdditionalInfo &&

							<div style={{backgroundColor : "white",frontSize: '18px',paddingLeft:'30px'}}>

								<div>
									{sideEffect.veryCommon &&
									<span style={{fontSize: '18px', color: '#ff0000', fontWeight: 'bold'}}> Sehr häufig (kann mehr als 1 von 10 Behandelten betreffen): </span>}
									<span>{sideEffect.veryCommon ? sideEffect.veryCommon.substring(12) : undefined } </span>
								</div>
								<div>
									{sideEffect.common &&
									<span style={{
										fontSize: '15px',
										color: '#F95E5E',
										fontWeight: 'bold'
									}}> Häufig (kann bis zu 1 von 10 Behandelten betreffen):  </span>}
									<span style={{fontSize: '15px', fontWeight: 'bold'}}>{sideEffect.common ? sideEffect.common.substring(7) : undefined}</span>
								</div>

								<div >
									{sideEffect.uncommon &&
									<span style={{
										fontSize: '15px',
										color: '#2b2828',
										fontWeight: 'bold'
									}}>Gelegentlich (kann bis zu 1 von 100 Behandelten betreffen): </span>}
									<span style={{fontSize: '15px', fontWeight: 'bold'}}>{sideEffect.uncommon ? sideEffect.uncommon.substring(13) :undefined}</span>
								</div>

								<div>
									{sideEffect.rare &&
									<span style={{
										fontSize: '15px',
										color: '#1a95e7',
										fontWeight: 'bold'
									}}>Selten (kann bis zu 1 von 1.000 Behandelten betreffen): </span>}
									<span style={{fontSize: '15px', fontWeight: 'bold'}}>{sideEffect.rare ? sideEffect.rare.substring(7) :undefined }</span>
								</div>

								<div>
									{sideEffect.veryRare &&
									<span style={{fontSize: '15px', color: '#3ab9d0', fontWeight: 'bold'}}> Sehr selten(kann bis zu 1 von 10.000 Behandelten betreffen): </span>}
									<span style={{fontSize: '15px', fontWeight: 'bold'}}>{sideEffect.veryRare ? sideEffect.veryRare.substring(12) :undefined}</span>
								</div>

								<div>
									{sideEffect.notKnown &&
									<span style={{fontSize: '15px', color: '#939393', fontWeight: 'bold'}}> Nicht bekannt (Häufigkeit auf Grundlage der verfügbaren Daten nicht abschätzbar): </span>}
									<span style={{fontSize: '15px', fontWeight: 'bold'}}>{sideEffect.notKnown ? sideEffect.notKnown.substring(14) :undefined }</span>
								</div>
							</div>
							}

						</div>
					)}
				</div>

			</div>
		);
	}

	renderPharmaceuticalRelatedSuggestions() {
    	if (!User.isAuthenticated() || !this.state.preferredPharmaceuticalForms || !this.state.drug || !this.state.drugs) {
    		return null;
		}

    	for (let i = 0; i < this.state.preferredPharmaceuticalForms.length; i++) {
    		if (this.state.drug.pharmaceuticalForm && this.state.drug.pharmaceuticalForm[0].id == this.state.preferredPharmaceuticalForms[i].id) {
    			return <div className="alert alert-success" role="alert">
					<span className="glyphicon glyphicon-ok" style={{size:'120%',paddingRight:'30px'}}></span>
					<strong style={{fontSize: '16px'}}>{User.firstname + ', this drug have your preffered pharmaceutical form'}</strong>
				</div>;
			}
		}

    	let compatibleDrugs = [...this.state.drugs];
    	compatibleDrugs = compatibleDrugs.filter(drug => {
    		if (!drug.pharmaceuticalForm) return false;
			for (let i = 0; i < this.state.preferredPharmaceuticalForms.length; i++) {
				if (drug.pharmaceuticalForm[0].id == this.state.preferredPharmaceuticalForms[i].id) {
					return true;
				}
			}
			return false;
		})


        let compatibleDrugsCopy = [...compatibleDrugs];

    	const suggestedDrugsListDisease = compatibleDrugs.filter(drug => {
    		if (!drug.disease) {
    			return false;
			}
    		for (let i = 0; i < this.state.drug.disease.length; i++) {
    			for (let j = 0; j < drug.disease.length; j++) {
    				if (this.state.drug.disease[i].id == drug.disease[j].id) {
    					return true;
					}
				}
			}
    		return false

		});

    	const suggestedDrugListSubstance = compatibleDrugsCopy.filter(drug => {
    		if (!drug.activeSubstance) return false;
			for (let i = 0; i < this.state.drug.activeSubstance.length; i++) {
				for (let j = 0; j < drug.activeSubstance.length; j++) {
					if (this.state.drug.activeSubstance[i].id == drug.activeSubstance[j].id) {
						return true;
					}
				}
			}
			return false
		})

		return (
			<div className="alert-custom2 col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{lineHeigh: '140%',paddingBottom:'40px'}}>
				<strong style={{paddingBottom:'30px',paddingtop:'20px',lineHeigh: '200%',fontSize: '18px'}}> This drug is not compatible with your preferred pharmaceutcal form(s)! You can here find drug alternatives that have preffered pharmaceutical forms</strong>
				{suggestedDrugsListDisease.length == 0 &&
					<div> no drug alternative that have the preferred pharmaceutical forms and are to same disease </div>
				}
				{suggestedDrugsListDisease.length > 0 &&
					<div className="row last-visited-items-container">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-muted">
							<strong> alternative drugs that treat the same disease(s) and are compatible with your preferred pharmaceutical form(s):</strong>
						</div>
						{suggestedDrugsListDisease.map(drug => {
							let invocation = {
								drug: drug
							}
							return (
								<DrugMiniature invocation={invocation} key={drug.id}/>
							);
						})}
					</div>
				}
				{suggestedDrugsListDisease.length == 0 &&
				<div> no drug alternative that have the preferred pharmaceutical forms and have the same active substance </div>
				}

				{suggestedDrugListSubstance.length > 0 &&
				<div className="row last-visited-items-container">
					<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-muted">
						<strong> alternative drugs that contain the active substance(s) and are compatible with your preferred pharmaceutical form(s):</strong>
					</div>
					{suggestedDrugListSubstance.map(drug => {
						let invocation = {
							drug: drug
						}
						return (
							<DrugMiniature invocation={invocation} key={drug.id}/>
						);
					})}
				</div>
				}
			</div>
		);
	}

	renderDrugFeatureRelatedSuggestions() {
		if (!User.isAuthenticated() || !this.state.preferredDrugFeature || !this.state.drug || !this.state.drugs) {
			return null;
		}

		let drugFeatures = [...this.state.preferredDrugFeature];
		let compatibleDrugs = [...this.state.drugs];
		compatibleDrugs = compatibleDrugs.filter(drug => {
			if (!drug.disease) {
				return false;
			}
			for (let i = 0; i < this.state.drug.disease.length; i++) {
				for (let j = 0; j < drug.disease.length; j++) {
					if (this.state.drug.disease[i].id == drug.disease[j].id) {
						return true;
					}
				}
			}
			return false

		});
		let drugFeatures1 = [...this.state.preferredDrugFeature];
		drugFeatures1.filter(drugFeature => {
			if (!this.state.drug.drugFeature) {
				return false;
			}
			for (let i = 0; i < this.state.drug.drugFeature.length; i++) {
				if (drugFeature.id == this.state.drug.drugFeature[i].id) return true;
			}
			return false;
		})
		return (
			<div >
				{drugFeatures1.length > 0 &&
				<div className="alert alert-success" role="alert">
					<span className="glyphicon glyphicon-ok" style={{size:'120%',paddingRight:'30px'}}></span>
					<strong style={{fontSize: '16px'}}>{User.firstname + ', This drug is compatible with:'} <span>{drugFeatures1.map(drugFeature =>(<span>{drugFeature.drugFeature} </span>)).reduce((prev, curr) => [prev, ', ', curr])}</span> </strong>
				</div>}
					{drugFeatures.filter(drugFeature => {
						if (!this.state.drug.drugFeature) {
							return true;
						}
						for (let i = 0; i < this.state.drug.drugFeature.length; i++) {
							if (drugFeature.id == this.state.drug.drugFeature[i].id) return false;
						}
						return true;
					}).map(drugFeature => {
						let compDrugs = [...compatibleDrugs];
						compDrugs = compDrugs.filter(drug => {
							if (!drug.drugFeature) return false;
							for (let i = 0; i < drug.drugFeature.length; i++) {
								if (drug.drugFeature[i].id == drugFeature.id) return true;
							}
							return false;
						})
						if (compDrugs.length==0){
							return(
								<div className=" col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{marginBottom:'30px',marginTop:'30px'}}>
								<div style={{color:'#000000',backgroundColor:'#f6dfdf', fontSize: '15px',lineHeight: '250%' }}>
									<span className="glyphicon glyphicon-remove-sign" style={{size:'120%',paddingRight:'10px',paddingLeft:'25px'}}></span>
									<span>This drug does is not compliant with the drug feature  </span>
									<span style={{fontWeight: '700',size:'110%' }}>{drugFeature.drugFeature} </span>
									<span> from your preferences! and There is no alternatives to this drug that have this drug fearture</span>
								</div>
								</div>
									)
						}
						return (
							<div className="alert-custom col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{marginBottom:'30px',marginTop:'30px'}}>
								<div style={{lineHeight: '140%'}}>
								<div style={{color:'#000000',backgroundColor:'#f6dfdf', fontSize: '15px',lineHeight: '250%' }}>
									<span className="glyphicon glyphicon-remove-sign" style={{size:'120%',paddingRight:'10px',paddingLeft:'25px'}}></span>
								<span>This drug does is not compliant with the drug feature  </span>
									<span style={{fontWeight: '700',size:'110%' }}>{drugFeature.drugFeature} </span>
										<span> from your preferences!</span>
								</div>
								{(compDrugs.length == 0) && <strong style={{paddingBottom:'30px',paddingtop:'20px',paddingLeft:'40px',lineHeight: '200%',fontSize: '15px'}}> No Alternative to this prefered drug feature</strong>}
								{(compDrugs.length > 0) && <div className="row last-visited-items-container">
									<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-muted"style={{paddingTop:'10px'}} >
										<div style={{ fontWeight: 'bold'}}>possible alternative drugs that exhibit the drug feature {drugFeature.drugFeature} are:</div>
									</div>
									{compDrugs.map(drug => {
										let invocation = {
											drug: drug
										}
										return (
											<DrugMiniature style={{padding:'10px'}} invocation={invocation} key={drug.id}/>
										);
									})}
								</div>}
								</div>
							</div>


						);

					}
					)
				}

			</div>
		);
	}
}

export default translate()(DrugDetail);