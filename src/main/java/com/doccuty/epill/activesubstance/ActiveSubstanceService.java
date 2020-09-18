package com.doccuty.epill.activesubstance;

import com.doccuty.epill.authentication.AuthenticationService;
import com.doccuty.epill.drug.PharmaceuticalFormRepository;
import com.doccuty.epill.gender.GenderService;
import com.doccuty.epill.model.ActiveSubstance;
import com.doccuty.epill.model.PharmaceuticalForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActiveSubstanceService {

    private static final Logger LOG = LoggerFactory.getLogger(ActiveSubstanceService.class);

    @Autowired
    ActiveSubstanceRepository repository;


    @Autowired
    AuthenticationService authenticationService;

    public List<ActiveSubstance> getAllActiveSubstances() {
        return (List<ActiveSubstance>) repository.findAll();
    }


    public ActiveSubstance saveActiveSubstance(ActiveSubstance activeSubstance) {
        LOG.info("Saved gender={}",activeSubstance);
        return repository.save(activeSubstance);
    }

    public ActiveSubstance getActiveSubstanceById(int id) {
        return repository.findOne(id);
    }
}
