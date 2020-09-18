package com.doccuty.epill.model.util;

import com.doccuty.epill.disease.Disease;
import com.doccuty.epill.diseaseinvocation.DiseaseInvocation;
import com.doccuty.epill.user.User;
import de.uniks.networkparser.IdMap;
import de.uniks.networkparser.interfaces.SendableEntityCreatorNoIndex;

import java.util.Date;

public class DiseaseInvocationCreator implements SendableEntityCreatorNoIndex{

    private final String[] properties = new String[]
            {
                    DiseaseInvocation.PROPERTY_ID,
                    DiseaseInvocation.PROPERTY_TIMESTAMP,
                    DiseaseInvocation.PROPERTY_DISEASE,
                    DiseaseInvocation.PROPERTY_USER,
                    DiseaseInvocation.PROPERTY_COUNTER
            };

    @Override
    public String[] getProperties()
    {
        return properties;
    }

    @Override
    public Object getSendableInstance(boolean reference)
    {
        return new DiseaseInvocation();
    }

    @Override
    public Object getValue(Object target, String attrName)
    {
        int pos = attrName.indexOf('.');
        String attribute = attrName;

        if (pos > 0)
        {
            attribute = attrName.substring(0, pos);
        }

        if (DiseaseInvocation.PROPERTY_ID.equalsIgnoreCase(attribute))
        {
            return ((DiseaseInvocation) target).getId();
        }

        if (DiseaseInvocation.PROPERTY_TIMESTAMP.equalsIgnoreCase(attribute))
        {
            return ((DiseaseInvocation) target).getTimestamp();
        }

        if (DiseaseInvocation.PROPERTY_DISEASE.equalsIgnoreCase(attribute))
        {
            return ((DiseaseInvocation) target).getDisease();
        }


        if (DiseaseInvocation.PROPERTY_USER.equalsIgnoreCase(attribute))
        {
            return ((DiseaseInvocation) target).getUser();
        }

        if(DiseaseInvocation.PROPERTY_COUNTER.equalsIgnoreCase(attribute)) {
            return ((DiseaseInvocation) target).getCounter();
        }

        return null;
    }

    @Override
    public boolean setValue(Object target, String attrName, Object value, String type)
    {
        if (DiseaseInvocation.PROPERTY_TIMESTAMP.equalsIgnoreCase(attrName))
        {
            ((DiseaseInvocation) target).setTimestamp((Date) value);
            return true;
        }

        if (DiseaseInvocation.PROPERTY_ID.equalsIgnoreCase(attrName))
        {
            ((DiseaseInvocation) target).setId(Long.parseLong(value.toString()));
            return true;
        }

        if (SendableEntityCreatorNoIndex.REMOVE.equals(type) && value != null)
        {
            attrName = attrName + type;
        }

        if (DiseaseInvocation.PROPERTY_DISEASE.equalsIgnoreCase(attrName))
        {
            ((DiseaseInvocation) target).setDisease((Disease) value);
            return true;
        }

        if (DiseaseInvocation.PROPERTY_USER.equalsIgnoreCase(attrName))
        {
            ((DiseaseInvocation) target).setUser((User) value);
            return true;
        }

        if(DiseaseInvocation.PROPERTY_COUNTER.equalsIgnoreCase(attrName)) {
            ((DiseaseInvocation) target).setCounter((Integer) value);
            return true;
        }

        return false;
    }
    public static IdMap createIdMap(String sessionID)
    {
        return com.doccuty.epill.model.util.CreatorCreator.createIdMap(sessionID);
    }

    //==========================================================================
    public void removeObject(Object entity)
    {
        ((DiseaseInvocation) entity).removeYou();
    }
}
