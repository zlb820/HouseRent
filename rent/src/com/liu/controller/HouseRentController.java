package com.liu.controller;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.liu.dto.HouseDto;
import com.liu.entity.House;
import com.liu.entity.Response;
import com.liu.service.HouseRentService;
import com.liu.util.JSONUtils;
import com.liu.util.Pager;

@Controller
@RequestMapping("/houseRent")
public class HouseRentController {
	
	@Autowired
	@Qualifier("houseRentService")
	private HouseRentService houseRentService;

	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="add")
	public String add(String house,HttpServletRequest request){
		String messgae = "";
		House h = null;
		try {
			h = new Gson().fromJson(house, House.class);
			h.setPubDate(new Date());
			h.setStatus(0);
			h.setBasicImg("images/house/h101.jpg");
			h.setPic01("images/house/h101.jpg");
			h.setPic02("images/house/h102.jpg");
			h.setPic03("images/house/h103.jpg");
			h.setPic04("images/house/h104.jpg");
			houseRentService.add(h);
			messgae = "添加"+h.getTitle()+"成功";
		} catch (Exception e) {
			e.printStackTrace();
			messgae = "添加"+h.getTitle()+"失败";
		}
		return JSONUtils.marshal(messgae);
	}
	
	
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="list",produces="application/json;charset=utf-8")
	public String list(Pager<House> pager,HouseDto house){
		houseRentService.list(pager,house);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="listSeeAgain",produces="application/json;charset=utf-8")
	public String list(Pager<House> pager){
		houseRentService.list(pager);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	
	@RequestMapping(method=RequestMethod.GET,value="getHouse")
	public String get(Integer id,ModelMap modelMap){
		House house = houseRentService.get(id);
		modelMap.put("house", house);
		return "jsp/details/houseDetail";
	}
	
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="listHot",produces="application/json;charset=utf-8")
	public String listHot(Pager<House> pager){
		houseRentService.listHot(pager);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "find",produces="application/json;charset=utf-8")
	public Response find(HouseDto house){
			System.out.println(house.getSearchValue());
			List<House> hh = houseRentService.find(house);
			Response r = new Response(hh.size(),hh);
			return r;
	}
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "del")
	public void del(int[] ids){
		houseRentService.del(ids);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST,value = "update")
	public void update(String house){
		House h = null;
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		h = gson.fromJson(house, House.class);
		houseRentService.update(h);
	}
//	@RequestMapping("/newAddimages")
//	public String newAddimages(MultipartFile[] tp ,HttpServletRequest request){
//		
//		
//		String Nfileurl = request.getSession().getServletContext().getRealPath(request.getRequestURI())+"/";
//		return "";
//	}
}
