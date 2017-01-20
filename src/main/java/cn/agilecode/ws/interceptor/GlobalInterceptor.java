package cn.agilecode.ws.interceptor;


import java.io.UnsupportedEncodingException;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.propertyeditors.LocaleEditor;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.support.RequestContextUtils;

public class GlobalInterceptor extends LocaleChangeInterceptor implements HandlerInterceptor {
	
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception e)
			throws Exception {

	}

	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler, ModelAndView mav)
			throws Exception {
	}

	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) {
		try {
			request.setCharacterEncoding("utf-8");
			response.setCharacterEncoding("utf-8");
		} catch (UnsupportedEncodingException e) {
		}
		request.setAttribute("base", request.getContextPath());
		

		String localInRequest = request.getParameter(getParamName());
		Object localInSession = request.getSession().getAttribute(getParamName());

		if (localInSession==null && StringUtils.isEmpty(localInRequest)) {
			localInRequest = "zh";
		}

		// -- 如果没有改变语言返回true，否则要重置session中的值
		if (localInRequest==null || localInRequest.equals((String) localInSession))
			return true;

		reSetSessionLocale(request, response, localInRequest);

		return true;
	}

	private void reSetSessionLocale(HttpServletRequest request,
			HttpServletResponse response, String newLocale) {

//		request.getSession().setAttribute(getParamName(), newLocale);
//
//		LocaleResolver localeResolver = RequestContextUtils
//				.getLocaleResolver(request);
//		if (localeResolver == null) {
//			throw new IllegalStateException(
//					"No LocaleResolver found: not in a DispatcherServlet request?");
//		}
//
//		LocaleEditor localeEditor = new LocaleEditor();
//		localeEditor.setAsText(newLocale);
//		localeResolver.setLocale(request, response,(Locale) localeEditor.getValue());

	}
}

