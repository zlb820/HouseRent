package com.liu.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
@Entity
@Table(name="t_customer")
public class Customer {
	private Integer id;
	private String name;				//客户姓名
	private String sex;				//客户性别
	private Date birthday;				//客户生日
	private String phone;				//客户手机号
	private String email;				//电子邮箱
	private String address;				//用户地址
	private String note;				//备注信息
	private Integer payTimes;				//消费次数
	private Double totalPay;				//消费总金额
	private Date lastModifyTime;//最后修改时间
	private Double serviceSatisfy;//服务满意度
	private String honstLevel;//信誉等级
	private Integer valuelevel;//价值等级
	
	
	@Temporal(TemporalType.TIMESTAMP)
	@DateTimeFormat(pattern="yyyy-MM-dd")
	@JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
	public Date getLastModifyTime() {
		return lastModifyTime;
	}
	public void setLastModifyTime(Date lastModifyTime) {
		this.lastModifyTime = lastModifyTime;
	}
	
	public Double getServiceSatisfy() {
		return serviceSatisfy;
	}
	public void setServiceSatisfy(Double serviceSatisfy) {
		this.serviceSatisfy = serviceSatisfy;
	}
	
	public String getHonstLevel() {
		return honstLevel;
	}
	public void setHonstLevel(String honstLevel) {
		this.honstLevel = honstLevel;
	}
	public Integer getValuelevel() {
		return valuelevel;
	}
	public void setValuelevel(Integer valuelevel) {
		this.valuelevel = valuelevel;
	}
	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	@Temporal(TemporalType.TIMESTAMP)
	@DateTimeFormat(pattern="yyyy-MM-dd")
	@JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public Integer getPayTimes() {
		return payTimes;
	}
	public void setPayTimes(Integer payTimes) {
		this.payTimes = payTimes;
	}
	public Double getTotalPay() {
		return totalPay;
	}
	public void setTotalPay(Double totalPay) {
		this.totalPay = totalPay;
	}
	

}
