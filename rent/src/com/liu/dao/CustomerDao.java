package com.liu.dao;

import java.util.List;

import com.liu.entity.Customer;

public  interface CustomerDao extends BaseDao<Customer>{
	public List<Object[]> countByHonstLevel();
}
