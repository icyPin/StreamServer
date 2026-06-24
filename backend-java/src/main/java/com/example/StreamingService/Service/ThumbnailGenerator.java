package com.example.StreamingService.Service;


import com.example.StreamingService.Model.Episode;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ThumbnailGenerator {

    private final Path thumbnailFolder =Paths.get("/media/.transcodes/thumbnails");

    public String getThumbnail(List<Episode> episodes , String showName) throws Exception{

        if(episodes==null || episodes.isEmpty()){
            return null;
        }
        String firstEp = episodes.getFirst().getFilePath().toString();
        Path path = Paths.get(firstEp);

        Files.createDirectories(thumbnailFolder);
        Path thumbFile = thumbnailFolder.resolve(showName+".jpg");
        String encodedName = URLEncoder.encode(showName, "UTF-8").replace("+", "%20");
        String publicUrl = "/transcoding/thumbnails/" + encodedName + ".jpg";

        if(Files.exists(thumbFile))
            return publicUrl;

        String ffmpegCmd = String.format(
                "ffmpeg -y -ss 00:03:00 -i \"%s\" -vframes 1 -q:v 2 \"%s\"",
                path.toAbsolutePath(),
                thumbFile.toAbsolutePath()
        );

        ProcessBuilder p = new ProcessBuilder("bash" , "-c" , ffmpegCmd);
        Process process = p.start();
        process.waitFor();

        if(Files.exists(thumbFile)){
            System.out.println("thumbnail generated for show from ep tittle: "+ episodes.getFirst().getTitle() );
            return publicUrl;
        }
        else{
            System.out.println("some error");
            return null;
        }

    }
}