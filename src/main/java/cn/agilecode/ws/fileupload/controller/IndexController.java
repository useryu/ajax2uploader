package cn.agilecode.ws.fileupload.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class IndexController extends BaseController {

	@RequestMapping(value = "/index", method = { RequestMethod.GET })
	public String toIndex() {
		return "/main/index";
	}
	
	@RequestMapping(value = "/", method = { RequestMethod.GET })
	public String toAjax() {
		return "/main/ajax";
	}
	
	@RequestMapping(value = "/ajax/fileUploader", method = { RequestMethod.POST } , produces = "application/json")
	@ResponseBody
	public FileUploadFeedback ajaxFileUploader(HttpServletRequest req) throws IOException {
        InputStream in = req.getInputStream();
        String filename = req.getHeader("filename");
        filename=URLDecoder.decode(filename,"utf8");
        if(filename==null) {
        	return new FileUploadFeedback(-1,"未上传任何东西");
        }
        // 这里是为了获取文件扩展名，有点小问题
        String extention = filename.substring(filename.lastIndexOf('.') + 1);
        File uploadedFile = File.createTempFile("upload_", "."+extention);
        OutputStream out = new FileOutputStream(uploadedFile);
        int len = -1;
        byte[] buffer = new byte[1024];

        while ((len = in.read(buffer)) != -1) {
            out.write(buffer, 0, len);
        }

        in.close();
        out.close();
		FileUploadFeedback back = new FileUploadFeedback(0,"文件上传成功"+filename);
		return back ;
	}
}
