package cn.agilecode.ws.fileupload.websocket;

public class UploadReceivedDataOut {

	private String type;
	private String message;
	private long bytesRead;
	private int code;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public long getBytesRead() {
		return bytesRead;
	}
	public void setBytesRead(long bytesRead) {
		this.bytesRead = bytesRead;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
}
