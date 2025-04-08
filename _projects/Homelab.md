---
layout: page
title: Homelab Infrastructure
description: Building and maintaining a homelab environment using Proxmox VE with various services including Home Assistant, media servers, and development environments.
img: assets/img/homelab/homelab_project_page.png
importance: 1
category: Infrastructure
related_publications: false
---

**Introduction**

My homelab journey began with a simple goal: create a reliable, efficient, and cost-effective home infrastructure. Starting with a single old desktop computer, I've gradually built up a comprehensive setup that powers my smart home, media consumption, and development workflows. This project has been a perfect blend of learning and practical application.

**Hardware Evolution**

The homelab has evolved through several iterations:

1. **Initial Setup (2019)**
   - Repurposed Dell OptiPlex 7010
   - Intel i5-3470, 16GB RAM
   - 2x 1TB HDDs in RAID 1
   - Basic consumer router

2. **First Upgrade (2020)**
   - Custom-built server using consumer parts
   - AMD Ryzen 5 3600
   - 32GB DDR4 RAM
   - 500GB NVMe SSD for OS
   - 4x 4TB WD Red HDDs
   - TP-Link Omada network equipment

3. **Current Setup (2025)**
   - **Main Server**: Custom-built
     - AMD Ryzen 7 5800X
     - 64GB DDR4 RAM
     - 1TB Samsung 970 EVO Plus NVMe
     - 4x 8TB Seagate IronWolf HDDs
     - 2.5GbE network card
   - **Network Equipment**:
     - TP-Link Omada ER605 router
     - TP-Link TL-SG2428P switch
     - TP-Link EAP670 access point
   - **UPS**: CyberPower CP1500PFCLCD

**Implementation Journey**

The setup process was methodical and focused on stability:

1. **Proxmox Installation**
   - Started with Proxmox VE 6.0
   - Learned about ZFS and implemented it for storage
   - Configured automated snapshots
   - Set up backup schedules

2. **Network Configuration**
   - Created VLANs for different services
   - Implemented firewall rules
   - Set up VPN access
   - Configured QoS for critical services

3. **Service Deployment**
   - Started with Home Assistant in an LXC container
   - Gradually added other services
   - Implemented monitoring and alerts
   - Created automated maintenance scripts

**Key Services Implementation**

1. **Home Assistant Setup**
   - Installed as an LXC container for better performance
   - Configured Zigbee2MQTT for device communication
   - Created custom dashboards using Lovelace
   - Implemented automations for:
     - Lighting control based on presence
     - Temperature regulation
     - Energy monitoring
     - Security alerts

2. **Media Server Implementation**
   - Started with simple Plex setup
   - Added Sonarr/Radarr for media management
   - Implemented automated download handling
   - Created custom scripts for media organization
   - Set up remote access with secure authentication

3. **Development Environment**
   - Created isolated development VMs
   - Implemented GitLab for version control
   - Set up CI/CD pipelines
   - Configured Docker environment
   - Created backup strategies for code

**Challenges and Solutions**

1. **Hardware Limitations**
   - **Problem**: Limited resources on initial hardware
   - **Solution**: Optimized resource allocation
     - Used LXC containers where possible
     - Implemented resource limits
     - Scheduled resource-intensive tasks

2. **Network Stability**
   - **Problem**: Consumer-grade network equipment limitations
   - **Solution**: 
     - Implemented VLANs for traffic separation
     - Added QoS rules
     - Created network monitoring
     - Set up automated failover

3. **Power Management**
   - **Problem**: High power consumption
   - **Solution**:
     - Implemented power scheduling
     - Used hardware power management features
     - Created scripts to manage service uptime
     - Added UPS monitoring

**Automation and Monitoring**

Developed several custom solutions:

1. **Backup System**
   - Automated Proxmox backups
   - Offsite backup to Backblaze B2
   - Custom scripts for data verification
   - Automated cleanup of old backups

2. **Monitoring Setup**
   - Prometheus for metrics collection
   - Grafana for visualization
   - Custom dashboards for different services
   - Alert system for critical issues

3. **Maintenance Automation**
   - Automated updates
   - Resource monitoring
   - Log rotation
   - System health checks

**Security Implementation**

Implemented multiple layers of security:

1. **Network Security**
   - VLAN segmentation
   - Firewall rules
   - VPN access
   - Intrusion detection

2. **Service Security**
   - SSL certificates
   - Two-factor authentication
   - Regular updates
   - Access controls

**Future Plans**

1. **Hardware Upgrades**
   - Add more storage capacity
   - Implement 10GbE networking
   - Add GPU for transcoding
   - Improve power efficiency

2. **Service Enhancements**
   - Expand Home Assistant capabilities
   - Add more development tools
   - Implement Kubernetes
   - Enhance monitoring

**Conclusion**

Building this homelab has been an incredible learning experience. Starting with basic consumer hardware and gradually expanding has taught me valuable lessons about system design, resource management, and problem-solving. The setup continues to evolve, with each upgrade and new service adding to both its capabilities and my knowledge. 