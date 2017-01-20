package cn.agilecode.ws.fileupload.controller;

public class FileUploadFeedback {

	private String msg;
	private int code;
	public FileUploadFeedback(int code, String msg) {
		this.code=code;
		this.msg=msg;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	
}
