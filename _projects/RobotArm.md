---
layout: page
title: Robot Arm
description: Restoration and software integration of a 6-axis robot arm.
img: assets/img/robot_arm/robot_arm.JPG
importance: 1
category: 
related_publications: false
---

**Introduction**

I purchased a 6-axis robot arm through an online auction, acquiring it in an unknown condition. From the start, it was clear that the arm, while promising, needed a significant amount of restoration. Intrigued by its potential and driven by a passion for robotics, I set out to revive this machine, despite the uncertainty of its initial state.

**Setting Up**

The first step was to create a dedicated workspace and gather all necessary tools. I cleared a large workbench, ensuring adequate lighting and power access, and assembled essential equipment including a digital multimeter, oscilloscope, various sizes of hex keys, torque wrenches, and specialized lubricants. I carefully unboxed the arm, photographing each step of the process and creating detailed documentation of its initial state. The robot showed signs of extended storage - there was light surface corrosion on some exposed metal parts, and the cables had become stiff from age.

I methodically inspected and documented every visible component. The arm's six joints were manually articulated to assess their range of motion and identify any concerning sounds or resistance. I tested each servo motor's electrical connections, checking for continuity and proper insulation. The controller box was opened and examined for any obvious damage or loose connections. Throughout this process, I maintained a detailed log of observations, creating a comprehensive checklist of items that needed attention. My goal was to systematically inspect every component—from mechanical parts to electrical connections—and determine the root cause of its malfunction before attempting any repairs.

**Troubleshooting and Disassembly**

Early diagnostics pointed to issues with the J2 axis, specifically irregular motion and concerning vibrations during operation. I began by disassembling this section of the robot, which led me to focus on the harmonic drive and the AC servo motor. The harmonic drive showed signs of wear and contamination - the wave generator exhibited minor scoring marks, while the flex spline contained accumulated debris that impeded smooth operation. I carefully took apart the J2 axis, cleaning the harmonic drive thoroughly using specialized solvents to remove debris and hardened grease, followed by applying fresh SHF-32 lubricant to ensure proper operation. The circular spline teeth required particular attention, as they showed signs of uneven wear that needed careful cleaning and inspection.

Similarly, I disassembled and cleaned the AC servo motor, discovering that the bearings had accumulated significant debris and the encoder disk showed signs of contamination. I methodically addressed each component - cleaning the stator windings, replacing the bearings, and carefully realigning the encoder disk to ensure accurate position feedback. The process of reassembly required precise torque specifications for the mounting bolts and careful alignment of the motor shaft with the harmonic drive input.

This restoration process involved a fair amount of trial and error, particularly in achieving the correct preload on the harmonic drive and proper encoder alignment. I developed a systematic testing procedure, gradually increasing the range of motion while monitoring current draw and vibration levels. Through iterative adjustments and careful calibration of each component, I was able to restore the axis to smooth, reliable operation with minimal backlash and proper position accuracy.

**Communication with the Controller**

After resolving the mechanical issues, I turned my attention to the robot's control systems. The controller uses a proprietary communication protocol, requiring careful reverse engineering to establish reliable connectivity. I began by analyzing the electrical signals using an oscilloscope to understand the timing and voltage levels of the communication interface.

My current efforts are focused on establishing reliable communication with the controller through multiple approaches. For TCP/IP communication, I implemented a custom socket server that listens on port 502, matching the controller's expected configuration. I developed a Python client that can send movement commands and receive position feedback using a structured message format. For serial communication, I experimented with different baud rates and data formats through the RS-232 interface, eventually achieving stable communication at 115200 baud with 8N1 configuration.

While the integration poses significant challenges—such as configuring network settings, handling packet loss, and ensuring consistent data transmission—I've made substantial progress. I implemented error detection using CRC checksums, added timeout mechanisms for failed commands, and created a robust state machine to manage the connection lifecycle. The project continues to evolve as I work toward full remote control and software integration, with the ultimate goal of implementing a high-level API that abstracts the complexity of the underlying communication protocols.

**Conclusion**

Restoring this robot arm has been a challenging yet deeply rewarding experience. Each step, from the initial setup through the detailed troubleshooting of the J2 axis, has enriched my understanding of robotics and control systems. The mechanical restoration process taught me valuable lessons about precision engineering, particularly in handling delicate components like the harmonic drive and servo motors. The careful calibration of the J2 axis required developing a systematic approach to mechanical alignment and testing, which has significantly improved my technical troubleshooting skills.

The software integration phase has presented its own unique challenges. Working with TCP/IP communication protocols has deepened my understanding of network programming and real-time control systems. I've implemented custom protocols for command transmission and feedback processing, while also developing safety protocols to ensure reliable operation. The ongoing work on the controller interface has involved creating robust error handling systems and implementing position feedback loops for precise movement control.

Looking forward, I plan to expand the project in several directions. First, I'm developing a custom control interface that will allow for both manual and automated operation modes. Second, I'm working on implementing advanced features like path planning and collision detection. Finally, I'm exploring the integration of computer vision systems to enable more sophisticated interaction with the environment. These enhancements will transform the robot from a basic motion platform into a fully capable automation system.

I remain dedicated to refining the communication interface with the controller over TCP/IP, confident that these efforts will eventually lead to a fully operational and integrated robotic system. The knowledge gained from this project has not only advanced my technical skills but has also provided valuable insights into industrial robotics and automation systems.
