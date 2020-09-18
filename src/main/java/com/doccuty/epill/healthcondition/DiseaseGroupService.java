package com.doccuty.epill.healthcondition;

import com.doccuty.epill.authentication.AuthenticationService;
import com.doccuty.epill.gender.GenderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiseaseGroupService {

    private static final Logger LOG = LoggerFactory.getLogger(GenderService.class);

    @Autowired
    DiseaseGroupRepository repository;


    @Autowired
    AuthenticationService authenticationService;

    public List<DiseaseGroup> getAllDiseaseGroup() {
        return  repository.findAll();
    }


    public DiseaseGroup saveDiseaseGroup(DiseaseGroup diseaseGroup) {
        LOG.info("Saved gender={}", diseaseGroup);
        return repository.save(diseaseGroup);
    }

    public DiseaseGroup getDiseaseGroupById(int id) {
        return repository.findOne(id);
    }
}
