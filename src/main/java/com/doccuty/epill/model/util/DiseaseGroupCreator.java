package com.doccuty.epill.model.util;

import com.doccuty.epill.healthcondition.DiseaseGroup;
import com.doccuty.epill.user.User;
import de.uniks.networkparser.IdMap;
import de.uniks.networkparser.interfaces.SendableEntityCreatorNoIndex;

public class DiseaseGroupCreator implements SendableEntityCreatorNoIndex {

    private String[] properties = new String[] {
            DiseaseGroup.PROPERTY_ID,
            DiseaseGroup.PROPERTY_DISEASEGROUP
    };

    @Override
    public String[] getProperties() {
        return properties;
    }

    @Override
    public Object getValue(Object target, String attrName) {
        int pos = attrName.indexOf('.');
        String attribute = attrName;

        if (pos > 0)
        {
            attribute = attrName.substring(0, pos);
        }

        if (DiseaseGroup.PROPERTY_ID.equalsIgnoreCase(attribute))
        {
            return ((DiseaseGroup) target).getId();
        }

        if (DiseaseGroup.PROPERTY_DISEASEGROUP.equalsIgnoreCase(attribute))
        {
            return ((DiseaseGroup) target).getDiseaseGroup();
        }

        if (DiseaseGroup.PROPERTY_USERSUFFERING.equalsIgnoreCase(attribute))
        {
            return ((DiseaseGroup) target).getUserSuffering();
        }

        return null;
    }

    @Override
    public boolean setValue(Object target, String attrName, Object value, String type)
    {
        if (DiseaseGroup.PROPERTY_DISEASEGROUP.equalsIgnoreCase(attrName))
        {
            ((DiseaseGroup) target).setDiseaseGroup((String) value);
            return true;
        }

        if (DiseaseGroup.PROPERTY_ID.equalsIgnoreCase(attrName))
        {
            ((DiseaseGroup) target).setId(Integer.parseInt(value.toString()));
            return true;
        }

        if (SendableEntityCreatorNoIndex.REMOVE.equals(type) && value != null)
        {
            attrName = attrName + type;
        }

        if (DiseaseGroup.PROPERTY_USERSUFFERING.equalsIgnoreCase(attrName))
        {
            ((DiseaseGroup) target).withUserSuffering((User) value);
            return true;
        }

        if ((DiseaseGroup.PROPERTY_USERSUFFERING + SendableEntityCreatorNoIndex.REMOVE).equalsIgnoreCase(attrName))
        {
            ((DiseaseGroup) target).withoutUserSuffering((User) value);
            return true;
        }

        return false;
    }
    public static IdMap createIdMap(String sessionID)
    {
        return CreatorCreator.createIdMap(sessionID);
    }

    //==========================================================================
    public void removeObject(Object entity)
    {
        ((DiseaseGroup) entity).removeYou();
    }

    @Override
    public Object getSendableInstance(boolean prototyp) {
        return new DiseaseGroup();
    }
}
