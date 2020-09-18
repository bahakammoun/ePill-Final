package com.doccuty.epill.sideeffects;

import com.doccuty.epill.drug.Drug;
import com.doccuty.epill.healthcondition.DiseaseGroup;
import de.uniks.networkparser.interfaces.SendableEntity;

import javax.persistence.*;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;

@Entity
@Table(name="side_effects")
public class SideEffect implements SendableEntity {

    protected PropertyChangeSupport listeners = null;

    public boolean firePropertyChange(String propertyName, Object oldValue, Object newValue)
    {
        if (listeners != null) {
            listeners.firePropertyChange(propertyName, oldValue, newValue);
            return true;
        }
        return false;
    }

    public boolean addPropertyChangeListener(PropertyChangeListener listener)
    {
        if (listeners == null) {
            listeners = new PropertyChangeSupport(this);
        }
        listeners.addPropertyChangeListener(listener);
        return true;
    }

    public boolean addPropertyChangeListener(String propertyName, PropertyChangeListener listener) {
        if (listeners == null) {
            listeners = new PropertyChangeSupport(this);
        }
        listeners.addPropertyChangeListener(propertyName, listener);
        return true;
    }

    public boolean removePropertyChangeListener(PropertyChangeListener listener) {
        if (listeners == null) {
            listeners.removePropertyChangeListener(listener);
        }
        listeners.removePropertyChangeListener(listener);
        return true;
    }

    public boolean removePropertyChangeListener(String propertyName,PropertyChangeListener listener) {
        if (listeners != null) {
            listeners.removePropertyChangeListener(propertyName, listener);
        }
        return true;
    }


    //==========================================================================


    public void removeYou()
    {
        setDrug(null);
        setDiseaseGroup(null);
        firePropertyChange("REMOVE_YOU", this, null);
    }


    //==========================================================================

    public static final String PROPERTY_ID = "id";

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;

    public long getId()
    {
        return this.id;
    }

    public void setId(long value)
    {
        if (this.id != value) {

            double oldValue = this.id;
            this.id = value;
            this.firePropertyChange(PROPERTY_ID, oldValue, value);
        }
    }

    public SideEffect withId(long value)
    {
        setId(value);
        return this;
    }


    @Override
    public String toString()
    {
        StringBuilder result = new StringBuilder();

        result.append(" ").append(this.getId()).append(" ").append(this.getDrug());
        return result.substring(1);
    }





    /********************************************************************
     * <pre>
     *              many                       one
     * ItemInvocation ----------------------------------- Drug
     *              clicks                   drug
     * </pre>
     */

    public static final String PROPERTY_DRUG = "drug";

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="iddrug")
    private Drug drug = null;

    public Drug getDrug()
    {
        return this.drug;
    }

    public boolean setDrug(Drug value)
    {
        boolean changed = false;

        if (this.drug != value)
        {
            Drug oldValue = this.drug;

            if (this.drug != null)
            {
                this.drug = null;
                oldValue.withoutSideEffects(this);
            }

            this.drug = value;

            if (value != null)
            {
                value.withSideEffects(this);
            }

            firePropertyChange(PROPERTY_DRUG, oldValue, value);
            changed = true;
        }

        return changed;
    }

    public SideEffect withDrug(Drug value)
    {
        setDrug(value);
        return this;
    }

    public Drug createDrug()
    {
        Drug value = new Drug();
        withDrug(value);
        return value;
    }





    /********************************************************************
     * <pre>
     *              many                       one
     * ItemInvocation ----------------------------------- User
     *              clicks                   user
     * </pre>
     */

    public static final String PROPERTY_DISEASEGROUP = "diseaseGroup";

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="iddisease_groups")
    private DiseaseGroup diseaseGroup = null;

    public DiseaseGroup getDiseaseGroup()
    {
        return this.diseaseGroup;
    }

    public boolean setDiseaseGroup(DiseaseGroup value)
    {
        boolean changed = false;

        if (this.diseaseGroup != value)
        {
            DiseaseGroup oldValue = this.diseaseGroup;

            if (this.diseaseGroup != null)
            {
                this.diseaseGroup = null;
                oldValue.withoutSideEffects(this);
            }

            this.diseaseGroup = value;

            if (value != null)
            {
                value.withSideEffects(this);
            }

            firePropertyChange(PROPERTY_DISEASEGROUP, oldValue, value);
            changed = true;
        }

        return changed;
    }

    public SideEffect withDiseaseGroup(DiseaseGroup value)
    {
        setDiseaseGroup(value);
        return this;
    }

    public DiseaseGroup createDiseaseGroup()
    {
        DiseaseGroup value = new DiseaseGroup();
        withDiseaseGroup(value);
        return value;
    }

    public static final String PROPERTY_VERYCOMMON = "veryCommon";

    @Column(columnDefinition="TEXT")
    private String veryCommon;

    public String getVeryCommon()
    {
        return this.veryCommon;
    }

    public void setVeryCommon(String value)
    {
        if (this.veryCommon != value) {

            String oldValue = this.veryCommon;
            this.veryCommon = value;
            this.firePropertyChange(PROPERTY_VERYCOMMON, oldValue, value);
        }
    }

    public SideEffect withVeryCommon(String value)
    {
        setVeryCommon(value);
        return this;
    }

    public static final String PROPERTY_COMMON = "common";

    @Column(columnDefinition="TEXT")
    private String common;

    public String getCommon()
    {
        return this.common;
    }

    public void setCommon(String value)
    {
        if (this.common != value) {

            String oldValue = this.common;
            this.common = value;
            this.firePropertyChange(PROPERTY_COMMON, oldValue, value);
        }
    }

    public SideEffect withCommon(String value)
    {
        setCommon(value);
        return this;
    }

    public static final String PROPERTY_UNCOMMON = "uncommon";

    @Column(columnDefinition="TEXT")
    private String uncommon;

    public String getUncommon()
    {
        return this.uncommon;
    }

    public void setUncommon(String value)
    {
        if (this.uncommon != value) {

            String oldValue = this.uncommon;
            this.uncommon = value;
            this.firePropertyChange(PROPERTY_UNCOMMON, oldValue, value);
        }
    }

    public SideEffect withUncommon(String value)
    {
        setUncommon(value);
        return this;
    }

    public static final String PROPERTY_RARE = "rare";

    @Column(columnDefinition="TEXT")
    private String rare;

    public String getRare()
    {
        return this.rare;
    }

    public void setRare(String value)
    {
        if (this.rare != value) {

            String oldValue = this.rare;
            this.rare = value;
            this.firePropertyChange(PROPERTY_RARE, oldValue, value);
        }
    }

    public SideEffect withRare(String value)
    {
        setRare(value);
        return this;
    }

    public static final String PROPERTY_VERYRARE = "veryRare";

    @Column(columnDefinition="TEXT")
    private String veryRare;

    public String getVeryRare()
    {
        return this.veryRare;
    }

    public void setVeryRare(String value)
    {
        if (this.veryRare != value) {

            String oldValue = this.veryRare;
            this.veryRare = value;
            this.firePropertyChange(PROPERTY_VERYRARE, oldValue, value);
        }
    }

    public SideEffect withVeryRare(String value)
    {
        setVeryRare(value);
        return this;
    }

    public static final String PROPERTY_NOTKNOWN = "notKnown";

    @Column(columnDefinition="TEXT")
    private String notKnown;

    public String getNotKnown()
    {
        return this.notKnown;
    }

    public void setNotKnown(String value)
    {
        if (this.notKnown != value) {

            String oldValue = this.notKnown;
            this.notKnown = value;
            this.firePropertyChange(PROPERTY_NOTKNOWN, oldValue, value);
        }
    }

    public SideEffect withNotKnown(String value)
    {
        setNotKnown(value);
        return this;
    }
}
