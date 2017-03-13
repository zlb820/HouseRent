package com.liu.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.liu.util.Pager;


public interface BaseDao<T> {

	/**
	 * 添加对象
	 * 
	 * @param t
	 * @return
	 */
	public T add(T t);
	
	public void saveOrUpdate(T t);

	/**
	 * 更新对象
	 * 
	 * @param t
	 */
	public void update(T t);

	/**
	 * 根据id删除对象
	 * 
	 * @param id
	 */
	public T delete(Serializable id);
	
	public void delBatch(int[] ids);

	/**
	 * 根据id加载对象
	 * 
	 * @param id
	 * @return
	 */
	public T load(Serializable id);
	
	/**
	 * 根据id查找对象
	 * 
	 * @param id
	 * @return
	 */
	public T get(Serializable id);

	/**
	 * 不分页的查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            查询参数
	 * @param alias
	 *            别名参数
	 * @return 数据列表
	 */
	public List<T> list(String hql, Object[] args, Map<String, Object> alias);

	/**
	 * 不分页的查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            查询参数
	 * @param dto
	 *            数据传输对象
	 * @return 数据列表
	 */
	public List<T> listByDto(String hql, Object[] args, Object dto);

	/**
	 * 不分页的查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param dto
	 *            数据传输对象
	 * @return 数据列表
	 */
	public List<T> listByDto(String hql, Object dto);

	/**
	 * 根据别名查询的不分页查询
	 * 
	 * @param hql
	 *            要查询的HQL
	 * @param alias
	 *            别名参数
	 * @return 数据列表
	 */
	public List<T> listByAlias(String hql, Map<String, Object> alias);

	/**
	 * 参数查询的不分页查询
	 * 
	 * @param hql
	 *            要查询的HQL
	 * @param args
	 *            列表参数
	 * @return 数据列表
	 */
	public List<T> list(String hql, Object[] args);

	/**
	 * 带一个参数的不分页查询
	 * 
	 * @param hql
	 *            要查询的HQL
	 * @param arg
	 *            一个参数
	 * @return 数据列表
	 */
	public List<T> list(String hql, Object arg);

	/**
	 * 不带参数的不分页查询
	 * 
	 * @param hql
	 *            要查询的HQL
	 * @return 数据列表
	 */
	public List<T> list(String hql);
	
	/**
	 * 首页查询推荐
	 * CLY 2016-5-12
	 * @param hql
	 * @return
	 */
	public List<T> listRecomment(String hql);

	/**
	 * HQL分页查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            查询参数
	 * @param alias
	 *            别名参数
	 * @return 分页对象
	 */
	public Pager<T> query(String hql, Object[] args, Map<String, Object> alias,Pager<T> pages);

	/**
	 * HQL分页查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            查询参数
	 * @param dto
	 *            数据传输对象
	 * @return 分页对象
	 */
	public Pager<T> queryByDto(String hql, Object[] args, Object dto,Pager<T> pages);

	/**
	 * HQL分页查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param dto
	 *            数据传输对象
	 * @return 分页对象
	 */
	public Pager<T> queryByDto(String hql, Object dto,Pager<T> pages);

	/**
	 * HQL根据别名分页查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param alias
	 *            别名参数
	 * @return 分页对象
	 */
	public Pager<T> queryByAlias(String hql, Map<String, Object> alias,Pager<T> pages);

	/**
	 * HQL根据参数列表分页查询
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            查询参数
	 * @return 分页对象
	 */
	public Pager<T> query(String hql, Object[] args,Pager<T> pages);

	/**
	 * HQL只有一个参数的分页查询
	 * 
	 * @param hql
	 *            要查询的HQL
	 * @param arg
	 *            查询参数
	 * @return 分页对象
	 */
	public Pager<T> query(String hql, Object arg,Pager<T> pages);

	/**
	 * HQL不带参数的查询
	 * 
	 * @param hql
	 *            要查询的HQL
	 * @return 分页对象
	 */
	public Pager<T> query(String hql,Pager<T> pages);

	/**
	 * HQL查询一个对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param alias
	 *            别名参数
	 * @return 查询到的对象
	 */
	public Object findObjectByAlias(String hql, Map<String, Object> alias);

	/**
	 * HQL查询一个对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            参数列表
	 * @return 查询到的对象
	 */
	public Object findObject(String hql, Object[] args);

	/**
	 * HQL查询一个对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param arg
	 *            一个参数
	 * @return 查询到的对象
	 */
	public Object findObject(String hql, Object arg);

	/**
	 * HQL查询一个对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @return 查询到的对象
	 */
	public Object findObject(String hql);

	/**
	 * HQL查询一个对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            参数列表
	 * @param alias
	 *            别名参数
	 * @return 查询到的对象
	 */
	public Object findObject(String hql, Object[] args,
			Map<String, Object> alias);

	/**
	 * HQL查询一个对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param args
	 *            参数列表
	 * @param dto
	 *            数据传输对象
	 * @return 查询到的对象
	 */
	public Object findObjectByDto(String hql, Object[] args, Object dto);

	/**
	 * HQL查询对象
	 * 
	 * @param hql
	 *            要查询的HQL语句
	 * @param dto
	 *            数据传输对象
	 * @return 查询到的对象
	 */
	public Object findObjectByDto(String hql, Object dto);

	/**
	 * 根据HQL更新对象
	 * 
	 * @param hql
	 *            更新的HQL语句
	 * @param args
	 *            参数列表
	 */
	public void updateByHql(String hql, Object[] args);

	/**
	 * 根据HQL更新对象
	 * 
	 * @param hql
	 *            更新的HQL语句
	 * @param arg
	 *            一个参数
	 */
	public void updateByHql(String hql, Object arg);

	/**
	 * 根据HQL更新对象
	 * 
	 * @param hql
	 *            更新的HQL语句
	 * @param dto
	 *            数据传输对象
	 */
	public void updateByDto(String hql, Object dto);

	/**
	 * 根据HQL更新对象
	 * 
	 * @param hql
	 *            更新的HQL语句
	 * @param alias
	 *            别名参数
	 */
	public void updateByAlias(String hql, Map<String, Object> alias);

	/**
	 * 根据HQL更新对象
	 * 
	 * @param hql
	 *            要更新的HQL
	 */
	public void updateByHql(String hql);

	/**
	 * sql查询
	 * 
	 * @param sql
	 *            查询的SQL语句
	 * @param args
	 *            参数列表
	 * @param clz
	 *            查询的对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 数据列表
	 */
	public <N extends Object> List<N> listBySql(String sql, Object[] args,
			Class<?> clz, boolean hasEntity);

	/**
	 * sql查询
	 * 
	 * @param sql
	 *            查询的SQL语句
	 * @param arg
	 *            一个参数
	 * @param clz
	 *            查询对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 数据列表
	 */
	public <N extends Object> List<N> listBySql(String sql, Object arg,
			Class<?> clz, boolean hasEntity);

	/**
	 * sql查询
	 * 
	 * @param sql
	 *            查询的sql语句
	 * @param clz
	 *            查询对象
	 * @param hasEntity
	 *            是不是一个被Hibetnate管理的对象
	 * @return 数据列表
	 */
	public <N extends Object> List<N> listBySql(String sql, Class<?> clz,
			boolean

			hasEntity);

	/**
	 * sql 查询
	 * 
	 * @param sql
	 *            查询的sql语句
	 * @param args
	 *            参数列表
	 * @param alias
	 *            别名列表
	 * @param clz
	 *            查询对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 数据列表
	 */
	public <N extends Object> List<N> listBySql(String sql, Object[] args,
			Map<String, Object> alias, Class<?> clz, boolean hasEntity);

	/**
	 * sql查询
	 * 
	 * @param sql
	 *            查询的sql语句
	 * @param alias
	 *            别名列表
	 * @param clz
	 *            查询对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 数据列表
	 */
	public <N extends Object> List<N> listByAliasSql(String sql,
			Map<String, Object>

			alias, Class<?> clz, boolean hasEntity);

	/**
	 * sql分页查询
	 * 
	 * @param sql
	 *            要查询的sql语句
	 * @param args
	 *            参数列表
	 * @param clz
	 *            查询的对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 分页对象
	 */
	public <N extends Object> Pager<N> findBySql(String sql, Object[] args,
			Class<?>

			clz, boolean hasEntity,Pager<N> pager);

	/**
	 * sql分页查询
	 * 
	 * @param sql
	 *            要查询的sql语句
	 * @param arg
	 *            一个参数
	 * @param clz
	 *            查询的对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 分页对象
	 */
	public <N extends Object> Pager<N> findBySql(String sql, Object arg,
			Class<?> clz, boolean hasEntity,Pager<N> pager);

	/**
	 * sql分页查询
	 * 
	 * @param sql
	 *            要查询的sql语句
	 * @param clz
	 *            查询的对象
	 * @param hasEntity
	 *            是不是一个被hibernate管理的对象
	 * @return 分页对象
	 */
	public <N extends Object> Pager<N> findBySql(String sql, Class<?> clz,
			boolean

			hasEntity,Pager<N> pager);

	/**
	 * sql分页查询
	 * 
	 * @param sql
	 *            要查询的sql语句
	 * @param args
	 *            参数列表
	 * @param alias
	 *            别名参数
	 * @param clz
	 *            查询的对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 分页对象
	 */
	public <N extends Object> Pager<N> findBySql(String sql, Object[] args,
			Map<String, Object> alias, Class<?> clz, boolean hasEntity,Pager<N> pager);

	/**
	 * sql 分页查询
	 * 
	 * @param sql
	 *            要查询的sql语句
	 * @param alias
	 *            别名参数
	 * @param clz
	 *            查询的对象
	 * @param hasEntity
	 *            是不是一个被Hibernate管理的对象
	 * @return 分页对象
	 */
	public <N extends Object> Pager<N> findByAliasSql(String sql,
			Map<String, Object>

			alias, Class<?> clz, boolean hasEntity,Pager<N> pager);

}
