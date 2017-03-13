package com.liu.util;

import javax.servlet.http.HttpSession;

public class SystenContext {
	private static ThreadLocal<Integer> pageNoTl=new ThreadLocal<Integer>();
	private static ThreadLocal<Integer> pageSizeTl=new ThreadLocal<Integer>();
	private static ThreadLocal<HttpSession> sessionTl=new ThreadLocal<HttpSession>();
	
	public static HttpSession getSession(){
		HttpSession session=sessionTl.get();
		return session;
	}
	
	public static void setSession(HttpSession session){
		sessionTl.set(session);
	}
	public static Integer getPageNo(){
		Integer pageNo=pageNoTl.get();
		return pageNo;
		
	}
	public static void setPageNo(Integer page){
		pageNoTl.set(page);
	}
	public static Integer getPageSize(){
		Integer pageSize=pageSizeTl.get();
		return pageSize;
	}
	public static void setPageSize(Integer rows){
		pageSizeTl.set(rows);
	}
	
	public static void clear(){
		Integer pageNo=pageNoTl.get();
		if(pageNo!=null){
			pageNoTl.remove();
		}
		Integer pageSize=pageSizeTl.get();
		if(pageSize!=null){
			pageSizeTl.remove();
		}
		HttpSession session=sessionTl.get();
		if(session!=null){
			sessionTl.remove();
		}
		
	}
}
