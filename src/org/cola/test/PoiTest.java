package org.cola.test;

import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.cola.util.db.DBResult;
import org.cola.util.db.DBUtil;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:PoiTest <br/>
 * Date:2014年12月5日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class PoiTest {

    /**
     * @param args
     * @throws SQLException
     * @throws IOException 
     */
    public static void main(String[] args) throws SQLException, IOException {
        DBUtil dbUtil = new DBUtil();

        String sql = "select msisdn 用户号码, user_id 用户编码, to_char(create_time, 'yyyy/mm/dd hh24:mi:ss') 开打日期  from test01 where rownum < 200000";
        int timeOut = 300;

        DBResult dbResult = dbUtil.executeQuery(sql, timeOut);

        if (dbResult.iErrorCode == 0) {
            Workbook wb = new SXSSFWorkbook(100);
            Sheet sheet = wb.createSheet("sheet1");
            
            // 生成表头
            Iterator<String> it = dbResult.titleList.iterator();
            Row row = sheet.createRow(0);
//            CellStyle headStyle = wb.createCellStyle();
//            headStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
//            headStyle.setFillBackgroundColor(IndexedColors.BRIGHT_GREEN.getIndex());
            for (int i = 0; it.hasNext(); ++i) {
                Cell cell = row.createCell(i);
                cell.setCellValue(it.next());
//                cell.setCellStyle(headStyle);
            }
            
            for (int i = 0; i < dbResult.iRowsCnt; ++i) {
                row = sheet.createRow(i + 1);
                for (int j = 0; j < dbResult.iColsCnt; ++j) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(dbResult.aaRes[i][j]);
                }
            }
            FileOutputStream fo = new FileOutputStream("demo01.xlsx");
            wb.write(fo);
            fo.close();
            ((SXSSFWorkbook)wb).dispose();
        }
    }

}
