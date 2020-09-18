package com.doccuty.epill.model.util;

import com.doccuty.epill.drug.Drug;
import com.doccuty.epill.healthcondition.DiseaseGroup;
import com.doccuty.epill.sideeffects.SideEffect;
import de.uniks.networkparser.IdMap;
import de.uniks.networkparser.interfaces.SendableEntityCreatorNoIndex;

public class SideEffectCreator implements SendableEntityCreatorNoIndex{
    private final String[] properties = new String[]
            {
                    SideEffect.PROPERTY_ID,
                    SideEffect.PROPERTY_DISEASEGROUP,
                    SideEffect.PROPERTY_DRUG,
                    SideEffect.PROPERTY_COMMON,
                    SideEffect.PROPERTY_VERYCOMMON,
                    SideEffect.PROPERTY_NOTKNOWN,
                    SideEffect.PROPERTY_UNCOMMON,
                    SideEffect.PROPERTY_RARE,
                    SideEffect.PROPERTY_VERYRARE
            };

    @Override
    public String[] getProperties()
    {
        return properties;
    }

    @Override
    public Object getSendableInstance(boolean reference)
    {
        return new SideEffect();
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

        if (SideEffect.PROPERTY_ID.equalsIgnoreCase(attribute))
        {
            return ((SideEffect) target).getId();
        }

        if (SideEffect.PROPERTY_VERYRARE.equalsIgnoreCase(attribute))
        {
            return ((SideEffect) target).getVeryRare();
        }

        if (SideEffect.PROPERTY_DISEASEGROUP.equalsIgnoreCase(attribute))
        {
            return ((SideEffect) target).getDiseaseGroup();
        }


        if (SideEffect.PROPERTY_DRUG.equalsIgnoreCase(attribute))
        {
            return ((SideEffect) target).getDrug();
        }

        if(SideEffect.PROPERTY_RARE.equalsIgnoreCase(attribute)) {
            return ((SideEffect) target).getRare();
        }

        if (SideEffect.PROPERTY_UNCOMMON.equalsIgnoreCase(attribute)) {
            return  ((SideEffect) target).getUncommon();
        }

        if (SideEffect.PROPERTY_COMMON.equalsIgnoreCase(attribute)) {
            return  ((SideEffect) target).getCommon();
        }

        if (SideEffect.PROPERTY_VERYCOMMON.equalsIgnoreCase(attribute)) {
            return  ((SideEffect) target).getVeryCommon();
        }

        if (SideEffect.PROPERTY_NOTKNOWN.equalsIgnoreCase(attribute)) {
            return  ((SideEffect) target).getNotKnown();
        }

        return null;
    }

    @Override
    public boolean setValue(Object target, String attrName, Object value, String type)
    {

        if (SideEffect.PROPERTY_ID.equalsIgnoreCase(attrName))
        {
            ((SideEffect) target).setId(Long.parseLong(value.toString()));
            return true;
        }

        if (SendableEntityCreatorNoIndex.REMOVE.equals(type) && value != null)
        {
            attrName = attrName + type;
        }

        if (SideEffect.PROPERTY_DISEASEGROUP.equalsIgnoreCase(attrName))
        {
            ((SideEffect) target).setDiseaseGroup((DiseaseGroup) value);
            return true;
        }

        if (SideEffect.PROPERTY_DRUG.equalsIgnoreCase(attrName))
        {
            ((SideEffect) target).setDrug((Drug) value);
            return true;
        }

        if(SideEffect.PROPERTY_COMMON.equalsIgnoreCase(attrName)) {
            ((SideEffect) target).setCommon((String) value);
            return true;
        }

        if(SideEffect.PROPERTY_UNCOMMON.equalsIgnoreCase(attrName)) {
            ((SideEffect) target).setUncommon((String) value);
            return true;
        }

        if(SideEffect.PROPERTY_VERYCOMMON.equalsIgnoreCase(attrName)) {
            ((SideEffect) target).setVeryCommon((String) value);
            return true;
        }

        if(SideEffect.PROPERTY_RARE.equalsIgnoreCase(attrName)) {
            ((SideEffect) target).setRare((String) value);
            return true;
        }

        if(SideEffect.PROPERTY_VERYRARE.equalsIgnoreCase(attrName)) {
            ((SideEffect) target).setVeryRare((String) value);
            return true;
        }

        if(SideEffect.PROPERTY_NOTKNOWN.equalsIgnoreCase(attrName)) {
            ((SideEffect) target).setNotKnown((String) value);
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
        ((SideEffect) entity).removeYou();
    }
}
