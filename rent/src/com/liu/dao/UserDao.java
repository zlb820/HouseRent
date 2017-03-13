package com.liu.dao;

import com.liu.entity.User;

public interface UserDao extends BaseDao<User>{
	
	User login(String name,String pwd);
}
