package com.liu.util;

import java.util.List;

/**
 * 分页对象
 */
public class Pager<T> {
	
	public static final Integer DISPLAY_LENGTH = 10;
	public static final Integer DISPLAY_START = 0;

	/**
	 * 分页的大小
	 */
	private Integer iDisplayLength;
	
	/**
	 * 分页的起始页
	 */
	private Integer iDisplayStart;
	
	/**
	 * 总记录数
	 */
	private Long iTotalRecords;
	
	/**
	 * 总记录数
	 */
	private Long iTotalDisplayRecords;
	
	/**
	 * 
	 */
	private List<T> aaData;

	public Integer getiDisplayLength() {
		return iDisplayLength;
	}

	public void setiDisplayLength(Integer iDisplayLength) {
		this.iDisplayLength = iDisplayLength;
	}

	public Integer getiDisplayStart() {
		return iDisplayStart;
	}

	public void setiDisplayStart(Integer iDisplayStart) {
		this.iDisplayStart = iDisplayStart;
	}

	public Long getiTotalRecords() {
		return iTotalRecords;
	}

	public void setiTotalRecords(Long iTotalRecords) {
		setiTotalDisplayRecords(iTotalRecords);
		this.iTotalRecords = iTotalRecords;
	}

	public List<T> getAaData() {
		return aaData;
	}

	public void setAaData(List<T> aaData) {
		this.aaData = aaData;
	}

	public Long getiTotalDisplayRecords() {
		return iTotalDisplayRecords;
	}

	public void setiTotalDisplayRecords(Long iTotalDisplayRecords) {
		this.iTotalDisplayRecords = iTotalDisplayRecords;
	}

	@Override
	public String toString() {
		return "Pager [iDisplayLength=" + iDisplayLength + ", iDisplayStart="
				+ iDisplayStart + ", iTotalRecords=" + iTotalRecords
				+ ", iTotalDisplayRecords=" + iTotalDisplayRecords
				+ ", aaData=" + aaData + "]";
	}
	
	


}
