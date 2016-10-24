package edu.ccsu.cs410.uniqueteam.ctfasttrakproject

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

public class JSONReader {
	private static JSONReader instance = null;

	private JSONReader() {}

	public static JSONReader getInstance()
	{
		if(instance == null)
			instance = new.JSONReader();

		return instance;
	}

	//public JSONObject[](?) getJSONFile(URL url) 
	//{
	//	add code that will take the JSON file from URL and return a 
	// 	JSONObject array for each bus which data from the file can be put into Bus Object
	//	and BusStop object
	//} <--Need to do-->
}