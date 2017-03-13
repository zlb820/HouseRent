package com.liu.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "t_house")
public class House {
	/** 主键 */
	private Integer id;
	/** 户型 ，厅室 */
	private Integer hall;
	/** 方式：整套出租，单间出租，床位出租 */
	private Integer way;
	/** 来源：全部，个人，经纪人 */
	private Integer houseSource;
	/** 区域 */
	private Integer area;
	/** 价格 */
	private Double price;
	/** 面积 */
	private Integer proportation;
	/** 房屋标题 */
	private String title;
	/** 房屋基本信息 */
	private String basicInfo;
	/** 位置信息 */
	private String location;
	/** 发布时间 */
	private Date pubDate;
	/** 基本图片 */
	private String basicImg;
	/** 状态信息：普通：0，热门：1，看了又看：2， */
	private Integer status;
	/** 付款方式：押一付一等 */
	private PayWay payway;
	/** 朝向 */
	private String direction;
	/** 楼层 */
	private Integer floor;
	/** 联系人 */
	private String linkMan;
	/** 联系人电话 */
	private String tel;
	/** 图片信息 */
	private String pic01;
	private String pic02;
	private String pic03;
	private String pic04;
	/** 房源详细信息 */
	private String detailInfo;
	/** map坐标点1 */
	private Double startPoint;
	/** map坐标点2 */
	private Double endPoint;

	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getProportation() {
		return proportation;
	}

	public void setProportation(Integer proportation) {
		this.proportation = proportation;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getBasicInfo() {
		return basicInfo;
	}

	public void setBasicInfo(String basicInfo) {
		this.basicInfo = basicInfo;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
	@JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
	public Date getPubDate() {
		return pubDate;
	}

	public void setPubDate(Date pubDate) {
		this.pubDate = pubDate;
	}

	public String getBasicImg() {
		return basicImg;
	}

	public void setBasicImg(String basicImg) {
		this.basicImg = basicImg;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	@ManyToOne
	@JoinColumn(name = "payWay_id")
	public PayWay getPayway() {
		return payway;
	}

	public void setPayway(PayWay payway) {
		this.payway = payway;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public Integer getFloor() {
		return floor;
	}

	public void setFloor(Integer floor) {
		this.floor = floor;
	}

	public String getLinkMan() {
		return linkMan;
	}

	public void setLinkMan(String linkMan) {
		this.linkMan = linkMan;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getPic01() {
		return pic01;
	}

	public void setPic01(String pic01) {
		this.pic01 = pic01;
	}

	public String getPic02() {
		return pic02;
	}

	public void setPic02(String pic02) {
		this.pic02 = pic02;
	}

	public String getPic03() {
		return pic03;
	}

	public void setPic03(String pic03) {
		this.pic03 = pic03;
	}

	public String getPic04() {
		return pic04;
	}

	public void setPic04(String pic04) {
		this.pic04 = pic04;
	}

	public String getDetailInfo() {
		return detailInfo;
	}

	public void setDetailInfo(String detailInfo) {
		this.detailInfo = detailInfo;
	}

	public Double getStartPoint() {
		return startPoint;
	}

	public void setStartPoint(Double startPoint) {
		this.startPoint = startPoint;
	}

	public Double getEndPoint() {
		return endPoint;
	}

	public void setEndPoint(Double endPoint) {
		this.endPoint = endPoint;
	}

	public Integer getHouseSource() {
		return houseSource;
	}

	public void setHouseSource(Integer houseSource) {
		this.houseSource = houseSource;
	}

	public Integer getHall() {
		return hall;
	}

	public void setHall(Integer hall) {
		this.hall = hall;
	}

	public Integer getWay() {
		return way;
	}

	public void setWay(Integer way) {
		this.way = way;
	}

	public Integer getArea() {
		return area;
	}

	public void setArea(Integer area) {
		this.area = area;
	}

	
}
