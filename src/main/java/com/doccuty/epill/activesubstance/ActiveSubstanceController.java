package com.doccuty.epill.activesubstance;

import com.doccuty.epill.model.ActiveSubstance;
import com.doccuty.epill.model.PharmaceuticalForm;
import com.doccuty.epill.model.util.PharmaceuticalFormCreator;
import com.doccuty.epill.pharmaceuticalform.PharmaceuticalFormService;
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
@RequestMapping("/activeSubstance")
public class ActiveSubstanceController {

    @Autowired
    private UserService userService;

    @Autowired
    private ActiveSubstanceService service;

    @RequestMapping(value="/all", method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getAllActiveSubstances() {

        IdMap map = PharmaceuticalFormCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(2)));

        List<ActiveSubstance> set = service.getAllActiveSubstances();

        JsonObject json = new JsonObject();
        JsonArray substanceArray = new JsonArray();

        for(ActiveSubstance activeSubstance : set) {
            substanceArray.add(map.toJsonObject(activeSubstance));
        }

        json.add("value", substanceArray);

        return new ResponseEntity<>(json, HttpStatus.OK);
    }
}
