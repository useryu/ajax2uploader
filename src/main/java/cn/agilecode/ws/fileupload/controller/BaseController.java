package cn.agilecode.ws.fileupload.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public abstract class BaseController implements ApplicationContextAware {
	
	protected static final Logger logger = Logger.getLogger(BaseController.class);
	
	protected ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext = applicationContext;
	}

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public Object getBean(String beanName) {
		return applicationContext.getBean(beanName);
	}

	public <T> T getBean(String beanName, Class<T> clazz) {
		return applicationContext.getBean(beanName, clazz);

	}
	
}
