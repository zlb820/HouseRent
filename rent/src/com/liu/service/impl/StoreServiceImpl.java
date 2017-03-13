package com.liu.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.liu.dao.StoreDao;
import com.liu.dto.StoreDto;
import com.liu.entity.Store;
import com.liu.service.StoreService;
import com.liu.util.Pager;
@Service("storeService")
@Transactional
public class StoreServiceImpl implements StoreService{

	@Autowired
	@Qualifier("storeDao")
	private StoreDao storeDao;
	@Override
	public void add(Store store) {
		storeDao.add(store);
	}
	@Override
	public void list(Pager<Store> pager, StoreDto store) {
		String hql = "from Store s where 1 = 1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(store.getArea()!=0){
			hql+=" and s.area = :area";
			param.put("area", store.getArea());
		}
		if(store.getStoreClassify()!=0){
			hql+=" and s.classify = :storeClassify";
			param.put("storeClassify", store.getStoreClassify());
		}
		if(store.getStoreSupply()!=0){
			hql+=" and s.supply = :storeSupply";
			param.put("storeSupply", store.getStoreSupply());
		}
		if(store.getStoreType()!=0){
			hql+=" and s.type = :storeType";
			param.put("storeType", store.getStoreType());
		}
		if(store.getStoreSource()!=0){
			hql+=" and s.storeSource = :storeSource";
			param.put("storeSource", store.getStoreSource());
		}
		if(store.getStartMoney()!=null){
			hql+=" and s.price >= :startMoney";
			param.put("startMoney", store.getStartMoney());
		}
		if(store.getEndMoney()!=null){
			hql+=" and s.price <= :endMoney";
			param.put("endMoney", store.getEndMoney());
		}
		if(store.getStartSquear()!=null){
			hql+=" and s.proportation >= :startSquear";
			param.put("startSquear", store.getStartSquear());
		}
		if(store.getEndSquear()!=null){
			hql+=" and s.proportation <= :endSquear";
			param.put("endSquear", store.getEndSquear());
		}
		if(StringUtils.isNotBlank(store.getSearchValue())){
			hql+=" and h.title like :searchValue";
			param.put("searchValue","%"+store.getSearchValue()+"%");
		}
		storeDao.query(hql, null, param, pager);
		
	}
	@Override
	public void list(Pager<Store> pager) {
		String hql = "from Store s where s.status = 2";
		storeDao.query(hql, pager);
	}
	@Override
	public Store get(Integer id) {
		Store s = storeDao.get(id);
		return s;
	}
	@Override
	public void listHot(Pager<Store> pager) {
		String hql = "from Store s where s.status = 1";
		storeDao.query(hql, pager);
	}
	@Override
	public List<Store> listRecommend() {
		String hql = "from Store s where s.status = 1";
		return storeDao.listRecomment(hql);
	}
	@Override
	public List<Store> find(StoreDto dto) {
		String hql = "from Store s where 1 = 1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(dto.getArea()!=0){
			hql+=" and s.area = :area";
			param.put("area", dto.getArea());
		}
		
		if(dto.getStoreType()!=0){
			hql+=" and s.type = :storeType";
			param.put("storeType", dto.getStoreType());
		}
		if(dto.getStoreSource()!=0){
			hql+=" and s.storeSource = :storeSource";
			param.put("storeSource", dto.getStoreSource());
		}
		if(dto.getStartMoney()!=null){
			hql+=" and s.price >= :startMoney";
			param.put("startMoney", dto.getStartMoney());
		}
		if(dto.getEndMoney()!=null){
			hql+=" and s.price <= :endMoney";
			param.put("endMoney", dto.getEndMoney());
		}
		
		if(StringUtils.isNotBlank(dto.getSearchValue())){
			hql+=" and h.title like :searchValue";
			param.put("searchValue","%"+dto.getSearchValue()+"%");
		}
		return storeDao.listByDto(hql, dto);
	}
	@Override
	public void del(int[] ids) {
		storeDao.delBatch(ids);
	}
	@Override
	public void update(Store store) {
		storeDao.update(store);
	}

}
