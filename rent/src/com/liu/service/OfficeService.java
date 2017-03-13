package com.liu.service;

import java.util.List;

import com.liu.dto.OfficeDto;
import com.liu.entity.Office;
import com.liu.util.Pager;

public interface OfficeService {
	void add(Office office);
	
	void list(Pager<Office> pager,OfficeDto dto);
	
	void list(Pager<Office> pager);
	
	Office get(Integer id);
	
	void listHot(Pager<Office> pager);
	
	List<Office> listRecomment();
	
	List<Office> find(OfficeDto dto);
	
	void del(int[] ids);
	
	void update(Office office);
}

