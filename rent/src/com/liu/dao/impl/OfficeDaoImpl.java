package com.liu.dao.impl;

import org.springframework.stereotype.Repository;

import com.liu.dao.OfficeDao;
import com.liu.entity.Office;
@Repository("officeDao")
public class OfficeDaoImpl extends BaseDaoImpl<Office> implements OfficeDao{

}
