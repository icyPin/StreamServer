package com.example.StreamingService.Controller;

import com.example.StreamingService.Model.Show;
import com.example.StreamingService.Service.FolderReadingService;
import com.example.StreamingService.Service.VideoService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/v1/video")
public class VideoStreamingController {

    private final VideoService videoService;

    public VideoStreamingController(VideoService videoService){
        this.videoService=videoService;
    }

    @GetMapping(value = "/stream" , produces = "video/mp4")
    public ResponseEntity<ResourceRegion> Stream(@RequestHeader HttpHeaders headers ,
                                                 @RequestParam("filePath") String filePath){

        try{
            ResourceRegion region = videoService.getPartialVideoRegion(headers , filePath);
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.parseMediaType("video/mp4"))
                    .body(region);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/hls")
    public ResponseEntity<Void> hlsStreaming(@RequestParam("filePath")  String filePath){

        try{
            String folderName = videoService.processAndTranscodeVideo(filePath);
            String playlistUrl = "/transcoding/" + folderName + "/playlist.m3u8";
            return ResponseEntity.status(HttpStatus.FOUND).
                    header(HttpHeaders.LOCATION , playlistUrl)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}