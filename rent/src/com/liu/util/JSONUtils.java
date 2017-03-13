package com.liu.util;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JSONUtils {

	public static String marshal(final Object... obj) {
		Gson gson = null;
		if(obj!=null && obj.length>1){
			ExclusionStrategy myExclusionStrategy = new ExclusionStrategy() {
				@Override
				public boolean shouldSkipField(FieldAttributes fa) {
					return fa.getName().matches((String)(obj[1]));
				}
				
				@Override
				public boolean shouldSkipClass(Class<?> clazz) {
					return false;
				}
			};
			gson = new GsonBuilder().setExclusionStrategies(myExclusionStrategy).setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			
		}else{
			gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		}
		return gson.toJson(obj[0]);
	}
}
