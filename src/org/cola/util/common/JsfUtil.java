package org.cola.util.common;

import java.util.Map;

import javax.faces.application.Application;
import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.el.ValueBinding;
import javax.faces.el.VariableResolver;
import javax.faces.event.ActionEvent;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:JsfUtil <br/>
 * Date:2014年3月21日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class JsfUtil {

    public static ValueBinding getValueBinding(String name) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        Application app = lfc.getApplication();
        return app.createValueBinding(name);
    }

    public static void setBindingValue(String name, Object value) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        ValueBinding vb = getValueBinding(name);
        if (vb == null)
            return;
        vb.setValue(lfc, value);
    }

    public static Object getBindingValue(String name) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        ValueBinding vb = getValueBinding(name);
        return vb.getValue(lfc);
    }

    public static Object getBindingMbean(String name) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        Application app = lfc.getApplication();
        VariableResolver localVariableResolver = app.getVariableResolver();
        Object localObject = localVariableResolver.resolveVariable(lfc, name);
        return localObject;
    }

    public static Object getRequestParameter(String name) {
        ExternalContext lec = FacesContext
                .getCurrentInstance().getExternalContext();
        Map map = lec.getRequestParameterMap();
        return map.get(name);
    }

    public static Map getRequestParameterMap() {
        ExternalContext lec = FacesContext.getCurrentInstance()
                .getExternalContext();
        return lec.getRequestParameterMap();
    }

    public static void setSessionAttr(String name, Object value) {
        if ((name == null) || (name.trim().equals("")))
            throw new IllegalArgumentException(
                    "Session Attribute can't be null or empty");
        ExternalContext localExternalContext = FacesContext
                .getCurrentInstance().getExternalContext();
        Map map = localExternalContext.getSessionMap();
        map.put(name, value);
    }

    public static Object getSessionAttr(String name) {
        if ((name == null) || (name.trim().equals("")))
            throw new IllegalArgumentException(
                    "Session Attribute can't be null or empty");
        ExternalContext localExternalContext = FacesContext
                .getCurrentInstance().getExternalContext();
        Map map = localExternalContext.getSessionMap();
        return map.get(name);
    }

    public static void addMessage(String uicid, String summary, String detail) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        try {
            FacesMessage lfm = new FacesMessage(summary, detail);
            lfc.addMessage(uicid, lfm);
        } catch (Exception ex) {
        }
    }

    public static void addMessage(String str, FacesMessage fm) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        try {
            lfc.addMessage(str, fm);
        } catch (Exception ex) {
        }
    }

    public static void addMessage(UIComponent component, String summary,
            String detail) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        FacesMessage lfm = new FacesMessage(summary, detail);
        if (component == null)
            addMessage(null, lfm);
        else
            addMessage(component.getClientId(lfc), lfm);
    }

    public static void addMessage(UIComponent component, String str) {
        FacesContext lfc = FacesContext.getCurrentInstance();
        FacesMessage lfm = new FacesMessage(str);
        if (component == null)
            addMessage(null, lfm);
        else 
            addMessage(component.getClientId(lfc), lfm);
    }

    public static void addMessage(ActionEvent event, String summary,
            String detail) {
        if (event == null)
            return;
        UIComponent component = event.getComponent();
        addMessage(component, summary, detail);
    }

    public static void addMessage(ActionEvent event, String str) {
        if (event == null)
            return;
        UIComponent component = event.getComponent();
        addMessage(component, str);
    }
}
