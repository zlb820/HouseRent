package com.liu.dao.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.math.BigInteger;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;

import com.liu.dao.BaseDao;
import com.liu.util.Pager;


/**
 * 
 * @author wanxing
 *
 * @param <T>
 */

@SuppressWarnings("unchecked")
public class BaseDaoImpl<T> implements BaseDao<T> {

	private SessionFactory sessionFactory;
	private Class<?> clz;
	
	public Class<?> getClz() {
		if(clz==null) {
			clz = ((Class<?>)(((ParameterizedType)(this.getClass().getGenericSuperclass())).getActualTypeArguments()[0]));
		}
		return clz;
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}
	
	@Resource
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	protected Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	
	@Override
	public T add(T t) {
		getSession().save(t);
		return t;
	}

	
	@Override
	public void update(T t) {
		System.out.println(t);
		getSession().update(t);
	}

	
	@Override
	public T delete(Serializable id) {
		T t = this.load(id);
		getSession().delete(t);
		return t;
	}

	
	@Override
	public T load(Serializable id) {
		return (T)getSession().load(getClz(), id);
	}

	@Override
	public List<T> list(String hql, Object[] args) {
		return this.list(hql, args, null);
	}

	@Override
	public List<T> list(String hql, Object arg) {
		return this.list(hql, new Object[]{arg});
	}

	@Override
	public List<T> list(String hql) {
		return this.list(hql,null);
	}
	
	
	@SuppressWarnings("rawtypes")
	private void setAliasParameter(Query query,Map<String,Object> alias) {
		if(alias!=null) {
			Set<String> keys = alias.keySet();
			for(String key:keys) {
				Object val = alias.get(key);
				if(val instanceof Collection) {
					query.setParameterList(key, (Collection)val);
				} else {
					query.setParameter(key, val);
				}
			}
		}
	}
	
	private void setDtoParameter(Query query, Object dto) {
		if(dto!=null){
			query.setProperties(dto);
		}
	}
	
	private void setParameter(Query query,Object[] args) {
		if(args!=null&&args.length>0) {
			int index = 0;
			for(Object arg:args) {
				query.setParameter(index++, arg);
			}
		}
	}

	@Override
	public List<T> list(String hql, Object[] args, Map<String, Object> alias) {
		Query query = getSession().createQuery(hql);
		setAliasParameter(query, alias);
		setParameter(query, args);
		return query.list();
	}

	@Override
	public List<T> listByAlias(String hql, Map<String, Object> alias) {
		return this.list(hql, null, alias);
	}

	@Override
	public Pager<T> query(String hql, Object[] args,Pager<T> pages) {
		return this.query(hql, args, null,pages);
	}

	@Override
	public Pager<T> query(String hql, Object arg,Pager<T> pages) {
		return this.query(hql, new Object[]{arg},pages);
	}

	@Override
	public Pager<T> query(String hql,Pager<T> pages) {
		return this.query(hql,new Object[]{},pages);
	}
	
	private  void setPagers(Query query,Pager pages) {
		Integer pageSize =pages.getiDisplayLength();
		Integer pageOffset =pages.getiDisplayStart();
		if(pageOffset==null||pageOffset<0) pageOffset = Pager.DISPLAY_START;
		if(pageSize==null||pageSize<0) pageSize = Pager.DISPLAY_LENGTH;
		pages.setiDisplayStart(pageOffset);
		pages.setiDisplayLength(pageSize);
		query.setFirstResult(pageOffset).setMaxResults(pageSize);
	}
	
	private String getCountHql(String hql,boolean isHql) {
		String e = hql.substring(hql.indexOf("from"));
		String c = "select count(*) "+e;
		if(isHql)
			c = c.replaceAll("fetch", "");
		return c;
	}

	@Override
	public Pager<T> query(String hql, Object[] args, Map<String, Object> alias,Pager<T> pages) {
		String cq = getCountHql(hql,true);
		Query cquery = getSession().createQuery(cq);
		Query query = getSession().createQuery(hql);
		setAliasParameter(query, alias);
		setAliasParameter(cquery, alias);
		setParameter(query, args);
		setParameter(cquery, args);
		setPagers(query,pages);
		List<T> datas = query.list();
		pages.setAaData(datas);
		long total = (Long)cquery.uniqueResult();
		pages.setiTotalRecords(total);
		return pages;
	}

	@Override
	public Pager<T> queryByAlias(String hql, Map<String, Object> alias,Pager<T> pages) {
		return this.query(hql,null, alias,pages);
	}

	@Override
	public Object findObject(String hql, Object[] args) {
		return this.findObject(hql, args,null);
	}

	@Override
	public Object findObject(String hql, Object arg) {
		return this.findObject(hql, new Object[]{arg});
	}

	@Override
	public Object findObject(String hql) {
		return this.findObject(hql,null);
	}
	
	@Override
	public Object findObject(String hql, Object[] args,
			Map<String, Object> alias) {
		Query query = getSession().createQuery(hql);
		setAliasParameter(query, alias);
		setParameter(query, args);
		return query.uniqueResult();
	}

	@Override
	public Object findObjectByAlias(String hql, Map<String, Object> alias) {
		return this.findObject(hql,null,alias);
	}

	@Override
	public void updateByHql(String hql, Object[] args) {
		Query query = getSession().createQuery(hql);
		setParameter(query, args);
		query.executeUpdate();
	}

	@Override
	public void updateByHql(String hql, Object arg) {
		this.updateByHql(hql,new Object[]{arg});
	}

	@Override
	public void updateByHql(String hql) {
		this.updateByHql(hql,null);
	}

	@Override
	public <N extends Object>List<N> listBySql(String sql, Object[] args, Class<?> clz,
			boolean hasEntity) {
		return this.listBySql(sql, args, null, clz, hasEntity);
	}

	@Override
	public <N extends Object>List<N> listBySql(String sql, Object arg, Class<?> clz,
			boolean hasEntity) {
		return this.listBySql(sql, new Object[]{arg}, clz, hasEntity);
	}

	@Override
	public <N extends Object>List<N> listBySql(String sql, Class<?> clz, boolean hasEntity) {
		return this.listBySql(sql, null, clz, hasEntity);
	}

	@Override
	public <N extends Object>List<N> listBySql(String sql, Object[] args,
			Map<String, Object> alias, Class<?> clz, boolean hasEntity) {
		SQLQuery sq = getSession().createSQLQuery(sql);
		setAliasParameter(sq, alias);
		setParameter(sq, args);
		if(hasEntity) {
			sq.addEntity(clz);
		} else 
			sq.setResultTransformer(Transformers.aliasToBean(clz));
		return sq.list();
	}

	@Override
	public <N extends Object>List<N> listByAliasSql(String sql, Map<String, Object> alias,
			Class<?> clz, boolean hasEntity) {
		return this.listBySql(sql, null, alias, clz, hasEntity);
	}

	@Override
	public <N extends Object>Pager<N> findBySql(String sql, Object[] args, Class<?> clz,
			boolean hasEntity,Pager<N> pager) {
		return this.findBySql(sql, args, null, clz, hasEntity,pager);
	}

	@Override
	public <N extends Object>Pager<N> findBySql(String sql, Object arg, Class<?> clz,
			boolean hasEntity,Pager<N> pager) {
		return this.findBySql(sql, new Object[]{arg}, clz, hasEntity,pager);
	}

	@Override
	public <N extends Object>Pager<N> findBySql(String sql, Class<?> clz, boolean hasEntity,Pager<N> pager) {
		return this.findBySql(sql, null, clz, hasEntity,pager);
	}

	@Override
	public <N extends Object>Pager<N> findBySql(String sql, Object[] args,
			Map<String, Object> alias, Class<?> clz, boolean hasEntity,Pager<N> pages) {
		String cq = getCountHql(sql,false);
		SQLQuery sq = getSession().createSQLQuery(sql);
		SQLQuery cquery = getSession().createSQLQuery(cq);
		setAliasParameter(sq, alias);
		setAliasParameter(cquery, alias);
		setParameter(sq, args);
		setParameter(cquery, args);
		setPagers(sq, pages);
		if(hasEntity) {
			sq.addEntity(clz);
		} else {
			sq.setResultTransformer(Transformers.aliasToBean(clz));
		}
		List<N> datas = sq.list();
		pages.setAaData(datas);
		long total = ((BigInteger)cquery.uniqueResult()).longValue();
		pages.setiTotalRecords(total);
		return pages;
	}

	@Override
	public <N extends Object>Pager<N> findByAliasSql(String sql, Map<String, Object> alias,
			Class<?> clz, boolean hasEntity,Pager<N> pager) {
		return this.findBySql(sql, null, alias, clz, hasEntity,pager);
	}

	@Override
	public List<T> listByDto(String hql, Object[] args, Object dto) {
		Query query = getSession().createQuery(hql);
		setDtoParameter(query, dto);
		setParameter(query, args);
		return query.list();
	}

	@Override
	public List<T> listByDto(String hql, Object dto) {
		return listByDto(hql, null, dto);
	}

	@Override
	public Pager<T> queryByDto(String hql, Object[] args, Object dto,Pager<T> pages) {
		String cq = getCountHql(hql,true);
		Query cquery = getSession().createQuery(cq);
		Query query = getSession().createQuery(hql);
		setDtoParameter(query, dto);
		setDtoParameter(cquery, dto);
		setParameter(query, args);
		setParameter(cquery, args);
		setPagers(query,pages);
		List<T> datas = query.list();
		pages.setAaData(datas);
		long total = (Long)cquery.uniqueResult();
		pages.setiTotalRecords(total);
		return pages;
	}

	@Override
	public Pager<T> queryByDto(String hql, Object dto,Pager<T> pages) {
		return queryByDto(hql, null, dto,pages);
	}

	@Override
	public Object findObjectByDto(String hql, Object[] args, Object dto) {
		Query query = getSession().createQuery(hql);
		setDtoParameter(query, dto);
		setParameter(query, args);
		return query.uniqueResult();
	}

	@Override
	public Object findObjectByDto(String hql, Object dto) {
		return findObjectByDto(hql, null, dto);
	}

	@Override
	public void updateByDto(String hql, Object dto) {
		Query query = getSession().createQuery(hql);
		setDtoParameter(query, dto);
		query.executeUpdate();
	}

	@Override
	public void updateByAlias(String hql, Map<String, Object> alias) {
		Query query = getSession().createQuery(hql);
		setAliasParameter(query, alias);
		query.executeUpdate();
	}

	@Override
	public T get(Serializable id) {
		return (T) this.getSession().get(getClz(), id);
	}

	@Override
	public void saveOrUpdate(T t) {
		this.getSession().saveOrUpdate(t);
	}

	@Override
	public List<T> listRecomment(String hql) {
		Query query = getSession().createQuery(hql);
		query.setFirstResult(0);
		query.setMaxResults(3);
		return query.list();
	}

	@Override
	public void delBatch(int[] ids) {
		for(int id : ids){
			getSession().delete(get(id));
		}
	}

}
