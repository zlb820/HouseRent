package com.liu.service;

import java.util.List;

import com.liu.dto.UserDto;
import com.liu.entity.User;

public interface UserService {
	User login(String name,String pwd);
	void add(User u);
	List<User> find(UserDto dto);
	void del(int[] ids);
	void update(User user);
}
