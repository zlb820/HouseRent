package com.liu.service.impl;

import java.awt.Font;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.servlet.ServletUtilities;
import org.jfree.chart.title.TextTitle;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.liu.dao.CustomerDao;
import com.liu.dto.CustomerDto;
import com.liu.entity.Customer;
import com.liu.service.CustomerService;
import com.liu.util.SystenContext;
@Service("customerService")
@Transactional
public class CustomerServiceImpl implements CustomerService{
	@Autowired
	@Qualifier("customerDao")
	private CustomerDao customerDao;
	
	@Override
	public void add(Customer c) {
		customerDao.add(c);
	}

	@Override
	public List<Customer> find(CustomerDto dto) {
		String hql = "from Customer c where 1=1";
		Map<String,Object> param  = new HashMap<String,Object>();
		if(dto.getName()!=null){
			hql+=" and c.name = :name";
			param.put("name", dto.getName());
		}
		
		if(dto.getStartTime()!=null){
			hql+=" and c.lastModifyTime >= :startTime";
			param.put("startTime", dto.getStartTime());
		}
		if(dto.getEndTime()!=null){
			hql+=" and c.lastModifyTime <= :endTime";
			param.put("endTime", dto.getEndTime());
		}
		return customerDao.listByDto(hql, dto);
	}

	@Override
	public void del(int[] ids) {
		customerDao.delBatch(ids);
	}

	@Override
	public void update(Customer c) {
		customerDao.update(c);
	}

	@Override
	public String createPieFileName() {
		String fileName="";
		List<Object[]> list=customerDao.countByHonstLevel();
		System.out.println(list);
		DefaultPieDataset ds=new DefaultPieDataset();
		for(Object[] arr:list){
			String deptname=arr[0].toString();
			Integer value=Integer.valueOf(arr[1].toString());
			ds.setValue(deptname, value);
		}
		JFreeChart chart=ChartFactory.createPieChart(null, ds, true, true, false);
		chart.setTitle(new TextTitle("信誉等级分析", new Font("微软雅黑", Font.BOLD, 18)));
		chart.getLegend().setItemFont(new Font("微软雅黑", Font.PLAIN, 14));
		PiePlot pp=(PiePlot) chart.getPlot();
		pp.setLabelFont(new Font("微软雅黑", Font.PLAIN, 14));
		HttpSession session=SystenContext.getSession();
		try {
			fileName=ServletUtilities.saveChartAsJPEG(chart, 700, 500, session);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fileName;
	}

}
