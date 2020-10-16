package domain;

public class CodeFile extends CodeElement{
	
	private String filename;

	private String content;
	
	public CodeFile(String id, String path, String type, SPL spl, CodeElement parent, String fileName) {
		super(id, path, type, spl, parent);
		this.filename = fileName;
		this.content = "";
	}
	public CodeFile(String id, String path, String type, SPL spl, CodeElement parent, String fileName, String content) {
		super(id, path, type, spl, parent);
		this.filename = fileName;
		this.content = content;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
