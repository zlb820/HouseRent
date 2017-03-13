package com.liu.dao.impl;

import org.springframework.stereotype.Repository;

import com.liu.dao.UserDao;
import com.liu.entity.User;
@Repository("userDao")
public class UserDaoImpl extends BaseDaoImpl<User> implements UserDao {

	@Override
	public User login(String name, String pwd) {
		String hql="from User where userName=? and password=?";
		return (User) super.findObject(hql, new Object[]{name,pwd});
	}

}
