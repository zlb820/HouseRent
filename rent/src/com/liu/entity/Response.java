package com.liu.entity;

import java.io.Serializable;
import java.util.List;

public class Response implements Serializable{

	private static final long serialVersionUID = -8789128492371082698L;
	private int status;
	private int totalRows;
	private List<?> data;
	public Response(){}
	public Response(int total,List<?> data){
		 this.status=0;
		 this.totalRows=total;
		 this.data=data;
	 }
	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}
	/**
	 * @return the totalRows
	 */
	public int getTotalRows() {
		return totalRows;
	}
	/**
	 * @param totalRows the totalRows to set
	 */
	public void setTotalRows(int totalRows) {
		this.totalRows = totalRows;
	}
	/**
	 * @return the data
	 */
	public List<?> getData() {
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(List<?> data) {
		this.data = data;
	}
}
