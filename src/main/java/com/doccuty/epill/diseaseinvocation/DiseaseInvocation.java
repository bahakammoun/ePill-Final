/*
   Copyright (c) 2017 mac
   
   Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
   and associated documentation files (the "Software"), to deal in the Software without restriction, 
   including without limitation the rights to use, copy, modify, merge, publish, distribute, 
   sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
   furnished to do so, subject to the following conditions: 
   
   The above copyright notice and this permission notice shall be included in all copies or 
   substantial portions of the Software. 
   
   The Software shall be used for Good, not Evil. 
   
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
   BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 */
   
package com.doccuty.epill.diseaseinvocation;

import com.doccuty.epill.disease.Disease;
import com.doccuty.epill.user.User;
import de.uniks.networkparser.interfaces.SendableEntity;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.CreationTimestamp;

import java.beans.PropertyChangeListener;
import com.doccuty.epill.user.User;


@Entity
@Table(name="disease_invocation")
   public  class DiseaseInvocation implements SendableEntity
{

	
	public DiseaseInvocation() {
		
	}
	
	public DiseaseInvocation(Disease disease, Date timestamp, long cntr) {
		this.disease	= disease;
		this.timestamp	= timestamp;
		this.counter	= cntr;
	}
	
   
   //==========================================================================
   
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
      setDisease(null);
      setUser(null);
      firePropertyChange("REMOVE_YOU", this, null);
   }

   
   //==========================================================================
   
   public static final String PROPERTY_ID = "id";

   @Id
   @GeneratedValue(strategy=GenerationType.AUTO)
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
   
   public DiseaseInvocation withId(long value)
   {
      setId(value);
      return this;
   } 


   @Override
   public String toString()
   {
      StringBuilder result = new StringBuilder();
      
      result.append(" ").append(this.getId()).append(" ").append(this.getDisease());
      return result.substring(1);
   }


   
   //==========================================================================
   
   public static final String PROPERTY_TIMESTAMP = "timestamp";
   
   @CreationTimestamp
   @Column(nullable = false, updatable = false)
   private Date timestamp;

   public Date getTimestamp()
   {
      return this.timestamp;
   }
   
   public void setTimestamp(Date value)
   {
      if (this.timestamp != value) {
      
         Date oldValue = this.timestamp;
         this.timestamp = value;
         this.firePropertyChange(PROPERTY_TIMESTAMP, oldValue, value);
      }
   }
   
   public DiseaseInvocation withTimestamp(Date value)
   {
      setTimestamp(value);
      return this;
   } 
   
   
   //==========================================================================
   
   public static final String PROPERTY_COUNTER = "counter";
   
   @Transient
   private long counter;

   public long getCounter()
   {
      return this.counter;
   }
   
   public void setCounter(long value)
   {
      if (this.counter != value) {
      
         long oldValue = this.counter;
         this.counter = value;
         this.firePropertyChange(PROPERTY_COUNTER, oldValue, value);
      }
   }
   
   public DiseaseInvocation withCounter(long value)
   {
      setCounter(value);
      return this;
   }


//   //==========================================================================
//
//   public static final String PROPERTY_SESSION_COUNTER = "sessionCounter";
//
//   private long sessionCounter;
//
//   public long getSessionCounter()
//   {
//      return this.sessionCounter;
//   }
//
//   public void setSessionCounter(long value)
//   {
//      if (this.sessionCounter != value) {
//
//         long oldValue = this.sessionCounter;
//         this.sessionCounter = value;
//         this.firePropertyChange(PROPERTY_SESSION_COUNTER, oldValue, value);
//      }
//   }
//
//   public DiseaseInvocation withSessionCounter(long value)
//   {
//      setSessionCounter(value);
//      return this;
//   }
//
//
//

   /********************************************************************
    * <pre>
    *              many                       one
    * DiseaseInvocation ----------------------------------- Disease
    *              clicks                   disease
    * </pre>
    */

   public static final String PROPERTY_DISEASE= "disease";

   @ManyToOne(cascade=CascadeType.ALL)
   @JoinColumn(name="iddisease")
   private Disease disease = null;

   public Disease getDisease()
   {
      return this.disease;
   }

   public boolean setDisease(Disease value)
   {
      boolean changed = false;

      if (this.disease != value)
      {
         Disease oldValue = this.disease;

         if (this.disease != null)
         {
            this.disease = null;
            oldValue.withoutClicks(this);
         }

         this.disease = value;

         if (value != null)
         {
            value.withClicks(this);
         }

         firePropertyChange(PROPERTY_DISEASE, oldValue, value);
         changed = true;
      }

      return changed;
   }

   public DiseaseInvocation withDisease(Disease value)
   {
      setDisease(value);
      return this;
   }

   public Disease createDisease()
   {
      Disease value = new Disease();
      withDisease(value);
      return value;
   }



   
   /********************************************************************
    * <pre>
    *              many                       one
    * DiseaseInvocation ----------------------------------- User
    *              clicks                   user
    * </pre>
    */
   
   public static final String PROPERTY_USER = "user";

   @ManyToOne(cascade=CascadeType.ALL)
   @JoinColumn(name="iduser")
   private User user = null;

   public User getUser()
   {
      return this.user;
   }

   public boolean setUser(User value)
   {
      boolean changed = false;
      
      if (this.user != value)
      {
         User oldValue = this.user;
         
         if (this.user != null)
         {
            this.user = null;
            oldValue.withoutClicks(this);
         }
         
         this.user = value;
         
         if (value != null)
         {
            value.withClicks(this);
         }
         
         firePropertyChange(PROPERTY_USER, oldValue, value);
         changed = true;
      }
      
      return changed;
   }

   public DiseaseInvocation withUser(User value)
   {
      setUser(value);
      return this;
   } 

   public User createUser()
   {
      User value = new User();
      withUser(value);
      return value;
   } 
      
}
