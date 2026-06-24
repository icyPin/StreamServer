package com.example.StreamingService.Controller;


import com.example.StreamingService.Model.Show;
import com.example.StreamingService.Service.FolderReadingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/library")
public class LibraryController {

    private final FolderReadingService readingService;

    public LibraryController(FolderReadingService readingService){
        this.readingService=readingService;
    }

    @GetMapping("/scan")
    public ResponseEntity<List<Show>> scanLibrary(@RequestParam(value = "rootPath" , required = true)String rootPath) throws Exception{
        try{
            List<Show> shows;
            shows = readingService.ScanLibrary(rootPath);
            return ResponseEntity.ok(shows);
        } catch (IOException e) {
            System.out.println("error finding folder pls check the name again pls!!");
            return ResponseEntity.internalServerError().build();
        }
    }
}
