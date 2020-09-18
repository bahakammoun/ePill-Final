package com.doccuty.epill.healthcondition;

import com.doccuty.epill.model.util.DiseaseGroupCreator;
import com.doccuty.epill.user.UserService;
import de.uniks.networkparser.Deep;
import de.uniks.networkparser.Filter;
import de.uniks.networkparser.IdMap;
import de.uniks.networkparser.json.JsonArray;
import de.uniks.networkparser.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disease_group")
public class DiseaseGroupController {


    @Autowired
    private UserService userService;

    @Autowired
    private DiseaseGroupService service;

    /**
     * get user profiles of all users
     */

    @RequestMapping(value="/all", method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getAllDiseaseGroup() {

        IdMap map = DiseaseGroupCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(5)));

        List<DiseaseGroup> set = service.getAllDiseaseGroup();

        JsonObject json = new JsonObject();
        JsonArray genderArray = new JsonArray();

        for(DiseaseGroup diseaseGroup : set) {
            JsonObject jsonObject = map.toJsonObject(diseaseGroup);
            genderArray.add(jsonObject);
        }

        json.add("value", genderArray);

        return new ResponseEntity<>(json, HttpStatus.OK);
    }

    /**
     * get a complete user profile by id
     */

    @RequestMapping(value={"/{id}"}, method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getUserById(@PathVariable(value = "id") int id) {
        // A pragmatic approach to security which does not use much framework-specific magic. While other approaches
        // with annotations, etc. are possible they are much more complex while this is quite easy to understand and
        // extend.
        if (userService.isAnonymous()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        IdMap map = DiseaseGroupCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(5)));

        DiseaseGroup diseaseGroup = service.getDiseaseGroupById(id);

        JsonObject json = new JsonObject();
        json.add("value", map.toJsonObject(diseaseGroup));

        return new ResponseEntity<>(json, HttpStatus.OK);
    }

    /**
     * save or update a complete user profile
     * @param diseaseGroup
     * @return
     */

    @RequestMapping(value="/save", method = RequestMethod.POST)
    public ResponseEntity<Object> saveUser(@RequestBody DiseaseGroup diseaseGroup) {

        service.saveDiseaseGroup(diseaseGroup);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * update all parameters from settings section including
     * @param diseaseGroup
     * @return
     */

    @RequestMapping(value="/update", method = RequestMethod.POST)
    public ResponseEntity<JsonObject> updateUserSettings(@RequestBody DiseaseGroup diseaseGroup) {
        // A pragmatic approach to security which does not use much framework-specific magic. While other approaches
        // with annotations, etc. are possible they are much more complex while this is quite easy to understand and
        // extend.
        if (userService.isAnonymous()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        diseaseGroup = service.saveDiseaseGroup(diseaseGroup);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
