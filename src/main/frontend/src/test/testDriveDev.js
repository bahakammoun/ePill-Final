import React from 'react';
import DrugList from "../components/drug_list";
import { shallow, mount } from "enzyme";
import MenueItem from "../components/menue_item";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import DrugDetail from "../components/drug_detail";
//======== Mock data start ========
const chronicDiseases = [
    {
        id: 1,
        diseaseGroup: "a"
    },{
        id: 2,
        diseaseGroup: "b"
    },{
        id: 3,
        diseaseGroup: "c"
    },{
        id: 4,
        diseaseGroup: "d"
    }
];

const pharmaceuticalForms = [
    {
        id : 1,
        name : "form1",
        isChecked : false
    },
    {
        id : 2,
        name : "form2",
        isChecked : true
    },
    {
        id : 3,
        name : "form3",
        isChecked : false
    },
    {
        id : 4,
        name : "form4",
        isChecked : true
    }
]

const activeSubstances = [
    {
        id : 1,
        name : "a"
    },
    {
      id : 2,
      name : "b"
    },
    {
        id : 3,
        name : "c"
    },
    {
        id : 4,
        name : "d"
    },
    {
        id : 5,
        name : "e"
    },
    {
        id : 6,
        name : "f"
    }


];

const diseases = [
    {
        id : 1,
        name : "d1"
    },
    {
        id : 2,
        name : "d2"
    },
    {
        id : 3,
        name : "d3"
    },
    {
        id : 4,
        name : "d4"
    },
    {
        id : 5,
        name : "d5"
    },
    {
        id : 6,
        name : "d6"
    }
];

const sideEffects = [
    {
        id : 1,
        diseaseGroup: chronicDiseases[0]
    },
    {
        id : 2,
        diseaseGroup: chronicDiseases[1]
    },
    {
        id : 3,
        diseaseGroup: chronicDiseases[2]
    },
    {
        id : 4,
        diseaseGroup: chronicDiseases[3]
    }
]

const drugs = [
    {
        id : 1,
        name : "drug1",
        activeSubstance : [activeSubstances[0]],
        disease : [diseases[0], diseases[2]],
        sideEffects: sideEffects,
        pharmaceuticalForm: [pharmaceuticalForms[1]]
    },
    {
        id : 2,
        name : "drug2",
        activeSubstance : [activeSubstances[1]],
        disease : [diseases[1]],
        pharmaceuticalForm: [pharmaceuticalForms[0]]
    },
    {
        id : 3,
        name : "drug3",
        activeSubstance : [activeSubstances[2]],
        disease : [diseases[3], diseases[4]],
        pharmaceuticalForm: [pharmaceuticalForms[2]]
    },
    {
        id : 4,
        name : "drug4",
        activeSubstance : [activeSubstances[3]],
        disease : [diseases[0]],
        pharmaceuticalForm: [pharmaceuticalForms[0]]
    },
    {
        id : 5,
        name : "drug5",
        activeSubstance : [activeSubstances[3]],
        disease : [diseases[5]],
        pharmaceuticalForm: [pharmaceuticalForms[3]]

    },
    {
        id : 6,
        name : "drug6",
        activeSubstance : [activeSubstances[3]],
        disease : [diseases[3]],
        pharmaceuticalForm: [pharmaceuticalForms[0]]
    },
    {
        id : 7,
        name : "drug7",
        activeSubstance : [activeSubstances[4]],
        disease : [diseases[3], diseases[2]],
        pharmaceuticalForm: [pharmaceuticalForms[2]]
    },
    {
        id : 8,
        name : "drug8",
        activeSubstance : [activeSubstances[5]],
        disease : [diseases[1], diseases[2]],
        pharmaceuticalForm: [pharmaceuticalForms[3]]
    },
    {
        id : 9,
        name : "drug9",
        activeSubstance : [activeSubstances[2]],
        disease : [diseases[2]],
        pharmaceuticalForm: [pharmaceuticalForms[1]]
    },
    {
        id : 10,
        name : "drug10",
        activeSubstance : [activeSubstances[4]],
        disease : [diseases[4]],
        pharmaceuticalForm: [pharmaceuticalForms[2]]
    }
];

const allergies = [activeSubstances[3], activeSubstances[5]];
//======== Mock Data End ========


describe("component drug list", () => {
    it("test 1: filter by allergies", () => {
        let mock = new MockAdapter(axios);
        mock.onGet().reply(404, {});
        const wrapper = shallow(<DrugList t={key => key} location={{pathname : 'list'}}/>);
        console.log(wrapper.debug());
        wrapper.setState({
            allergies : allergies,
            drugs : drugs
        });
        let allDrugs = [...wrapper.instance().state.drugs];
        let filteredDrugs = allDrugs.filter(wrapper.instance().filterByAllergies);
        expect(filteredDrugs.length).toBe(6);
        expect(filteredDrugs).toContainEqual(drugs[0]);
        expect(filteredDrugs).toContainEqual(drugs[1]);
        expect(filteredDrugs).toContainEqual(drugs[2]);
        expect(filteredDrugs).toContainEqual(drugs[6]);
        expect(filteredDrugs).toContainEqual(drugs[8]);
        expect(filteredDrugs).toContainEqual(drugs[9]);
    })
})

describe("component drug list", () => {
    it("test 2: filter by pharmaceutical form", () => {
        let mock = new MockAdapter(axios);
        mock.onGet().reply(404, {});
        const wrapper = shallow(<DrugList t={key => key} location={{pathname : 'list'}}/>);
        console.log(wrapper.debug());
        wrapper.setState({
            pharmaceuticalForms : pharmaceuticalForms,
            drugs : drugs
        });
        let allDrugs = [...wrapper.instance().state.drugs];
        let filteredDrugs = allDrugs.filter(wrapper.instance().filterByPharmaceuticalForms);


        expect(filteredDrugs.length).toBe(4);
        expect(filteredDrugs).toContainEqual(drugs[0]);
        expect(filteredDrugs).toContainEqual(drugs[4]);
        expect(filteredDrugs).toContainEqual(drugs[7]);
        expect(filteredDrugs).toContainEqual(drugs[8]);
    })
})

describe("component drug list", () => {
    it("test 3 filter by active substance", () => {
        let mock = new MockAdapter(axios);
        mock.onGet().reply(404, {});
        const wrapper = shallow(<DrugList t={key => key} location={{pathname : 'list'}}/>);
        wrapper.setState({
            drugs : drugs,
            selectedActiveSubstances: [
                activeSubstances[4],
                activeSubstances[2]
            ]
        })
        let allDrugs = [...wrapper.instance().state.drugs];
        let filteredDrugs = allDrugs.filter(wrapper.instance().filterByActiveSubstance);
        expect(filteredDrugs.length).toBe(4);
        expect(filteredDrugs).toContainEqual(drugs[2]);
        expect(filteredDrugs).toContainEqual(drugs[6]);
        expect(filteredDrugs).toContainEqual(drugs[8]);
        expect(filteredDrugs).toContainEqual(drugs[9]);
    })
})

describe("component drug list", () => {
    it("test 4: filter by disease/symptoms", () => {
        let mock = new MockAdapter(axios);
        mock.onGet().reply(404, {});
        const wrapper = shallow(<DrugList t={key => key} location={{pathname : 'list'}}/>);
        wrapper.setState({
            drugs : drugs,
            selectedDiseases: [
                diseases[0], diseases[5]
            ]
        })
        let allDrugs = [...wrapper.instance().state.drugs];
        let filteredDrugs = allDrugs.filter(wrapper.instance().filterBySymptoms);
        expect(filteredDrugs.length).toBe(3);
        expect(filteredDrugs).toContainEqual(drugs[0]);
        expect(filteredDrugs).toContainEqual(drugs[3]);
        expect(filteredDrugs).toContainEqual(drugs[4]);
    })
})

describe("component drug detail", () => {
    it("test 1: detect allergies", () => {
        let mock = new MockAdapter(axios);
        mock.onGet().reply(404, {});
        const params = {
            id : 1
        }

        const wrapper = shallow(<DrugDetail t={key => key} location={{pathname : 'list'}} match={{params : params}} />);
        wrapper.setState({
           drug : drugs[0],
           allergies :  [activeSubstances[0], activeSubstances[3], activeSubstances[5]]
        });
        let allergies = [...wrapper.instance().state.allergies];
        let warning = allergies.filter(wrapper.instance().allergiesFilter);
        expect(warning.length).toBe(1);
        expect(warning).toContainEqual(activeSubstances[0]);
    })
})

describe("component drug detail", () => {
    it("test 2: detect relevant side effects", () => {
        let mock = new MockAdapter(axios);
        mock.onGet().reply(404, {});
        const params = {
            id : 1
        }

        const wrapper = shallow(<DrugDetail t={key => key} location={{pathname : 'list'}} match={{params : params}} />);
        wrapper.setState({
            drug : drugs[0],
            sufferedChronicDiseases :  [chronicDiseases[0], activeSubstances[2]]
        });
        let sideEffects = [...wrapper.instance().state.drug.sideEffects];
        let relevantSideEffects = sideEffects.filter(wrapper.instance().sideEffectsFilter);
        expect(relevantSideEffects.length).toBe(2);
        expect(relevantSideEffects).toContainEqual(sideEffects[0]);
        expect(relevantSideEffects).toContainEqual(sideEffects[2]);
    })
})

