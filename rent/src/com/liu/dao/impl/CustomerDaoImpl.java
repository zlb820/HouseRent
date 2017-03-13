package com.liu.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.liu.dao.CustomerDao;
import com.liu.entity.Customer;
@Repository("customerDao")
public class CustomerDaoImpl extends BaseDaoImpl<Customer> implements CustomerDao{

	@Override
	public List<Object[]> countByHonstLevel() {
		String hql="select c.honstLevel,count(c.honstLevel) from Customer c group by c.honstLevel";
		List<Object[]> result = getSession().createQuery(hql).list();
		return result;
	}

}
