package com.liu.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.liu.dto.StoreDto;
import com.liu.entity.Response;
import com.liu.entity.Store;
import com.liu.service.StoreService;
import com.liu.util.JSONUtils;
import com.liu.util.Pager;

@Controller
@RequestMapping("/storeRent")
public class StoreController {
	@Autowired
	@Qualifier("storeService")
	private StoreService storeService;
	
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="add")
	public String add(String store){
		String messgae = "";
		Store s = null;
		try {
			s = new Gson().fromJson(store, Store.class);
			s.setPubDate(new Date());
			s.setStatus(0);
			s.setBasicImg("images/store/s101.jpg");
		    s.setPic01("images/store/s101.jpg");
		    s.setPic02("images/store/s102.jpg");
		    s.setPic03("images/store/s103.jpg");
		    s.setPic04("images/store/s104.jpg");
			storeService.add(s);
			messgae = "添加"+s.getTitle()+"成功";
		} catch (Exception e) {
			e.printStackTrace();
			messgae = "添加"+s.getTitle()+"失败";
		}
		return JSONUtils.marshal(messgae);
	}
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="list",produces="application/json;charset=utf-8")
	public String list(Pager<Store> pager,StoreDto store){
		storeService.list(pager,store);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="listSeeAgain",produces="application/json;charset=utf-8")
	public String list(Pager<Store> pager){
		storeService.list(pager);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	
	@RequestMapping(method=RequestMethod.GET,value="get")
	public String get(Integer id,ModelMap modelMap){
		Store store = storeService.get(id);
		modelMap.put("store", store);
		return "jsp/details/StoreDetail";
	}
	
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="listHot",produces="application/json;charset=utf-8")
	public String listHot(Pager<Store> pager){
		storeService.listHot(pager);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "find",produces="application/json;charset=utf-8")
	public Response find(StoreDto store){
			List<Store> s = storeService.find(store);
			Response r = new Response(s.size(),s);
			return r;
	}
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "del")
	public void del(int[] ids){
		storeService.del(ids);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST,value = "update")
	public void update(String store){
		Store s = null;
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		s = gson.fromJson(store, Store.class);
		storeService.update(s);
	}
	
}
