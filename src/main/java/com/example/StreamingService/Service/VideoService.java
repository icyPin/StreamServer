package com.example.StreamingService.Service;


import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class VideoService {

    public static final String video_path = "/home/icy/Downloads/ep1.mp4";
    private final Path storageLocation = Paths.get("videos");

    public ResourceRegion getPartialVideoRegion(HttpHeaders headers) throws IOException {
        Resource video = new FileSystemResource(video_path);
        long contentLength = video.contentLength();

        HttpRange range = headers.getRange().isEmpty()? null :headers.getRange().getFirst();

        if(range!=null){
            long start = range.getRangeStart(contentLength);
            long end = range.getRangeEnd(contentLength);
            long rangeLength = Math.min(1024*1024 , end-start +1);

            return new ResourceRegion(video , start , rangeLength);
        }
        else{
            long rangeLength = Math.min(1024*1024 , contentLength);
            return new ResourceRegion(video , 0 , rangeLength);
        }
    }

    public void processAndTranscodeVideo(MultipartFile file){

        try{
            if(Files.notExists(storageLocation)){
                Files.createDirectories(storageLocation);
            }

            Path inputFile = storageLocation.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), inputFile , StandardCopyOption.REPLACE_EXISTING);
            String folderName = file.getOriginalFilename().replace(".mp4","");
            Path hlsoutputDir = storageLocation.resolve(folderName);
            Files.createDirectories(hlsoutputDir);

            String ffmpeg = String.format("ffmpeg -i %s -codec:v libx264 -codec:a aac -hls_time 10" +
                            " -hls_playlist_type vod -hls_segment_filename %s/chunk_%%03d.ts %s/playlist.m3u8",
                    inputFile.toAbsolutePath(),
                    hlsoutputDir.toAbsolutePath(),
                    hlsoutputDir.toAbsolutePath()
            );
            System.out.println("Starting ffmpeg conversion");

            ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", ffmpeg);
            processBuilder.inheritIO();
            Process process = processBuilder.start();
            process.waitFor();

            System.out.println("ffmpeg processing completed");
    }catch (Exception e) {
            e.printStackTrace();
        }
    }
}

