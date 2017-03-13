package com.liu.service;

import java.util.List;

import com.liu.dto.HouseDto;
import com.liu.entity.House;
import com.liu.util.Pager;

public interface HouseRentService {

	void add(House h);

	void list(Pager<House> pager, HouseDto house);
	
	void list(Pager<House> pager);
	
	House get(Integer id);
	
	void listHot(Pager<House> pager);
	
	List<House> listRecomment();
	
	List<House> find(HouseDto dto);
	
	void del(int[] ids);
	
	void update(House house);
}
