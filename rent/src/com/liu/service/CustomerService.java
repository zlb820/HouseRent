package com.liu.service;

import java.util.List;

import com.liu.dto.CustomerDto;
import com.liu.entity.Customer;

public interface CustomerService {
	void add(Customer c);
	List<Customer> find(CustomerDto dto);
	void del(int[] ids);
	void update(Customer c);
	String createPieFileName();
}
