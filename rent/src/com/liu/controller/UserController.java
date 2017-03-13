package com.liu.controller;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.liu.dto.UserDto;
import com.liu.entity.Response;
import com.liu.entity.User;
import com.liu.service.UserService;
import com.liu.util.LoginException;

@Controller
@RequestMapping("/")
public class UserController {
	@Autowired
	@Qualifier("userService")
	private UserService userService;
	private String msg;

	public void setMsg(String msg) {
		this.msg = msg;
	}

	@RequestMapping("login")
	public String login(String name, String pwd, HttpServletRequest req) {
		User u = userService.login(name, pwd);
		HttpSession session = req.getSession();
		session.setAttribute("loginUser", u);
		if (name.equals("admin")) {
			return "manage/main";
		}
		return "redirect:index/list";
	}

	@ExceptionHandler(value = { LoginException.class })
	public String loginHandler(LoginException ex, HttpServletRequest req) {
		req.setAttribute("ex", ex);
		return "forward:/login.jsp";

	}

	@RequestMapping("/to")
	public String to() {
		return "sys/user";
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "add", produces = "application/json;charset=utf-8")
	public String add(String user, HttpServletRequest req) {
		User u = null;
		try {
			HttpSession session = req.getSession();
			User loginUser = (User) session.getAttribute("loginUser");
			String operator = loginUser.getRealname();
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			u = gson.fromJson(user, User.class);
			u.setLastModifyTime(new Date());
			u.setOperator(operator);
			userService.add(u);
			msg = "添加" + u.getUsername() + "成功!";
		} catch (Exception e) {
			e.printStackTrace();
			msg = "添加" + u.getUsername() + "失败!";
		}
		return msg;
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, value = "find")
	public Response find(UserDto userDto) {
		System.out.println(userDto);
		List<User> user = userService.find(userDto);
		Response r = new Response(user.size(), user);
		return r;
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "del")
	public void del(int[] ids) {
		userService.del(ids);
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "update")
	public void update(String user, HttpServletRequest req) {
		User u = null;
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		u = gson.fromJson(user, User.class);
		HttpSession session = req.getSession();
		User loginUser = (User) session.getAttribute("loginUser");
		String operator = loginUser.getRealname();
		u.setLastModifyTime(new Date());
		u.setOperator(operator);
		userService.update(u);
	}
}
