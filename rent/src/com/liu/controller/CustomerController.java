package com.liu.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jfree.chart.servlet.ServletUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.liu.dto.CustomerDto;
import com.liu.entity.Customer;
import com.liu.entity.Response;
import com.liu.service.CustomerService;

@Controller
@RequestMapping("/customer")
public class CustomerController {
	@Autowired
	@Qualifier("customerService")
	private CustomerService customerService;
	
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "add",produces="application/json;charset=utf-8")
	public String add(String customer){
		Customer c = null;
		String msg = null;
		try{
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			c = gson.fromJson(customer, Customer.class);
			c.setLastModifyTime(new Date());
			customerService.add(c);
			msg = "添加"+c.getName()+"成功!";
		}catch(Exception e){
			e.printStackTrace();
			msg = "添加"+c.getName()+"失败!";
		}
		return msg;
	}
	
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "find")
	public Response find(CustomerDto dto){
			List<Customer> customer = customerService.find(dto);
			Response r = new Response(customer.size(),customer);
			return r;
	}
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "del")
	public void del(int[] ids){
		customerService.del(ids);
	}
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST,value = "update")
	public void update(String customer){
		Customer c = null;
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		c = gson.fromJson(customer, Customer.class);
		c.setLastModifyTime(new Date());
		customerService.update(c);
	}
	@RequestMapping("/pie")
	@ResponseBody
	public String pie(HttpSession session){
		String fileName=customerService.createPieFileName();
		return fileName;
	}
	
	@RequestMapping(method=RequestMethod.GET,value="chart")
	public String pie(HttpServletResponse response,String fileName){
		try {
			ServletUtilities.sendTempFile(fileName, response);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
}
