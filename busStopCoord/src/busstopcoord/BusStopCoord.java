package busstopcoord;
/*
 * @author DanC Team unique name
 */
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class BusStopCoord {
  
    public static void main(String[] args) throws FileNotFoundException, IOException
    {
        String fileName = "haNbWastops.txt";
        String line = null;
        float[][] Coord = new float[5959][2];
        int index = 0;
        
        try{
            FileReader fileReader = new FileReader(fileName);
            
            try (BufferedReader bufferedReader = new BufferedReader(fileReader)) {
                while ((line = bufferedReader.readLine()) != null)
                {  
                    // using data from https://www.cttransit.com/about/developers zip files. NOTE delete the the first line from stops.txt and combine 
                    // Hartford, Newbritain, and Waterbury stops.txts into one file for it to work 
                    // [0] = stop_id,[1] = stop_code,[2] = stop_name,[3] = stop_lat,[4] = stop_lon,
                    // [5] = zone_id, [6] = stop_url,[7] = location_type,[8] parent_station
                            String[] tokenize = line.split(",");                 
                            float lat = Float.parseFloat(tokenize[3]);
                            float lon = Float.parseFloat(tokenize[4]);
                       
                      //    System.out.println(lat + " " + lon );       // test for getting lat and lon      
                            Coord[index][0] =  lat;
                            Coord[index][1] = lon;
                            index++;
                            
                }         
//                for( index = 0; index < Coord.length; index++) // printing the array out to test if lat and lon is corretly stored
//                {
//                    System.out.println(Coord[index][0] + "" + Coord[index][1]);
//                }
                  
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