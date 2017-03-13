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
import com.liu.dto.OfficeDto;
import com.liu.entity.Office;
import com.liu.entity.Response;
import com.liu.service.OfficeService;
import com.liu.util.JSONUtils;
import com.liu.util.Pager;

@Controller
@RequestMapping("/officeRent")
public class OfficeController {
	@Autowired
	@Qualifier("officeService")
	private OfficeService officeService;
	
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="add")
	public String add(String office){
		String messgae = "";
		Office o = null;
		try {
			o = new Gson().fromJson(office, Office.class);
			o.setPubDate(new Date());
			o.setStatus(0);
			o.setBasicImg("images/office/o101.jpg");
			o.setPic01("images/office/o101.jpg");
			o.setPic02("images/office/o102.jpg");
			o.setPic03("images/office/o103.jpg");
			o.setPic04("images/office/o104.jpg");
			officeService.add(o);
			messgae = "添加"+o.getTitle()+"成功";
		} catch (Exception e) {
			e.printStackTrace();
			messgae = "添加"+o.getTitle()+"失败";
		}
		return JSONUtils.marshal(messgae);
	}
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="list",produces="application/json;charset=utf-8")
	public String list(Pager<Office> pager,OfficeDto office){
		officeService.list(pager, office);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="listSeeAgain",produces="application/json;charset=utf-8")
	public String list(Pager<Office> pager){
		officeService.list(pager);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	
	@RequestMapping(method=RequestMethod.GET,value="get")
	public String get(Integer id,ModelMap modelMap){
		Office office = officeService.get(id);
		modelMap.put("office", office);
		return "jsp/details/officeDetail";
	}
	
	@ResponseBody
	@RequestMapping(method=RequestMethod.POST,value="listHot",produces="application/json;charset=utf-8")
	public String listHot(Pager<Office> pager){
		officeService.listHot(pager);
		String result = JSONUtils.marshal(pager);
		return result;
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "find",produces="application/json;charset=utf-8")
	public Response find(OfficeDto office){
			System.out.println(office.getSearchValue());
			List<Office> o = officeService.find(office);
			Response r = new Response(o.size(),o);
			return r;
	}
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "del")
	public void del(int[] ids){
		officeService.del(ids);
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST,value = "update")
	public void update(String office){
		Office o = null;
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		o = gson.fromJson(office, Office.class);
		officeService.update(o);
	}
}
