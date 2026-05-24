package com.example.StreamingService.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Show {

    private String showName;
    private List<Episode> episodes;
    private String thumbnailUrl;

}
