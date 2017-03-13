package com.liu.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.liu.dao.HouseRentDao;
import com.liu.dto.HouseDto;
import com.liu.entity.House;
import com.liu.service.HouseRentService;
import com.liu.util.Pager;

@Service("houseRentService")
@Transactional
public class HouseRentServiceImpl implements HouseRentService{

	@Autowired
	@Qualifier("houseRentDao")
	private HouseRentDao houseRentDao;

	@Override
	public void add(House h) {
		houseRentDao.add(h);
	}

	@Override
	public void list(Pager<House> pager, HouseDto house) {
		String hql = "from House h where 1 = 1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(house.getArea()!=0){
			hql+=" and h.area = :area";
			param.put("area", house.getArea());
		}
		if(house.getHall()!=0){
			hql+=" and h.hall = :hall";
			param.put("hall", house.getHall());
		}
		if(house.getWay()!=0){
			hql+=" and h.way = :way";
			param.put("way", house.getWay());
		}
		if(house.getHouseSource()!=0){
			hql+=" and h.houseSource = :houseSource";
			param.put("houseSource", house.getHouseSource());
		}
		if(house.getStartMoney()!=null){
			hql+=" and h.price >= :startMoney";
			param.put("startMoney", house.getStartMoney());
		}
		if(house.getEndMoney()!=null){
			hql+=" and h.price <= :endMoney";
			param.put("endMoney", house.getEndMoney());
		}
		if(house.getStartSquear()!=null){
			hql+=" and h.proportation >= :startSquear";
			param.put("startSquear", house.getStartSquear());
		}
		if(house.getEndSquear()!=null){
			hql+=" and h.proportation <= :endSquear";
			param.put("endSquear", house.getEndSquear());
		}
		if(StringUtils.isNotBlank(house.getSearchValue())){
			hql+=" and h.title like :searchValue";
			param.put("searchValue","%"+house.getSearchValue()+"%");
		}
		houseRentDao.query(hql, null, param, pager);
	}

	@Override
	public void list(Pager<House> pager) {
		String hql = "from House h where h.status = 2";
		houseRentDao.query(hql, pager);
	}

	@Override
	public House get(Integer id) {
		House h = houseRentDao.get(id);
		return h;
	}

	@Override
	public void listHot(Pager<House> pager) {
		String hql = "from House h where h.status = 1";
		houseRentDao.query(hql, pager);
	}

	@Override
	public List<House> listRecomment() {
		String hql = "from House h where h.status = 1";
		return houseRentDao.listRecomment(hql);
		
	}

	@Override
	public List<House> find(HouseDto dto) {
		String hql = "from House h where 1 = 1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(dto.getArea()!=0 && dto.getArea()!=null){
			hql+=" and h.area = :area";
			param.put("area", dto.getArea());
		}
		
		if(dto.getHouseSource()!=0 && dto.getHouseSource()!=null){
			hql+=" and h.houseSource = :houseSource";
			param.put("houseSource", dto.getHouseSource());
		}
		if(dto.getStartMoney()!=null){
			hql+=" and h.price >= :startMoney";
			param.put("startMoney", dto.getStartMoney());
		}
		if(dto.getEndMoney()!=null){
			hql+=" and h.price <= :endMoney";
			param.put("endMoney", dto.getEndMoney());
		}
		
		if(StringUtils.isNotBlank(dto.getSearchValue())){
			hql+=" and h.title like :searchValue";
			param.put("searchValue","%"+dto.getSearchValue()+"%");
		}
		return houseRentDao.listByDto(hql, dto);
	}

	@Override
	public void del(int[] ids) {
		houseRentDao.delBatch(ids);
		
	}

	@Override
	public void update(House house) {
		houseRentDao.update(house);
	}


	
}
