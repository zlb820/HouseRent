package com.liu.service;

import java.util.List;

import com.liu.dto.StoreDto;
import com.liu.entity.Store;
import com.liu.util.Pager;

public interface StoreService {
	void add(Store store);
	
	void list(Pager<Store> pager, StoreDto store);
	
	void list(Pager<Store> pager);
	
	Store get(Integer id);
	
	void listHot(Pager<Store> pager);
	
	List<Store> listRecommend();
	
	List<Store> find(StoreDto dto);
	
	void del(int[] ids);
	
	void update(Store store);
}
