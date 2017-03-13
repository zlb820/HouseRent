package com.liu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.liu.entity.House;
import com.liu.entity.Office;
import com.liu.entity.Store;
import com.liu.service.HouseRentService;
import com.liu.service.OfficeService;
import com.liu.service.StoreService;

@Controller
@RequestMapping("/index")
public class IndexController {
	@Autowired
	@Qualifier("houseRentService")
	private HouseRentService houseRentService;
	
	@Autowired
	@Qualifier("officeService")
	private OfficeService officeService;
	
	@Autowired
	@Qualifier("storeService")
	private StoreService storeService;
	
	@RequestMapping(method=RequestMethod.GET,value="list")
	public String list(ModelMap modelMap){
		List<House> house = houseRentService.listRecomment();
		List<Office> office = officeService.listRecomment();
		List<Store> store = storeService.listRecommend();
		modelMap.put("house", house);
		modelMap.put("office", office);
		modelMap.put("store", store);
		return "jsp/index";
	}
	

}
