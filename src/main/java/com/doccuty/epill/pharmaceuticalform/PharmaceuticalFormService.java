package com.doccuty.epill.pharmaceuticalform;

import com.doccuty.epill.authentication.AuthenticationService;
import com.doccuty.epill.drug.PharmaceuticalFormRepository;
import com.doccuty.epill.gender.GenderService;

import com.doccuty.epill.model.PharmaceuticalForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PharmaceuticalFormService {

    private static final Logger LOG = LoggerFactory.getLogger(GenderService.class);

    @Autowired
    PharmaceuticalFormRepository repository;


    @Autowired
    AuthenticationService authenticationService;

    public List<PharmaceuticalForm> getAllPharmaceuticalForm() {
        return (List<PharmaceuticalForm>) repository.findAll();
    }


    public PharmaceuticalForm savePharmaceuticalForm(PharmaceuticalForm pharmaceuticalForm) {
        LOG.info("Saved gender={}", pharmaceuticalForm);
        return repository.save(pharmaceuticalForm);
    }

    public PharmaceuticalForm getPharmaceuticalFormById(int id) {
        return repository.findOne(id);
    }
}
