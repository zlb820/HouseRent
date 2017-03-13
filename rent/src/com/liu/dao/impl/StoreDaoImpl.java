package com.liu.dao.impl;

import org.springframework.stereotype.Repository;

import com.liu.dao.StoreDao;
import com.liu.entity.Store;
@Repository("storeDao")
public class StoreDaoImpl extends BaseDaoImpl<Store> implements StoreDao{

}
