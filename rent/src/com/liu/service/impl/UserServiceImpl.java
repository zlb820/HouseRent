package com.liu.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.liu.dao.UserDao;
import com.liu.dto.UserDto;
import com.liu.entity.User;
import com.liu.service.UserService;
import com.liu.util.LoginException;
@Service("userService")
@Transactional
public class UserServiceImpl implements UserService{

	private UserDao userDao;
	@Resource
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public User login(String name, String pwd) {
		User u = userDao.login(name, pwd);
		if(u == null){
			throw new LoginException("用户名密码不存在！");
		}
		return u;
	}

	@Override
	public void add(User u) {
		userDao.add(u);
	}

	@Override
	public List<User> find(UserDto dto) {
		String hql = "from User u where 1=1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(dto.getUsername()!=null){
			hql+=" and u.username = :username";
			param.put("username", dto.getUsername());
		}
		
		if(dto.getStartTime()!=null){
			hql+=" and u.lastModifyTime >= :startTime";
			param.put("startTime", dto.getStartTime());
		}
		if(dto.getEndTime()!=null){
			hql+=" and u.lastModifyTime <= :endTime";
			param.put("endTime", dto.getEndTime());
		}
		return userDao.listByDto(hql, dto);
		
	}

	@Override
	public void del(int[] ids) {
		userDao.delBatch(ids);
		
	}

	@Override
	public void update(User user) {
		userDao.update(user);
	}
	
	
}
