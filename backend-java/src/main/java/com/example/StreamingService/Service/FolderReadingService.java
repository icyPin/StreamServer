package com.example.StreamingService.Service;


import com.example.StreamingService.Model.Episode;
import com.example.StreamingService.Model.Show;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class FolderReadingService {


    public List<Show> ScanLibrary(String rootPath) throws IOException{

        List<Show> shows = new ArrayList<>();
        Path root = Paths.get(rootPath);

        if(Files.notExists(root)){
            System.out.println("Create a package named MediaLibrary and store all shows inside it in organised manner pls !!!");
            return shows;
        }
        try(Stream<Path> showFolder = Files.list(root)){
            List<Path> directories = showFolder
                    .filter(Files::isDirectory)
                    .toList();

            for(Path show : directories){
                String showName = show.getFileName().toString();
                List<Episode> episodes = getEpisodesOf(show , showName , rootPath);
                shows.add(new Show(showName , episodes , null));

            }
        }catch (IOException e){
            e.printStackTrace();
        }

        return shows;
   }

   private List<Episode> getEpisodesOf(Path showFolder , String showName , String rootPath){

        List<Episode> episodes = new ArrayList<>();
        try(Stream<Path> files = Files.list(showFolder)){
            List<Path> mp4Files = files
                    .filter(Files::isRegularFile)
                    .filter(p -> p.toString().endsWith(".mp4"))
                    .toList();

            for(Path file : mp4Files){
                String title = file.getFileName().toString();
                String videoUrl = "http://localhost:8086/api/v1/video/stream?filePath="+ file.toAbsolutePath().toString();
                episodes.add(new Episode(title , videoUrl));
            }
        } catch (IOException e) {
            System.out.println("failed to read episodes of "+ showName);
        }

        return episodes;
   }
}
