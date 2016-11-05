/*
Team unqiue name
 */ 
package busstopcoord;

/*
 * @author DanC
 */
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class BusStopCoord {
  
//  Using BufferedReader and FileReader
// 
    public static void main(String[] args) throws FileNotFoundException, IOException
    {
        String fileName = "stops.txt";
        String line = null;
        
        try{
            FileReader fileReader = new FileReader(fileName);
            
            try (BufferedReader bufferedReader = new BufferedReader(fileReader)) {
                while ((line = bufferedReader.readLine()) != null)
                {  
                    // using data from https://www.cttransit.com/about/developers zip files. NOTE delete the the first line from stops.txt for it to work 
                    // [0] = stop_id,[1] = stop_code,[2] = stop_name,[3] = stop_lat,[4] = stop_lon,
                    // [5] = zone_id, [6] = stop_url,[7] = location_type,[8] parent_station
                            String[] tokenize = line.split(",");  
                            
                                          
                            float lat = Float.parseFloat(tokenize[3]);
                            float lot = Float.parseFloat(tokenize[4]);
                            System.out.println(lat + " " + lot );                
                }
            }
        }
        
        catch(FileNotFoundException ex){
            System.out.println( "Cannot open " + fileName + "");
        }
        catch(IOException ex){
            System.out.println("Erorring reading" + fileName + "");
            
           } 
    }
}