public class JSONReader {
	private static JSONReader instance = null;

	private JSONReader() {}

	public static JSONReader getInstance()
	{
		if(instance == null)
			instance = new.JSONReader();

		return instance;
	}

	//public JSONArray(?) getJSONFile(URL url) 
	//{
	//	add code that will take the JSON file from URL and return a 
	// 	JSONArray(?) which data from the file can be put into Bus Object
	//	and BusStop object
	//} --Need to do--
}