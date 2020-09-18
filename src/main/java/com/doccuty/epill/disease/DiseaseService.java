package com.doccuty.epill.disease;

import com.doccuty.epill.diseaseinvocation.DiseaseInvocation;
import com.doccuty.epill.diseaseinvocation.DiseaseInvocationRepository;
import com.doccuty.epill.iteminvocation.ItemInvocation;
import com.doccuty.epill.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.doccuty.epill.model.util.DiseaseSet;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Handle all CRUD operations for posts.
 */
@Service
public class DiseaseService {

	@Autowired
    DiseaseRepository repository;

	@Autowired
    DiseaseInvocationRepository invocationRepository;

	@Autowired
    UserService userService;

    public DiseaseSet getAllDiseases() {
        DiseaseSet set = new DiseaseSet();
        List<Disease> diseaseList = repository.findAll();
        set.addAll(diseaseList);
        return set;
    }


	public Disease getDiseaseById(long id) {
		return repository.findOne(id);
	}

    public void addDisease(Disease disease) {
    	repository.save(disease);
    }

    public List<DiseaseInvocation> getClicksByUserId() {

        List<DiseaseInvocation> list = invocationRepository.findInvokedDiseases(userService.getCurrentUser());

        return list;
    }

}
