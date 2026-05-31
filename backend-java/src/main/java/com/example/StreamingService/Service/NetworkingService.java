package com.example.StreamingService.Service;


import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceInfo;
import java.net.InetAddress;

@Service
public class NetworkingService {

    private JmDNS jmDNS;

    @PostConstruct
    public void registerService(){
        try{
            jmDNS = JmDNS.create(InetAddress.getByName("192.168.31.56"));
            ServiceInfo serviceInfo = ServiceInfo.create(
                    "_http._tcp.local.",
                    "netflix-gesture",
                    8086,
                    "Local Anime Streaming Server"
            );

            jmDNS.registerService(serviceInfo);

            System.out.println("🌐 Broadcasting on WiFi as: http://netflix-gesture.local:8086");

        } catch (Exception e) {
            System.out.println("Error networking JmDNS"+e);
        }
    }

    @PreDestroy
    public void unregisterService(){
        if(jmDNS!=null)
            jmDNS.unregisterAllServices();
    }
}
