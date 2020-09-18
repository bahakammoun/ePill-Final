package com.doccuty.epill.pharmaceuticalform;

import com.doccuty.epill.model.PharmaceuticalForm;
import com.doccuty.epill.model.util.PharmaceuticalFormCreator;
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
@RequestMapping("/pharmaceuticalForm")
public class PharmaceuticalFormController {

    @Autowired
    private UserService userService;

    @Autowired
    private PharmaceuticalFormService service;

    @RequestMapping(value="/all", method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getAllPharmaceuticalForm() {

        IdMap map = PharmaceuticalFormCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(2)));

        List<PharmaceuticalForm> set = service.getAllPharmaceuticalForm();

        JsonObject json = new JsonObject();
        JsonArray pharmaArray = new JsonArray();

        for(PharmaceuticalForm pharmaceuticalForm : set) {
            pharmaArray.add(map.toJsonObject(pharmaceuticalForm));
        }

        json.add("value", pharmaArray);

        return new ResponseEntity<>(json, HttpStatus.OK);
    }
}
