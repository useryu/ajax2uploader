package cn.agilecode.ws.fileupload.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

/**
 * 
 *
 * 
 * @author Fisher.Yu
 */

public class FileUploadSocketHandler extends AbstractWebSocketHandler {

	private static final Logger logger = Logger.getLogger(FileUploadSocketHandler.class);

	@Value("${file.savePath}")
	private String uploadFilePath;
	private Map<WebSocketSession,UploadFileBean> uploadFileBeans=new HashMap<WebSocketSession,UploadFileBean>();
	private ObjectMapper objectMapper=new ObjectMapper();

	@Override
	public void afterConnectionEstablished(WebSocketSession session)
			throws Exception {
		String id = session.getId();
		logger.debug("WebSocket连接已经建立，连接sessionID为:" + id);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session,
			TextMessage message) throws Exception {
		String msg = message.getPayload();		
		String command = msg.substring(0,msg.indexOf(":"));		
		if("INIT".equals(command)) {
			UploadIn uploadIn = objectMapper.readValue(msg, UploadIn.class);
			UploadFileBean uploadFileBean = new UploadFileBean(this.uploadFilePath,uploadIn.getFilename(),uploadIn.getSize());
			this.uploadFileBeans.put(session, uploadFileBean);
			UploadOut initOut=new UploadOut();
			String rs = objectMapper.writeValueAsString(initOut);
			session.sendMessage(new TextMessage(rs));
		}else if("DOWN".equals(command)) {
			UploadFileBean uploadFileBean = this.uploadFileBeans.get(session);
			if(uploadFileBean==null) {
				// not a valid session
			}else{
				File file = uploadFileBean.getFile();
				//TODO process file
				UploadOut out = new UploadOut();
				out.setCode(200);
				out.setType("CLOSE");
				String rs = objectMapper.writeValueAsString(out);
				session.sendMessage(new TextMessage(rs));
				logger.debug("文件：【" + file.getName() + "】上传成功");
			}
		}else if("AUTH".equals(command)) {
			//TODO
		}
	}

	@Override
	protected void handleBinaryMessage(WebSocketSession session,
			BinaryMessage message) throws Exception {
		ByteBuffer msg = message.getPayload();
		byte[] buffer = msg.array();
		UploadFileBean uploadFileBean = this.uploadFileBeans.get(session);
		if(uploadFileBean==null) {
			// not a valid session
		}else{
			uploadFileBean.addData(buffer);
			UploadReceivedDataOut out = new UploadReceivedDataOut();
			out.setBytesRead(buffer.length);
			out.setCode(200);
			out.setType("DATA");
			String rs = objectMapper.writeValueAsString(out);
			session.sendMessage(new TextMessage(rs));
		}
	}

	@Override
	public void handleTransportError(WebSocketSession session,
			Throwable exception) throws Exception {
		if (session.isOpen()) {
			UploadReceivedDataOut out = new UploadReceivedDataOut();
			out.setBytesRead(0);
			out.setCode(505);
			out.setType("DATA");
			out.setMessage(exception.getMessage());
			String rs = objectMapper.writeValueAsString(out);
			logger.debug("WebSocket 程序发生异常 ：【" + exception + "】");
			session.sendMessage(new TextMessage(rs));
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session,
			CloseStatus status) throws Exception {
		UploadFileBean bean = this.uploadFileBeans.remove(session);
		if(bean!=null) {
			bean = null;
		}
		logger.debug("WebSocket 连接关闭 "+session);
	}

}