package com.isomorphic.examples.server.customBinaryField;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.isomorphic.datasource.BasicDataSource;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.servlet.ISCFileItem;

public class CustomBinaryFieldDataSource extends BasicDataSource{
	
	private byte[] fileData;
	private static List listData = new ArrayList();
	
	static {
        Map record1 = new HashMap();
        String desc1 = "Australian Made parchment paper offering archival life and laser compatibility in a range of six pastel shades and white. Centurion is manufactured from woodfree pulp under the strictest of conditions to comply with the interim standard for permanent pape";
        record1.put("id", 10001);
        record1.put("file", desc1.getBytes());
        record1.put("file_filename", "Copy_laser_Paper_Parchment_A4_110GSM_Buff.txt");
        record1.put("file_filesize", (desc1.getBytes()).length);
        record1.put("file_date_created", new Date());
        record1.put("description", desc1);
        listData.add(record1);
        
        Map record2 = new HashMap();
        String desc2 = "Makes copies of meetings in seconds. Features a rotating Mylar writing surface, uses standard thermal fax paper, includes an accessory tray that holds markers etc moves easily on durable castors, push button operation. Copying area is 830mm(h)x1300mm(w).";
        record2.put("id", 10002);
        record2.put("file", desc2.getBytes());
        record2.put("file_filename", "Whiteboard_Quartet_Electronic.txt");
        record2.put("file_filesize", (desc2.getBytes()).length);
        record2.put("file_date_created", new Date());
        record2.put("description", desc2);
        listData.add(record2);
        
        Map record3 = new HashMap();
        String desc3 = "The highest degree of writing comfort. PhD reduces gripping pressure by increasing the hand-to-grip surface with a large cushioned triangular grip. This provides exceptional control and balance, as well as less hand fatigue. Refillable and retractable. Al";
        record3.put("id", 10003);
        record3.put("file", desc3.getBytes());
        record3.put("file_filename", "Pens_Sanford_Phd_Ballpoint_Black_Barrel.txt");
        record3.put("file_filesize", (desc3.getBytes()).length);
        record3.put("file_date_created", new Date());
        record3.put("description", desc3);
        listData.add(record3);	 
	}
	
	@Override
	public DSResponse executeFetch(DSRequest dsRequest) throws Exception {
		DSResponse dsResponse = new DSResponse(this);
        // A normal fetch should generally *not* return binary data for the binary
        // field, because in most cases JavaScript logic in the browser would not be able to do
        // anything with it (there would be no way to, for example, launch a PDF viewer for a PDF
        // file included in Record data).  However the fetch operation is allowed to return binary
        // data encoded as text (generally base64) for the cases where this is useful (for example
        // some browsers support providing images as base64 encoded text).
        // _filename, _filesize and _date_created are implied whenever a field of type "binary" is declared.
		List list = new ArrayList();
		Map mapRecord = new HashMap();
        Iterator iterator = listData.iterator();
    	while (iterator.hasNext()) {
    		mapRecord = (Map)iterator.next();
    		mapRecord.remove("file");
    		list.add(mapRecord);
    	}
        dsResponse.setData(list);
        return dsResponse;  
    }
	
	@Override
	public DSResponse execute(DSRequest dsRequest) throws Exception {
		DSResponse dsResponse = new DSResponse(this);
		byte[] bytes = null;
		ISCFileItem item = null;
		Map result = dsRequest.getCriteria();
		String operationType = dsRequest.getOperationType();
		if (operationType.equals("viewFile")) {
			bytes = this.getBinaryResponse(result);
			result.put("file", bytes);
			result.put("file_filesize", (bytes == null)?0:bytes.length);
			dsResponse.setData(result);
		} else if (operationType.equals("downloadFile")) {
			bytes = this.getBinaryResponse(result);
			result.put("file", bytes);
			result.put("file_filesize", (bytes == null)?0:bytes.length);
			dsResponse.setData(result);
		} else if (operationType.equals("fetch")) {
			dsResponse = this.executeFetch(dsRequest);
		}else if (operationType.equals("add")) {
			item = dsRequest.getUploadedFile("file");
			fileData = item.get();
			dsResponse = this.executeAdd(dsRequest);
		}else if (operationType.equals("update")) {
			item = dsRequest.getUploadedFile("file");
			fileData = item.get();
			dsResponse = this.executeUpdate(dsRequest);
		}
		return dsResponse;
	}
	
	private byte[] getBinaryResponse(Map map) {
		byte[] bytes = null;
        Iterator iterator = listData.iterator();
    	while (iterator.hasNext()) {
    		Map mapRecord = (Map)iterator.next();
    		if (mapRecord.get("id").toString().equals(map.get("id").toString())) {
    			bytes = mapRecord.get("description").toString().getBytes(); 
    		}
    	}
    	return bytes;
	}
	
	@Override
	public DSResponse executeAdd(DSRequest dsRequest) throws Exception {
		DSResponse dsResponse = new DSResponse(this);
		Map newValues = dsRequest.getValues();
		newValues.put("file", fileData);
		newValues.put("file_date_created", new Date());
		dsResponse.setData(newValues);
        return dsResponse;  
	}
	
	@Override
	public DSResponse executeUpdate(DSRequest dsRequest) throws Exception {
		DSResponse dsResponse = new DSResponse(this);
		Map updateValues = dsRequest.getValues();
		updateValues.put("file", fileData);
		updateValues.put("file_date_created", new Date());
		dsResponse.setData(updateValues);
		return dsResponse;
	}
}
