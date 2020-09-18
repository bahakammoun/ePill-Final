package com.doccuty.epill.disease;

import com.doccuty.epill.disease.Disease;
import com.doccuty.epill.disease.DiseaseService;
import com.doccuty.epill.diseaseinvocation.DiseaseInvocation;
import com.doccuty.epill.model.util.DiseaseCreator;
import com.doccuty.epill.model.util.DiseaseSet;
import com.doccuty.epill.model.util.ItemInvocationCreator;
import com.doccuty.epill.user.User;
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

/**
 * HTTP endpoint for a post-related HTTP requests.
 */
@RestController
public class DiseaseController {

    @Autowired
    private DiseaseService service;

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/disease/all", method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getAllDiseases() {

        DiseaseSet set = service.getAllDiseases();

        IdMap map = DiseaseCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(2)));

        JsonObject json = new JsonObject();
        JsonArray diseaseArray = new JsonArray();

        for(Disease disease : set) {
            diseaseArray.add(map.toJsonObject(disease));
        }

        json.add("value", diseaseArray);


        return new ResponseEntity<>(json, HttpStatus.OK);
    }

    @RequestMapping(value={"/disease/{id}/"}, method = RequestMethod.GET)
    public ResponseEntity<JsonObject> getDiseaseById(@PathVariable(value = "id") int id) {

        Disease disease = service.getDiseaseById(id);

        IdMap map = DiseaseCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(2)));

        JsonObject json = new JsonObject();
        json.add("value", map.toJsonObject(disease));

        return new ResponseEntity<>(json, HttpStatus.OK);
    }


    @RequestMapping(value = "/disease/save/")
    public ResponseEntity<Object> addDisease(@RequestParam("name") String name) {
        // A pragmatic approach to security which does not use much framework-specific magic. While other approaches
        // with annotations, etc. are possible they are much more complex while this is quite easy to understand and
        // extend.
        if (userService.isAnonymous()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Disease disease = new Disease();
        disease.setName(name);

        service.addDisease(disease);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/disease/invoke/{id}")
    public ResponseEntity<Object> addDiseaseInvocation(@PathVariable(value = "id") long id) {
        if (userService.isAnonymous()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Disease disease = service.getDiseaseById(id);
        if (disease == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        User user = userService.getCurrentUser();

        DiseaseInvocation invocation = new DiseaseInvocation();
        invocation.withDisease(disease).withUser(user);

        user = userService.saveDiseaseInvocation(invocation);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value="/disease/frequentlyVisited", method = RequestMethod.GET)
    public ResponseEntity<JsonArray> getFrequentlyVisited() {

        // A pragmatic approach to security which does not use much
        // framework-specific magic. While other approaches
        // with annotations, etc. are possible they are much more complex while
        // this is quite easy to understand and
        // extend.
        if (userService.isAnonymous()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<DiseaseInvocation> list = service.getClicksByUserId();

        IdMap map = ItemInvocationCreator.createIdMap("");
        map.withFilter(Filter.regard(Deep.create(2)));

        JsonArray json = new JsonArray();

        for(DiseaseInvocation invocation : list) {
            json.add(map.toJsonObject(invocation));
        }

        return new ResponseEntity<>(json, HttpStatus.OK);
    }
}
