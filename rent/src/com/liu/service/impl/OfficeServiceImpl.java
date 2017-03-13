package com.liu.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.liu.dao.OfficeDao;
import com.liu.dto.OfficeDto;
import com.liu.entity.Office;
import com.liu.service.OfficeService;
import com.liu.util.Pager;
@Service("officeService")
@Transactional
public class OfficeServiceImpl implements OfficeService{
	@Autowired
	@Qualifier("officeDao")
	private OfficeDao officeDao;

	@Override
	public void add(Office office) {
		officeDao.add(office);
	}

	@Override
	public void list(Pager<Office> pager, OfficeDto dto) {
		String hql = "from Office o where 1 = 1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(dto.getArea()!=0){
			hql+=" and o.area = :area";
			param.put("area", dto.getArea());
		}
		if(dto.getOfficeType()!=0){
			hql+=" and o.type = :officeType";
			param.put("officeType", dto.getOfficeType());
		}
		if(dto.getOfficeWay()!=0){
			hql+=" and o.officeWay = :officeWay";
			param.put("officeWay", dto.getOfficeWay());
		}
		if(dto.getOfficeSource()!=0){
			hql+=" and o.officeSource = :officeSource";
			param.put("officeSource", dto.getOfficeSource());
		}
		if(dto.getStartMoney()!=null){
			hql+=" and o.price >= :startMoney";
			param.put("startMoney", dto.getStartMoney());
		}
		if(dto.getEndMoney()!=null){
			hql+=" and o.price <= :endMoney";
			param.put("endMoney", dto.getEndMoney());
		}
		if(dto.getStartSquear()!=null){
			hql+=" and o.proportation >= :startSquear";
			param.put("startSquear", dto.getStartSquear());
		}
		if(dto.getEndSquear()!=null){
			hql+=" and o.proportation <= :endSquear";
			param.put("endSquear", dto.getEndSquear());
		}
		if(StringUtils.isNotBlank(dto.getSearchValue())){
			hql+=" and o.title like :searchValue";
			param.put("searchValue","%"+dto.getSearchValue()+"%");
		}
		officeDao.query(hql, null, param, pager);
	}

	@Override
	public void list(Pager<Office> pager) {
		String hql = "from Office o where o.status = 2";
		officeDao.query(hql, pager);
		
	}

	@Override
	public Office get(Integer id) {
		Office o = officeDao.get(id);
		return o;
	}

	@Override
	public void listHot(Pager<Office> pager) {
		String hql = "from Office o where o.status = 1";
		officeDao.query(hql, pager);
	}

	@Override
	public List<Office> listRecomment() {
		String hql = "from Office o where o.status = 1";
		return officeDao.listRecomment(hql);
	}

	@Override
	public List<Office> find(OfficeDto dto) {
		String hql = "from Office o where 1 = 1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(dto.getArea()!=0){
			hql+=" and o.area = :area";
			param.put("area", dto.getArea());
		}
		if(dto.getOfficeType()!=0){
			hql+=" and o.type = :officeType";
			param.put("officeType", dto.getOfficeType());
		}
		if(dto.getOfficeSource()!=0){
			hql+=" and o.officeSource = :officeSource";
			param.put("officeSource", dto.getOfficeSource());
		}
		if(dto.getStartMoney()!=null){
			hql+=" and o.price >= :startMoney";
			param.put("startMoney", dto.getStartMoney());
		}
		if(dto.getEndMoney()!=null){
			hql+=" and o.price <= :endMoney";
			param.put("endMoney", dto.getEndMoney());
		}
		
		if(StringUtils.isNotBlank(dto.getSearchValue())){
			hql+=" and o.title like :searchValue";
			param.put("searchValue","%"+dto.getSearchValue()+"%");
		}
		return officeDao.listByDto(hql, dto);
	}

	@Override
	public void del(int[] ids) {
		officeDao.delBatch(ids);
	}

	@Override
	public void update(Office office) {
		officeDao.update(office);
		
	}

}
