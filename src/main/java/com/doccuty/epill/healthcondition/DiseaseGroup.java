package com.doccuty.epill.healthcondition;

import com.doccuty.epill.drug.Drug;
import com.doccuty.epill.model.util.UserSet;
import com.doccuty.epill.sideeffects.SideEffect;
import com.doccuty.epill.user.User;
import de.uniks.networkparser.EntityUtil;
import de.uniks.networkparser.interfaces.SendableEntity;

import javax.persistence.*;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "disease_groups")
public class DiseaseGroup implements SendableEntity {

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

    public boolean removePropertyChangeListener(String propertyName, PropertyChangeListener listener) {
        if (listeners != null) {
            listeners.removePropertyChangeListener(propertyName, listener);
        }
        return true;
    }

    //==========================================================================


    public void removeYou()
    {
        withoutUserSuffering(this.getUserSuffering().toArray(new User[this.getUserSuffering().size()]));
        firePropertyChange("REMOVE_YOU", this, null);
    }


    //==========================================================================

    public static final String PROPERTY_ID = "id";

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private int id;

    public int getId()
    {
        return this.id;
    }

    public void setId(int value)
    {
        if (this.id != value) {

            int oldValue = this.id;
            this.id = value;
            this.firePropertyChange(PROPERTY_ID, oldValue, value);
        }
    }

    public DiseaseGroup withId(int value)
    {
        setId(value);
        return this;
    }


    @Override
    public String toString()
    {
        StringBuilder result = new StringBuilder();

        result.append(" ").append(this.getId());
        result.append(" ").append(this.getDiseaseGroup());
        return result.substring(1);
    }



    //==========================================================================

    public static final String PROPERTY_DISEASEGROUP = "diseaseGroup";

    private String diseaseGroup;

    public String getDiseaseGroup()
    {
        return this.diseaseGroup;
    }

    public void setDiseaseGroup(String value)
    {
        if ( ! EntityUtil.stringEquals(this.diseaseGroup, value)) {

            String oldValue = this.diseaseGroup;
            this.diseaseGroup = value;
            this.firePropertyChange(PROPERTY_DISEASEGROUP, oldValue, value);
        }
    }



    public static final String PROPERTY_USERSUFFERING = "userSuffering";

    @ManyToMany(cascade = CascadeType.ALL, mappedBy = "sufferedDiseaseGroup")
    private Set<User> userSuffering = null;

    public Set<User> getUserSuffering() {
        if (this.userSuffering == null) {
            return UserSet.EMPTY_SET;
        }

        return this.userSuffering;
    }

    public DiseaseGroup withUserSuffering(User... value) {
        if (value == null) {
            return this;
        }
        for (User item : value) {
            if (item != null) {
                if (this.userSuffering == null) {
                    this.userSuffering = new UserSet();
                }

                boolean changed = this.userSuffering.add(item);

                if (changed) {
                    //item.withSufferedDiseaseGroup(this);
                    firePropertyChange(PROPERTY_USERSUFFERING, null, item);
                }
            }
        }
        return this;
    }

    public DiseaseGroup withoutUserSuffering(User... value) {
        for (User item : value) {
            if ((this.userSuffering != null) && (item != null)) {
                if (this.userSuffering.remove(item)) {
                    item.withoutSufferedDiseaseGroup(this);
                    firePropertyChange(PROPERTY_USERSUFFERING, item, null);
                }
            }
        }
        return this;
    }

    public User createUserSuffering() {
        User value = new User();
        withUserSuffering(value);
        return value;
    }

    public static final String PROPERTY_SIDEEFFECTS = "sideEffects";

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "diseaseGroup")
    private Set<SideEffect> sideEffects = null;

    public Set<SideEffect> getSideEffects() {
        if (this.sideEffects == null) {
            return new HashSet<>();
        }

        return this.sideEffects;
    }

    public DiseaseGroup withSideEffects(SideEffect... value) {
        if (value == null) {
            return this;
        }
        for (SideEffect item : value) {
            if (item != null) {
                if (this.sideEffects == null) {
                    this.sideEffects = new HashSet<>();
                }

                boolean changed = this.sideEffects.add(item);

                if (changed) {
                    item.withDiseaseGroup(this);
                    firePropertyChange(PROPERTY_SIDEEFFECTS, null, item);
                }
            }
        }
        return this;
    }

    public DiseaseGroup withoutSideEffects(SideEffect... value) {
        for (SideEffect item : value) {
            if ((this.sideEffects != null) && (item != null)) {
                if (this.sideEffects.remove(item)) {
                    item.setDiseaseGroup(null);
                    firePropertyChange(PROPERTY_SIDEEFFECTS, item, null);
                }
            }
        }
        return this;
    }

    public SideEffect createSideEffects() {
        SideEffect value = new SideEffect();
        withSideEffects(value);
        return value;
    }
}
