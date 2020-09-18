package com.doccuty.epill.drugfeature;

import com.doccuty.epill.authentication.AuthenticationService;
import com.doccuty.epill.drug.DrugFeatureRepository;
import com.doccuty.epill.gender.GenderService;
import com.doccuty.epill.model.DrugFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrugFeatureService {

    private static final Logger LOG = LoggerFactory.getLogger(GenderService.class);

    @Autowired
    DrugFeatureRepository repository;


    @Autowired
    AuthenticationService authenticationService;

    public List<DrugFeature> getAllDrugFeature() {
        return (List<DrugFeature>) repository.findAll();
    }


    public DrugFeature savePharmaceuticalForm(DrugFeature drugFeature) {
        LOG.info("Saved gender={}", drugFeature);
        return repository.save(drugFeature);
    }

    public DrugFeature getDrugFeatureById(int id) {
        return repository.findOne((long) id);
    }
}
