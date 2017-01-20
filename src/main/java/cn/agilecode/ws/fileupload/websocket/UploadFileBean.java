package cn.agilecode.ws.fileupload.websocket;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class UploadFileBean {
	private String filename;
	
	// The size of the uploaded file
	private long size;
	
	private FileOutputStream outputStream;

	private File file;
	
	public UploadFileBean(String path, String filename,long size) throws FileNotFoundException {
		this.filename=filename;
		this.size=size;
		this.file = new File(path,filename);
		this.outputStream = new FileOutputStream(file, true);
	}
	
	public void addData(byte[] buffer) throws IOException {
		this.outputStream.write(buffer);
	}
	
	//只能最后调用，调用前会关闭流
	public File getFile() throws IOException {
		this.outputStream.close();
		return this.file;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}
	
}
