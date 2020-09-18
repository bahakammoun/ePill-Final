package com.doccuty.epill.drugfeature;

import com.doccuty.epill.model.DrugFeature;

import com.doccuty.epill.model.util.DrugFeatureCreator;

import com.doccuty.epill.user.UserService;
import de.uniks.networkparser.Deep;
import de.uniks.networkparser.Filter;
import de.uniks.networkparser.IdMap;
import de.uniks.networkparser.json.JsonArray;
import de.uniks.networkparser.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/drugFeature")
public class DrugFeatureController {

    @Autowired
    private UserService userService;

    @Autowired
    private DrugFeatureService service;

    @RequestMapping(value="/all", method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getAllDrugFeature() {

        IdMap map = DrugFeatureCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(2)));

        List<DrugFeature> set = service.getAllDrugFeature();

        JsonObject json = new JsonObject();
        JsonArray pharmaArray = new JsonArray();

        for(DrugFeature drugFeature : set) {
            pharmaArray.add(map.toJsonObject(drugFeature));
        }

        json.add("value", pharmaArray);

        return new ResponseEntity<>(json, HttpStatus.OK);
    }
}
