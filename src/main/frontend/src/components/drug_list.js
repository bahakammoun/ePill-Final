import axios from "axios";
import React from "react";
import Box from '@material-ui/core/Box';
import {BugTwoTone} from '@ant-design/icons';
import Moment from 'moment';

import { Accordion, AccordionTab } from 'primereact/accordion';
import {MultiSelect} from 'primereact/multiselect';
import {Slider} from 'primereact/slider';
import {Card} from 'primereact/card';
import {Fieldset} from 'primereact/fieldset';
import {Panel} from 'primereact/panel';
import {Checkbox} from 'primereact/checkbox';
import {InputNumber} from 'primereact/inputnumber';
import {RadioButton} from 'primereact/radiobutton';
import { AutoComplete } from 'primereact/autocomplete';
import {Link} from "react-router-dom";
import {translate} from "react-i18next";
import { toast } from 'react-toastify';
import Badge from 'react-bootstrap/Badge'
import EmptyList from "./empty_list";
import Loading from "./loading";
import User from "./../util/User";
import {Dropdown} from 'primereact/dropdown';





class DrugList extends React.Component {
    constructor(props) {
        super(props);

        this.sortByName = this.sortByName.bind(this);

        this.state = {
            drugs		: [],
            interactions	: '',
            cmd			: '',
            loading		: false,
            Allergies: [],
            Age: 0.0,
            gender: null,
            SymptomesData: [],
            filteredSymptomesMultiple: null,
            selectedSymptomes: [],
            selectedDiseases: [],
            filteredDrugs: [],
            diseases: [],
            size	: 0,
            weight : 0.0,
            allergyCheck : false,
            allergies: [],
            allAllergies: [],
            allActiveSubstances: [],
            selectedActiveSubstances: [],
            selectedOrder: {label: 'Order by alphabet ', id: 2, sortMethod: this.sortByName},

            drugFeaturesCheck : false,
            drugFeatures: [],
            chronicDiseasesCheck  : false,
            chronicDiseases: [],
            sufferedChronicDiseases: [],

            pharmaceuticalFormsCheck : false,
            pharmaceuticalForms: [],
            checked: false,
            preferredPharmaceuticalForms : [],
            preferredDrugFeature : [],


        }

        this.checkForInteractions	= this.checkForInteractions.bind(this);
        this.addToRememberList		= this.addToRememberList.bind(this);
        this.removeFromRememberList	= this.removeFromRememberList.bind(this);
        this.addToTakingList			= this.addToTakingList.bind(this);
        this.removeFromTakingList	= this.removeFromTakingList.bind(this);
        this.filterSymptomesMultiple = this.filterSymptomesMultiple.bind(this);
        this.renderDiseasesList = this.renderDiseasesList.bind(this);
        this.handleSizeChange	= this.handleSizeChange.bind(this);
        this.handleWeightChange	= this.handleWeightChange.bind(this);
        this.handleAllergyChange	= this.handleAllergyChange.bind(this);
        this.handleChronicDiseasesChange	= this.handleChronicDiseasesChange.bind(this);
        this.handleChronicDiseasesChange	= this.handleChronicDiseasesChange.bind(this);
        this.handleSymptomsChange = this.handleSymptomsChange.bind(this);

        this.handleDrugFeatureChange =this.handleDrugFeatureChange.bind(this);
        this.handlePharmaceuticalFormChange =this.handlePharmaceuticalFormChange.bind(this);
        this.onOrderChange= this.onOrderChange.bind(this)

        this.filterBySymptoms = this.filterBySymptoms.bind(this);
        this.filterByAllergies = this.filterByAllergies.bind(this);
        this.filterByActiveSubstance = this.filterByActiveSubstance.bind(this);
        this.filterByPharmaceuticalForms = this.filterByPharmaceuticalForms.bind(this);
        this.filterByDrugFeatures = this.filterByDrugFeatures.bind(this);

        this.filterAll = this.filterAll.bind(this);

        this.carTemplate = this.carTemplate.bind(this);
        this.selectedCarTemplate = this.selectedCarTemplate.bind(this);
        this.drugFeatureTemplate = this.drugFeatureTemplate.bind(this);
        this.selectedDrugFeatureTemplate = this.selectedDrugFeatureTemplate.bind(this);

        this.toggleShowAdditionalInfoFor = this.toggleShowAdditionalInfoFor.bind(this);
        this.checkIsAllergic = this.checkIsAllergic.bind(this);

    }

    filterDrugs(drugs) {
        // return drugs.filter(drug => drug.name.startsWith("A"));
        return drugs;

    }

    setCmd() {

        var path= this.props.location.pathname.split('/');
        var cmd	= path[path.length-1];

        this.state.cmd = cmd;
        this.state.interactions = '';
        this.state.loading	= true;
        this.setState(this.state);

        switch(this.state.cmd) {
            case 'taking':
                axios.get('/drug/list/taking')
                    .then(({data}) => {
                        this.state.drugs = data.value;
                        this.state.loading	= false;
                        this.setState(this.state);
                        this.checkForInteractions();
                    });
                break;
            case 'remember':
                axios.get('/drug/list/remember')
                    .then(({data}) => {
                        this.state.drugs = data.value;
                        this.state.loading	= false;
                        this.setState(this.state);
                        this.checkForInteractions();
                    });
                break;
            case 'list':
                axios.get('/drug/list/all')
                    .then(({data, status}) => {
                        this.state.drugs = data.value;
                        console.log("drugs: ", data);
                        this.state.filteredDrugs = this.filterDrugs(data.value);

                        // this.state.diseases = this.renderDiseasesList(this.state.filteredDrugs);

                        this.state.loading	= false;
                        this.setState(this.state);
                    });
                break;
            default:
                axios.get('/drug/search', { params : { exp : "ac" }})
                    .then(({data}) => {
                        this.state.drugs = data.value;
                        this.state.filteredDrugs = this.filterDrugs(this.state.drugs);
                        this.state.loading	= false;
                        this.setState(this.state);
                    });
                break;
        }
    }
    // This function is for filter.
    componentDidMount() {


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
                if (this.state.gender && this.state.gender.id == 1) {
                    this.state.drugFeatures = this.state.drugFeatures.filter(item => (item.id !== 8));
                }
                if (this.state.age) {
                    this.state.drugFeatures = this.state.drugFeatures.filter(item => !(item.minAge && (this.state.age < item.minAge)));
                }
            });

        axios.get("/activeSubstance/all")
            .then(({data, status})  => {
                console.log(data);
                this.state.allAllergies = data.value;
                this.state.allActiveSubstances = data.value;
                console.log("All Active Substance",this.state.allActiveSubstances);

            });
        axios.get("/disease/all")
            .then(({data, status}) => {
                console.log("all diseases", data);
                this.state.diseases = data.value;
                console.log("All disease",this.state.diseases);
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


        if(!User.isAuthenticated()) {
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
                };

                if (this.state.gender && this.state.gender.id == 1) {
                    this.state.drugFeatures = this.state.drugFeatures.filter(item =>(item.id !== 8));
                }

                this.state.drugFeatures = this.state.drugFeatures.filter(item => !(item.minAge && (this.state.age < item.minAge)));






                console.log(data);
                console.log(this.state.allergies);
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

    carTemplate(option) {
        const logoPath = "./../../assets/icons/pharmaceuticalforms/"+option.id + ".png";

        console.log("path to image: ", logoPath);

        return (
            <div className="p-clearfix">
                <img alt={option.name} src={logoPath}
                     style={{width: '24px', verticalAlign: 'middle'}}/>
                <span style={{fontSize: '1em', float: 'right', marginTop: '4px'}}>{option.name}</span>
            </div>
        );
    }

    selectedCarTemplate(value) {
        if (value) {
            const logoPath = "./../../assets/icons/pharmaceuticalforms/"+value.id + ".png";
            console.log("path to image: ", logoPath);

            return (
                <div className="my-multiselected-item-token">
                    <img alt={value.name} src={logoPath} style={{width:'20px', verticalAlign:'middle', marginRight:'.5em'}} />
                    <span>{value.name}</span>
                </div>
            );
        }
        else {
            return <span className="my-multiselected-empty-token">Choose</span>
        }
    }

    drugFeatureTemplate(option) {
        const logoPath = "./../../assets/icons/"+option.id + ".svg";

        console.log("path to image: ", logoPath);

        return (
            <div className="p-clearfix">
                <img alt={option.drugFeature} src={logoPath}
                     style={{width: '24px', verticalAlign: 'middle'}}/>
                <span style={{fontSize: '1em', float: 'right', marginTop: '4px'}}>{option.drugFeature}</span>
            </div>
        );
    }

    selectedDrugFeatureTemplate(value) {
        if (value) {
            const logoPath = "./../../assets/icons/"+value.id + ".svg";
            console.log("path to image: ", logoPath);

            return (
                <div className="my-multiselected-item-token">
                    <img alt={value.drugFeature} src={logoPath} style={{width:'20px', verticalAlign:'middle', marginRight:'.5em'}} />
                    <span>{value.drugFeature}</span>
                </div>
            );
        }
        else {
            return <span className="my-multiselected-empty-token">Choose</span>
        }
    }

    onOrderChange(e) {
        // handle order by history
        if (e.value.id === 5) {
            axios.get("disease/frequentlyVisited")
                .then(({data, status}) => {
                    console.log("frequent diseases: ", data);
                   if (!data) {
                       return;
                   }
                   this.state.drugs.forEach(drug => {
                       drug.count = 0;
                       if (drug.disease && drug.disease.length > 0) {
                           for (let i = 0; i < drug.disease.length; i++) {
                               for (let j = 0; j < data.length; j++) {
                                   if (drug.disease[i].id == data[j].disease.id) {
                                       drug.count += data[j].counter;
                                   }
                               }
                           }
                       }
                   });
                   this.setState({drugs: this.state.drugs, selectedOrder: e.value});
                });
            return;
        }

        this.setState({selectedOrder: e.value});
    }

    filterSymptomesMultiple(event) {
        setTimeout(() => {
            let results = this.state.SymptomesData.filter((Symptomes) => {
                return Symptomes.toLowerCase().startsWith(event.query.toLowerCase());
            });

            this.setState({ filteredSymptomesMultiple: results });
        }, 250);
    }

    filterBySymptoms = drug => {
        if (!this.state.selectedDiseases || this.state.selectedDiseases.length === 0) return true;
        // console.log("filter by symptoms, selectedDiseases: ", this.state.selectedDiseases);
        if (drug.disease) {
            for (let i = 0; i < drug.disease.length; i++) {
                for (let j = 0; j < this.state.selectedDiseases.length; j++) {
                    if (this.state.selectedDiseases[j].id === drug.disease[i].id) return true;
                }
            }
        }
        return false;
    }

    filterByAllergies = drug => {
        let drugActiveSubstances = drug.activeSubstance;
        if (!drugActiveSubstances) {
            return true;
        }
        for (let i = 0; i < drugActiveSubstances.length; i++) {
            for (let j = 0; j < this.state.allergies.length; j++) {
                if (drugActiveSubstances[i].id === this.state.allergies[j].id) return false;
            }
        }
        return true;
    }

    filterByActiveSubstance = drug => {
        if (!this.state.selectedActiveSubstances || this.state.selectedActiveSubstances.length === 0){
            return true;
        }
        let drugActiveSubstances = drug.activeSubstance;
        if (!drugActiveSubstances) return false;
        for (let i = 0; i < drugActiveSubstances.length; i++) {
            for (let j = 0; j < this.state.selectedActiveSubstances.length; j++) {
                if (drugActiveSubstances[i].id === this.state.selectedActiveSubstances[j].id) return true;
            }
        }
        return false;
    }


    filterByPharmaceuticalForms = drug => {

        let selectedpharmaceuticalForms = [...this.state.pharmaceuticalForms]
        selectedpharmaceuticalForms = selectedpharmaceuticalForms.filter(item => item.isChecked);
        if (!selectedpharmaceuticalForms || selectedpharmaceuticalForms.length === 0 || selectedpharmaceuticalForms.length === this.state.pharmaceuticalForms){
            return true;
        }
        if (drug.pharmaceuticalForm) {
            for (let i = 0; i < drug.pharmaceuticalForm.length; i++) {
                for (let j = 0; j < selectedpharmaceuticalForms.length; j++) {
                    if (selectedpharmaceuticalForms[j].id === drug.pharmaceuticalForm[i].id) return true;
                }
            }
        }
        return false;

    }

    filterByDrugFeatures = drug => {
        let selectedDrugFeatures = [...this.state.drugFeatures];
        selectedDrugFeatures = selectedDrugFeatures.filter(item => item.isChecked);
        if (!selectedDrugFeatures || selectedDrugFeatures.length === 0 || selectedDrugFeatures.length === this.state.drugFeatures.length ) return true;
        if (drug.drugFeature) {
            for (let i = 0; i < drug.drugFeature.length; i++) {
                for (let j = 0; j < selectedDrugFeatures.length; j++) {
                    if (selectedDrugFeatures[j].id === drug.drugFeature[i].id) return true;
                }
            }
        }
        return false;
    }

    filterAll() {
        return this.state.drugs.filter(this.filterBySymptoms)
            .filter(this.filterByAllergies)
            .filter(this.filterByActiveSubstance)
           .filter(this.filterByPharmaceuticalForms)
            .filter(this.filterByDrugFeatures);
    }

    sortByName = (a, b) => (a.name > b.name) ? 1 : -1;

    sortBySymptoms = (a, b) => (this.getSymptomsCount(a) <= this.getSymptomsCount(b)) ? 1 : -1;

    sortByHistory = (a, b) => (a.count <= b.count) ? 1 : -1;

    sortByDrugFeatures = (a, b) => (this.getDrugFeaturesCount(a) <= this.getDrugFeaturesCount(b)) ? 1 : -1;

    getSymptomsCount(drug) {
        if (!drug.disease) return 0;
        let x = 0;
        for (let i = 0; i < this.state.selectedDiseases.length; i++) {
            for (let j = 0; j < drug.disease.length; j++) {
                if (drug.disease[j].id === this.state.selectedDiseases[i].id) x++;
            }
        }
        console.log("drug count ", drug);
        console.log(x);
        return x;
    }

    getDrugFeaturesCount(drug) {
        if (!drug.drugFeature) return 0;
        let x = 0;
        for (let i = 0; i < this.state.drugFeatures.length; i++) {
            for (let j = 0; j < drug.drugFeature.length; j++) {
                if (this.state.drugFeatures[i].isChecked && drug.drugFeature[j].id === this.state.drugFeatures[i].id) x++;
            }
        }
        console.log("drug count ", drug);
        console.log(x);
        return x;
    }

    // This function is called before render() to initialize its state.
    componentWillMount() {
        this.setCmd();
    }

    componentWillReceiveProps(props){
        this.props = props;
        this.setCmd();
    }
    suggestAllergies(event) {
        let results = this.state.allAllergies.filter((allergy) => {
            return allergy.name.toLowerCase().startsWith(event.query.toLowerCase());
        });

        this.setState({ allergySuggestions: results });
    }

    handlePharmaceuticalFormChange(event) {
        this.state.pharmaceuticalForms = this.state.pharmaceuticalForms.map(item => {item.isChecked = false; return item;});
        for (let i = 0; i < event.value.length; i++) {
            let pharmaceuticalForm = event.value[i];
            for (let j = 0; j < this.state.pharmaceuticalForms.length; j++) {
                if (this.state.pharmaceuticalForms[j].id === pharmaceuticalForm.id) {
                    this.state.pharmaceuticalForms[j].isChecked = true;
                    break;
                }
            }
        }
        this.setState({pharmaceuticalForms : this.state.pharmaceuticalForms});
    }
    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current });
    };

    handleDrugFeatureChange(event) {
        this.state.drugFeatures = this.state.drugFeatures.map(item => {item.isChecked = false; return item;});
        for (let i = 0; i < event.value.length; i++) {
            let drugFeature = event.value[i];
            for (let j = 0; j  < this.state.drugFeatures.length; j++) {
                if (this.state.drugFeatures[j].id === drugFeature.id) {
                    this.state.drugFeatures[j].isChecked = true;
                    break;
                }
            }
        }

        this.setState({drugFeatures: this.state.drugFeatures});
    }
    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current });
    };

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
        this.state.chronicDiseases = this.state.chronicDiseases.map(item => {item.isChecked = false; return item;});
        for (let i = 0; i < event.value.length; i++) {
            let disease = event.value[i];
            for (let j = 0; j  < this.state.chronicDiseases.length; j++) {
                if (this.state.chronicDiseases[j].id === disease.id) {
                    this.state.chronicDiseases[j].isChecked = true;
                    break;
                }
            }
        }

        this.setState({chronicDiseases: this.state.chronicDiseases});

    }

    handleSymptomsChange(event) {
        for (let i = 0; i < event.value.length; i++) {
            let b = true;
            for (let j = 0; j < this.state.selectedDiseases; j++) {
                if (event.value[i].id === this.state.selectedDiseases[j].id) {
                    b = false
                    break;
                }
            }
            if (b) {
                axios.post(`/disease/invoke/${event.value[i].id}`).then(r => {return})
            }
        }
        this.setState({selectedDiseases: event.value})
    }




    createMarkup(text) { return {__html: text}; };

    //=============================


    toggleTaking(drug) {
        if(drug.isTaken) {
            this.removeFromTakingList(drug);
        } else {
            this.addToTakingList(drug);
        }
    }

    addToTakingList(drug) {
        axios.post('/drug/taking/add', { id : drug.id }, {
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
                        var idx = this.state.drugs.indexOf(drug);
                        drug.isTaken = !drug.isTaken;
                        this.state.drugs[idx] = drug;
                        this.setState(this.state);
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

    removeFromTakingList(drug) {
        axios.post('/drug/taking/remove', { id : drug.id }, {
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

                        var idx = this.state.drugs.indexOf(drug);
                        if(this.state.cmd != 'taking') {
                            drug.isTaken = !drug.isTaken;
                            this.state.drugs[idx] = drug;
                            this.setState(this.state);
                        } else {
                            this.state.drugs.splice(idx, 1);
                        }

                        this.setState(this.state);
                        this.checkForInteractions();
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



    toggleRemember(drug) {
        if(drug.isRemembered) {
            this.removeFromRememberList(drug);
        } else {
            this.addToRememberList(drug);
        }
    }

    addToRememberList(drug) {
        axios.post('/drug/remember/add', { id : drug.id }, {
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
                        var idx = this.state.drugs.indexOf(drug);
                        drug.isRemembered = !drug.isRemembered;
                        this.state.drugs[idx] = drug;
                        this.setState(this.state);
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

    removeFromRememberList(drug) {
        axios.post('/drug/remember/remove', { id : drug.id }, {
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
                        var idx = this.state.drugs.indexOf(drug);

                        if(this.state.cmd != 'remember') {
                            drug.isRemembered = !drug.isRemembered;
                            this.state.drugs[idx] = drug;
                            this.setState(this.state);
                        } else {
                            this.state.drugs.splice(idx, 1);
                            this.checkForInteractions();
                        }

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


    deleteDrug(id) {
        // ES6 string interpolation (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/template_strings)
        // No error handling for now, e.g. if the user is not authenticated.
        axios.delete(`/drugs/delete/${id}`)
            .then((data) => {
                // Remove post from list of posts.
                const posts = this.state.posts.filter(e => e.id != id);
                this.setState({
                    drugs: drugs
                })
            });
    }

    toggleShowAdditionalInfoFor(sideEffect, drug) {
        console.log("toggleSHow Activated drug:", drug);
        console.log("toggleSHow Activated sideEffect:", sideEffect);
        for (let i = 0; i  < this.state.filteredDrugs.length; i++) {
            if (drug.id == this.state.filteredDrugs[i].id) {
                console.log("Found the drug Toggle!!", this.state.filteredDrugs[i])
                for (let j = 0; j < this.state.filteredDrugs[i].sideEffects.length; j++) {
                    if (sideEffect.id == this.state.filteredDrugs[i].sideEffects[j].id) {
                        console.log("Found the side effect!! Toggle: ", this.state.filteredDrugs[i].sideEffects[j]);
                        this.state.filteredDrugs[i].sideEffects[j].showAdditionalInfo = !this.state.filteredDrugs[i].sideEffects[j].showAdditionalInfo;
                        break;
                    }
                }
                break;
            }
        }
        console.log("After Toggle:", this.state.filteredDrugs);
        this.setState(this.state)
    }

    //============================

    checkForInteractions() {
        axios.get(`/drug/interactions/${this.state.cmd}`).then(({data}) => {
            this.state.interactions = data.value;
            this.setState(this.state);
        });
    }


    //=============================


    renderPharmaceuticalForms(pharmaceuticalForms) {
        return pharmaceuticalForms.map(( (pharmaceuticalForm, i) => {

            return (
                <div>
                    <div className="p-col-4" key={pharmaceuticalForm.id} style={{lineHeight:'2'}}>

                        <Checkbox  inputId={`${pharmaceuticalForm.id}`} onChange={this.handlePharmaceuticalFormChange} value={pharmaceuticalForm.name} checked={pharmaceuticalForm.isChecked} />

                        <label htmlFor="cb1" className="p-checkbox-label">{pharmaceuticalForm.name}</label>
                    </div>
                </div>
            );
        }));
    }
    // renderDrugFeatures(drugFeatures) {
    //     return drugFeatures.map(( (drugFeature, i) => {
    //
    //         return (
    //
    //             <div className="p-col-4" key={drugFeature.id} style={{lineHeight:'2'}}>
    //                 <Checkbox  inputId={`${drugFeature.id}`} onChange={this.handleDrugFeatureChange} value={drugFeature.drugFeature} checked={drugFeature.isChecked} />
    //                 <label htmlFor="cb1" className="p-checkbox-label">{drugFeature.drugFeature}</label>
    //                 <div>ready</div>
    //
    //             </div>
    //         );
    //     }));
    // }

    renderDrugFeatures(drug) {
        if(!drug.drugFeature) {
            return null;
        }

        return (
            <div className="drug-features pull-right">
                { drug.drugFeature.filter(item => !(this.state.gender && (this.state.gender.id == 1) && (item.id == 8)) && !(this.state.age && item.minAge && (this.state.age < item.minAge))).map(feature => {
                    let imageStyle = {};
                    let b = false;
                    for (let i = 0; i < this.state.drugFeatures.length; i++) {
                        if (feature.id == this.state.drugFeatures[i].id) {
                            b = this.state.drugFeatures[i].isChecked;
                            break;
                        }
                    }
                    if (b) {
                        imageStyle = {
                            // border: "2px solid #ddd",
                            // borderRadius: "30px",
                            // borderWidth: "2px",
                            // borderColor: "green"
                            opacity: 7,
                        }
                    }
                    else {
                        imageStyle = {
                        opacity: 0.3,
                        }
                    }
                    return (<img key={feature.id} src={"./../../assets/icons/"+feature.id + ".svg"} className="drug-feature-icon" alt={feature.drugFeature} title={feature.drugFeature} style={{...imageStyle}}></img>);
                } ) }
            </div>

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
            <section className="diseases" style={{ border : "2px solid", borderRadius: "5px"}}>
                {drug.pharmaceuticalForm.map(pharmaceuticalForm => <div>
                    <img key={pharmaceuticalForm.id + 100} src={"./../../assets/icons/pharmaceuticalforms/"+pharmaceuticalForm.id + ".png"} className="drug-feature-icon" alt={pharmaceuticalForm.name} title={pharmaceuticalForm.name} style={{ width: "10%"}}></img>
                    <span key={pharmaceuticalForm.id}>{pharmaceuticalForm.name}</span>
                </div>  )
                    .reduce((prev, curr) => [prev, ', ', curr]) }
            </section>
        );
    }

    renderActiveSubstance(drug) {
        if(!drug.activeSubstance) {
            return;
        }

        const {t} = this.props;

        return (
            <p> {t('activeSubstance')+": "}
                { drug.activeSubstance.map(substance => <span key={substance.id}>{substance.name}</span> )
                    .reduce((prev, curr) => [prev, ', ', curr]) }
            </p>
        );
    }

    renderSideEffects(drug) {
        if(!drug.sideEffects) {
            return;
        }

        const {t} = this.props;
        let sideEffects = [...drug.sideEffects];
        return (

            <div>
                {
                    sideEffects.filter(sideEffect => {
                        for (let i = 0; i < this.state.chronicDiseases.length; i++) {
                            if (this.state.chronicDiseases[i].id == sideEffect.diseaseGroup.id)  {
                                return this.state.chronicDiseases[i].isChecked;
                            }
                        }
                        return false;
                    })
                    // .map(sideEffect => <span key={sideEffect.id}>{sideEffect.diseaseGroup.diseaseGroup}</span> )
                    .map(sideEffect =>
                        <div className="alert alert-warning" key={sideEffect.id}>
                            {User.firstname + ', diese medikament kann Nebenwirkungen in Zusammenhang zu deiner '}
                            <b style={{color:'#472508',marginRight:'10px'}}>{sideEffect.diseaseGroup.diseaseGroup}</b>
                            <p style={{textAlign: "right"}}>
                            <a onClick={() => this.toggleShowAdditionalInfoFor(sideEffect, drug)} >
                                [{!sideEffect.showAdditionalInfo && <span>{t('viewDetails')}</span> }
                                {sideEffect.showAdditionalInfo && <span>{t('hideDetails')}</span> }]
                            </a>
                            </p>
                            {sideEffect.showAdditionalInfo &&
                            <div>
                                <div style={{backgroundColor : "white"}}>

                                    <div>
                                        {sideEffect.veryCommon &&
                                        <span style={{fontSize: '15px', color: '#ff0000', fontWeight: 'bold'}}> Sehr häufig: </span>}
                                        <span>{sideEffect.veryCommon ? sideEffect.veryCommon.substring(12) : undefined } </span>
                                    </div>
                                    <div>
                                        {sideEffect.common &&
                                        <span style={{
                                            fontSize: '15px',
                                            color: '#F95E5E',
                                            fontWeight: 'bold'
                                        }}> Häufig: </span>}
                                        <span>{sideEffect.common ? sideEffect.common.substring(7) : undefined}</span>
                                    </div>

                                    <div >
                                        {sideEffect.uncommon &&
                                        <span style={{
                                            fontSize: '15px',
                                            color: '#2b2828',
                                            fontWeight: 'bold'
                                        }}>Gelegentlich: </span>}
                                        <span style={{fontSize: '15px'}}>{sideEffect.uncommon ? sideEffect.uncommon.substring(13) :undefined}</span>
                                    </div>

                                    <div>
                                        {sideEffect.rare &&
                                        <span style={{
                                            fontSize: '15px',
                                            color: '#1a95e7',
                                            fontWeight: 'bold'
                                        }}>Selten: </span>}
                                        <span style={{fontSize: '15px'}}>{sideEffect.rare ? sideEffect.rare.substring(7) :undefined }</span>
                                    </div>

                                    <div>
                                        {sideEffect.veryRare &&
                                        <span style={{fontSize: '15px', color: '#3ab9d0', fontWeight: 'bold'}}>Sehr selten: </span>}
                                        <span style={{fontSize: '15px'}}>{sideEffect.veryRare ? sideEffect.veryRare.substring(12) :undefined}</span>
                                    </div>

                                    <div>
                                        {sideEffect.notKnown &&
                                        <span style={{fontSize: '15px', color: '#939393', fontWeight: 'bold'}}>Nicht bekannt: </span>}
                                        <span style={{fontSize: '15px'}}>{sideEffect.notKnown ? sideEffect.notKnown.substring(14) :undefined }</span>
                                    </div>


                                </div>
                            </div>
                            }

                        </div> )
                }
            </div>
        );
    }

    renderChronicDiseases(chronicDiseases) {
        return chronicDiseases.map(( (chronicDisease,ind) => {
            // console.log("chronic!!");
            // console.log(chronicDisease);
            return (
                <div className="p-col-4" key={chronicDisease.id} style={{lineHeight:'2'}}>
                    <Checkbox  inputId={`${chronicDisease.id}`} onChange={this.handleChronicDiseasesChange} value={chronicDisease.diseaseGroup} checked={chronicDisease.isChecked} />
                    <MultiSelect optionLabel="name" value={this.state.sufferedChronicDiseases} options={this.state.chronicDiseases} maxSelectedLabels={1} onChange={(e) =>this.setState({sufferedChronicDiseases: e.value})} style={{minWidth:'12em'}} filter={true} filterPlaceholder="Search" placeholder="Choose" />

                    <label htmlFor="cb1" className="p-checkbox-label">{chronicDisease.diseaseGroup}</label>
                </div>);
        }));
    }


    renderDrugs(drugs) {

        this.state.filteredDrugs.sort(this.state.selectedOrder.sortMethod);
        return this.state.filteredDrugs.map((drug => {

            return (


                <li className="row" key={drug.id}>
                    <div className="image-container hidden-xs col-sm-4 col-md-3 col-lg-4 no-padding">
                        <Link to={`/drug/${drug.id}`}>
                            <img className="featurette-image img-responsive center-block" alt={drug.name} title={drug.name} src={`/image/drug/${drug.id}`}></img>
                        </Link>
                    </div>
                    <div className="image-container col-xs-12 col-sm-8 col-md-9 col-lg-8 no-padding">
                        <div className="info">

                            {this.renderDrugFeatures(drug)}

                            <Link to={`/drug/${drug.id}`}>
                                <h4>{ drug.name }</h4>

                            </Link>

                            {this.renderPharmaceuticalForm(drug)}



                            <Box bgcolor="green" color="secondary.contrastText" p={0}>

                                {this.renderDisease(drug)}
                            </Box>

                            <Box bgcolor="secondary.main" color="secondary.contrastText" p={0}>
                                {this.renderActiveSubstance(drug)}
                            </Box>

                                {this.renderSideEffects(drug)}


                            {drug.personalizedInformation && <section className="minimum-summary" dangerouslySetInnerHTML={this.createMarkup(drug.personalizedInformation)} />}

                        </div>
                        <div className="action-pattern">
                            {User.isAuthenticated() &&
                            <ul>
                                <li>
                                    <button type="button" className="btn btn-xs btn-like" onClick={() => this.toggleTaking(drug)}>
                                        <span className={"glyphicon white "+(drug.isTaken ? 'glyphicon-minus' : 'glyphicon-heart' )}></span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="btn btn-xs btn-add" onClick={() => this.toggleRemember(drug)}>
                                        <span className={"glyphicon white "+ (drug.isRemembered ? 'glyphicon-minus' : 'glyphicon-plus' )}></span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="btn btn-xs btn-open">
                                        <Link to={`/drug/${drug.id}`}>
                                            <span className="glyphicon glyphicon-eye-open white"></span>
                                        </Link>
                                    </button>
                                </li>
                            </ul>
                            }
                        </div>
                    </div>
                </li>
            );
        }));
    }


    renderFilterColumn() {
        const cardStyles = {
            color: "#01422B",
            borderColor: "#369D79"
        };




        return (

            <Card style={cardStyles} title={'Search  filter'}>

                {/*<Accordion multiple={true}>*/}

                <Panel headerClassName="Filterheader" header="search drug by" >
                    <Fieldset legend="Symptome" >

                        <MultiSelect optionLabel="name" value={this.state.selectedDiseases} options={this.state.diseases} maxSelectedLabels={1} onChange={this.handleSymptomsChange} style={{minWidth:'12em'}} filter={true} filterPlaceholder="Search" placeholder="Choose" />

                        <div>
                            {this.state.selectedDiseases ? this.state.selectedDiseases.map(disease => {
                                return <Card style={{backgroundColor: "#2D8000", color:'white',fontWeight:'bold', margin:'10px'}} key={disease.id}>{disease.name}</Card>
                            }) :[]}
                        </div>


                    </Fieldset>
                    <Fieldset legend="active substance" >

                        <MultiSelect optionLabel="name" value={this.state.selectedActiveSubstances} options={this.state.allActiveSubstances} maxSelectedLabels={1} onChange={(e) =>this.setState({selectedActiveSubstances: e.value})} style={{minWidth:'12em'}} filter={true} filterPlaceholder="Search" placeholder="Choose" />
                        <div>
                            {this.state.selectedActiveSubstances ? this.state.selectedActiveSubstances.map(activeSubstance => {
                                return <Card style={{backgroundColor: "#ED2B56", color:'white',fontWeight:'bold', margin:'10px'}} key={activeSubstance.id}>{activeSubstance.name}</Card>
                            }) :[]}
                        </div>

                    </Fieldset>




                </Panel>


                <Panel headerClassName="Filterheader" header="filter using disease Group and Allergies">

                    <Fieldset legend="Disease Groups" >


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
                                <MultiSelect optionLabel="diseaseGroup" value={this.state.chronicDiseases.map(x => x).filter(item => item.isChecked)} options={this.state.chronicDiseases} maxSelectedLabels={4} onChange={this.handleChronicDiseasesChange} style={{minWidth:'12em'}} filter={true} filterPlaceholder="Search" placeholder="Choose" />

                                {/*<p>Selected all Diseases : {this.state.chronicDiseases.filter(item => item.isChecked).map((chronicDisease) => <span style={{fontWeight: 'bold'}} key={chronicDisease.id}>{chronicDisease.diseaseGroup} </span>)}</p>*/}
                            </div>
                            :
                            <div></div>
                        }

                        {/*<h3>Size</h3>*/}
                        {/*<InputNumber type="text" name="size" id="size" value={this.state.size} onChange={(e) => this.setState({size: e.value})} suffix=" cm" />*/}
                        {/*<h3>weight</h3>*/}
                        {/*<InputNumber type="text" name="weight" id="weight" value={this.state.weight} onChange={(e) => this.setState({weight: e.value})} suffix=" Kg" />*/}



                    </Fieldset>
                    <Fieldset legend="Allergies" >
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
                                <div className="p-col-4 p-md-4"  style={{lineHeight:'2'}}>
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

                    </Fieldset>
                </Panel>
                <Panel headerClassName="Filterheader" header="filter using drug preferences">
                    <Fieldset legend="Dosage Forms" >
                        <div className="p-formgroup-inline">
                            <div className="p-field p-col-4 p-md-4">
                                <RadioButton inputId="rb1" name="pharmaceuticalForms" value="Yes" onChange={(e) => this.setState({pharmaceuticalFormsCheck: true})} checked={this.state.pharmaceuticalFormsCheck} />
                                <label htmlFor="rb1" className="p-radiobutton-label">Yes</label>
                            </div>
                            <div className="p-field p-col-4 p-md-4">
                                <RadioButton inputId="rb2" name="pharmaceuticalForms" value="No" onChange={(e) => {this.setState({pharmaceuticalFormsCheck: false, pharmceuticalForms: this.state.pharmaceuticalForms.map(item => {item.isChecked =false; return item; })});console.log(this.state.pharmaceuticalForms)}} checked={!this.state.pharmaceuticalFormsCheck } />
                                <label htmlFor="rb2" className="p-radiobutton-label">No</label>
                            </div>
                        </div>



                        {this.state.pharmaceuticalFormsCheck ?
                            <div  className="p-grid p-align-center" >
                                {/*{this.renderPharmaceuticalForms(this.state.pharmaceuticalForms)}*/}
                                <MultiSelect optionLabel="name" value={this.state.pharmaceuticalForms.map(x => x).filter(item => item.isChecked)} options={this.state.pharmaceuticalForms} maxSelectedLabels={100} onChange={this.handlePharmaceuticalFormChange} style={{minWidth:'12em'}} filter={true} filterPlaceholder="Search" placeholder="Choose" itemTemplate={this.carTemplate} selectedItemTemplate={this.selectedCarTemplate} />
                            </div>
                            :
                            <div></div>
                        }




                    </Fieldset>
                    <Fieldset legend="drug features" >
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

                            <div  className="p-grid p-align-center" >
                                {/*{this.renderDrugFeatures(this.state.drugFeatures)}*/}
                                <MultiSelect optionLabel="drugFeature" value={this.state.drugFeatures.map(x => x).filter(item => item.isChecked)} options={this.state.drugFeatures} maxSelectedLabels={100} onChange={this.handleDrugFeatureChange} style={{minWidth:'12em'}} filter={true} filterPlaceholder="Search" placeholder="Choose" itemTemplate={this.drugFeatureTemplate} selectedItemTemplate={this.selectedDrugFeatureTemplate}/>


                            </div>
                            :
                            <div></div>
                        }





                    </Fieldset>


                </Panel>











            </Card>



        );
    }

    renderDiseasesList(drugs) {
        let diseases = [];

        if (drugs) {
            for (let i = 0; i < drugs.length; i++) {
                if (drugs[i].disease) {
                    for (let j = 0; j < drugs[i].disease.length; j++) {
                        if (!diseases.includes(drugs[i].disease[j])) {
                            diseases.push(drugs[i].disease[j]);

                        }
                    }
                }
            }
        }
        return diseases;

    }

    isDiseaseInList(diseases, disease) {

    }

    render() {
        const {t} = this.props;
        const firstname = User.firstname;
        const lastname = User.lastname;
        this.state.filteredDrugs = this.filterAll();
        if (this.state.filteredDrugs) {
            this.state.filteredDrugs = this.state.filteredDrugs.map(drug =>
            {
                if (drug.sideEffects) {
                    drug.sideEffects = drug.sideEffects.map(sideEffect => {
                        if (!sideEffect.showAdditionalInfo) sideEffect.showAdditionalInfo = false;
                        return sideEffect;
                    })
                }
                return drug;
            })
        }

        const drugs			= this.state.filteredDrugs;
        console.log("filtered drugs:", drugs);
        console.log("all drugs", this.state.drugs);
        console.log("sorting methos: ", this.state.selectedOrder);
        const interactions	= this.state.interactions;
        const orderItems = [
            {label: 'Order by most relevant symptome ', id: 1, sortMethod: this.sortBySymptoms},
            {label: 'Order by alphabet ', id: 2, sortMethod: this.sortByName},
            {label: 'Order by most relevant drugfeatures', id: 3, sortMethod: this.sortByDrugFeatures},
            {label: 'Order by symptoms history', id: 5, sortMethod: this.sortByHistory}
        ];
        const divStyle = {
            margin: '20px',
            float:'right',
            width: '25em',
        };
        const divStyle2 = {
            backgroundColor: '#F1F1F1',
            margin: '15px'
        };

        var title = null;
        var description = null;

        switch(this.state.cmd) {
            case 'taking':
                title = t('userDrugs');
                description = t('drugTakingListDescriptionText');
                break;
            case 'remember':
                title = t('rememberedDrugs');
                description = t('drugRememberListDescriptionText');
                break;
            default:
                title = t('drugs');
                description = t('drugListAllDescriptionText');
                break;
        }

        return (
            <div className="container no-banner">
                <div className='page-header'>
                    <h3>{title}</h3>
                </div>
                {!User.isAuthenticated() &&
                <div className="alert alert-info" role="alert">
                    <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    <strong style={{ paddingLeft:'20px', fontSize: '120%'}}>To get Personalized drug list, you need to login/ register!</strong>
                </div>
                }
                {User.isAuthenticated() && User.levelOfDetail > 1 &&
                <div className="alert alert-info">
                    <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    <span className="sr-only">Info:</span>&nbsp;
                    {description.replace("%User.firstname%", firstname).replace("%User.lastname%", lastname)}
                </div>
                }

                {drugs.length > 1 && User.isAuthenticated() && interactions.length > 0 &&
                <div className={"alert alert-dismissable" + (User.redGreenColorblind ? " danger-red-green-colorblind" : " alert-danger") }>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                    <span className="sr-only">Error:</span>
                    <h5>{User.redGreenColorblind} {t("interaction")}</h5>
                    <span dangerouslySetInnerHTML={this.createMarkup(interactions)} />
                </div>
                }
                <div className="col-md-12 "  style={divStyle2}>

                    <Dropdown value={this.state.selectedOrder} options={orderItems} onChange={this.onOrderChange} placeholder="Select an Order" optionLabel="label" style={divStyle}/>


                </div>
                <div  className="col-md-4" >
                    {this.renderFilterColumn()}
                </div>

                <div className="col-md-8">
                    {this.state.loading && <Loading /> }
                    {!this.state.loading && drugs && drugs.length == 0 && <EmptyList isAllergic={this.checkIsAllergic()}/> }
                    {!this.state.loading && drugs && drugs.length > 0 &&
                    <ul className="drug-list">
                        {this.renderDrugs(drugs)}
                    </ul>
                    }
                </div>
            </div>
        );
    }
    checkIsAllergic() {
        if (!(this.state.allergies && this.state.selectedActiveSubstances)) {
            return false;
        }
        const allergies = [...this.state.allergies]
        const activeSubstances = [...this.state.selectedActiveSubstances]
        for (let i = 0; i < allergies.length; i++) {
            for (let j = 0; j < activeSubstances.length; j++) {
                if (allergies[i].id === activeSubstances[j].id) {
                    return true;
                }
            }
        }
        return false;
    }
}


export default translate()(DrugList);