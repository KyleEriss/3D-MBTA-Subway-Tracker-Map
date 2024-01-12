# 3D-MBTA-Subway-Tracker-Map
[Link text](https://3dmbtamap.com/)
This Node.js app uses Google Maps WebGL Overlay View to render 3D markers representing MBTA subway/commuter cars, and is updated real-time, using server-sent events. This server is provisioned on EC2 and uses a Load Balancer and Auto Scaling to horizontally scale the number of instances as traffic spikes higher or lower.

Also leverages connection pooling to share database resources across several user requests, thereby conserving application resources for future requests.

![alt text](https://github.com/KyleEriss/3D-MBTA-Subway-Tracker-Map/blob/main/3dmbta%20screenshot.png?raw=true)
