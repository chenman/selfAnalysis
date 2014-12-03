package org.cola.util.common;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:JxlUtil <br/>
 * Date:2014年3月31日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class JxlUtil {
    public static void exportExcel(List list, String fileName,
            HttpServletResponse response) throws IOException,
            RowsExceededException, WriteException {
        if (list.size() < 1) {
            return;
        }
        List titleList = (List) list.get(0);

        OutputStream os = null;
        response.reset();
        os = response.getOutputStream(); // 取得输出流
        response.setHeader("Content-disposition", "attachment; filename="
                + new String(fileName.getBytes(), "ISO-8859-1") + ".xls"); // 设定输出文件头
        response.setContentType("application/msexcel"); // 定义输出类型

        WritableWorkbook book = Workbook.createWorkbook(os);

        int rowNum = list.size() - 1;
        int colNum = titleList.size();

        int sheetNum = (int) Math.ceil(1.0 * rowNum / Constants.ROW_PRE_SHEET);
        if (sheetNum == 0) {
            WritableSheet sheet = book.createSheet("表单0", 0);
            for (int z = 0; z < colNum; ++z) {
                sheet.addCell(new Label(z, 0, (String) titleList.get(z)));
            }
        } else {
            List row = null;
            for (int i = 0; i < sheetNum; ++i) {
                WritableSheet sheet = book.createSheet("表单" + i, i);
                for (int z = 0; z < colNum; ++z) {
                    sheet.addCell(new Label(z, 0, (String) titleList.get(z)));
                }
                for (int j = 0; j < Constants.ROW_PRE_SHEET && i * Constants.ROW_PRE_SHEET + j < rowNum; ++j) {
                    row = (List) list.get(i * Constants.ROW_PRE_SHEET + j + 1);
                    for (int k = 0; k < colNum; ++k) {
                        sheet.addCell(new Label(k, j + 1, (String) row.get(k)));
                    }
                }
            }
        }
        book.write();
        book.close();
    }
}
