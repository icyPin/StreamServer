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


    private final Path storageLocation = Paths.get("/media/.transcodes");

    public ResourceRegion getPartialVideoRegion(HttpHeaders headers , String filePath) throws IOException {
        Resource video = new FileSystemResource(filePath);
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

    public String processAndTranscodeVideo(String filePath) throws Exception{

        Path sourcePath = Paths.get(filePath);

        String folderName = sourcePath.getFileName().toString().replace("mp4" , "");
        Path hlsOutputDir = storageLocation.resolve(folderName);
        Path playlistPath = hlsOutputDir.resolve("playlist.m3u8");

        if(Files.exists(playlistPath))
            return folderName;


        Files.createDirectories(hlsOutputDir);
        String ffmpeg = String.format("ffmpeg -i \"%s\" -codec copy -start_number 0 -hls_time 10 -hls_list_size 0 -hls_playlist_type vod -f hls \"%s\"",
                sourcePath.toAbsolutePath(),
                playlistPath.toAbsolutePath()
        );

        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", ffmpeg);
        processBuilder.inheritIO();
        Process process = processBuilder.start();
        System.out.println("ffmpeg processing started");

        int attempt=0;

        while(!Files.exists(playlistPath) && attempt<50){
            Thread.sleep(200);
            attempt++;
        }

        if(Files.notExists(playlistPath))
            throw new RuntimeException("ffmpeg failed to start in time");

        return folderName;
    }
}

