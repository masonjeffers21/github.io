# Robot Arm System Architecture

```mermaid
graph TB
    subgraph Hardware["🔧 Hardware Layer"]
        Robot["Mitsubishi RV-6SDL-S15<br/>6-Axis Industrial Robot<br/>6kg payload, 900mm reach"]
        Controller["CR2DA-700 Controller<br/>AC Servo Drives<br/>Real-time Motion Control"]

        Robot <--> |"Encoder Feedback<br/>Motor Commands"| Controller
    end

    subgraph Communication["🔌 Communication Layer"]
        Ethernet["Ethernet Interface<br/>192.168.0.20<br/>Modbus/TCP Port 502"]
        Serial["RS-232 Serial<br/>115200 baud, 8N1"]

        Controller <--> Ethernet
        Controller <--> Serial
    end

    subgraph Software["💻 Software Integration Layer"]
        RTToolbox["RT Toolbox2<br/>- MELFA BASIC Scripts<br/>- Online Monitor<br/>- Program Upload"]
        Python["Python Control Interface<br/>- Socket Client (TCP/IP)<br/>- Serial Communication<br/>- Error Handling & CRC"]
        ROS["ROS Integration (Planned)<br/>- URDF Model<br/>- MoveIt! Motion Planning<br/>- RViz Visualization"]

        Ethernet <--> RTToolbox
        Ethernet <--> Python
        Serial <--> Python
        Python --> |"Future Integration"| ROS
    end

    subgraph UserInterface["👤 User Interface Layer"]
        Dashboard["Web Dashboard<br/>- Real-time Telemetry<br/>- Position Monitoring<br/>- Error Alerts"]
        Joystick["Joystick Control<br/>- Manual Operation<br/>- Teaching Mode"]
        API["RESTful API<br/>- Motion Commands<br/>- Status Queries<br/>- Configuration"]

        Python --> Dashboard
        Python --> Joystick
        Python --> API
    end

    subgraph DCS_Connection["🏭 Industrial Controls Background"]
        PCS7["Siemens PCS7 DCS Background<br/>- Industrial Protocols (Profibus/Profinet)<br/>- SCADA Architecture<br/>- Safety Systems (SIL-rated)<br/>- Real-time Control Loops"]

        PCS7 -.->|"Concepts Applied"| Communication
        PCS7 -.->|"Safety & Reliability"| Software
    end

    style Hardware fill:#e1f5ff
    style Communication fill:#fff4e1
    style Software fill:#e8f5e9
    style UserInterface fill:#f3e5f5
    style DCS_Connection fill:#fff3e0
    style Robot fill:#4fc3f7
    style Controller fill:#4fc3f7
    style PCS7 fill:#ffb74d
```

## Architecture Overview

### Hardware Layer
- **Robot**: Mitsubishi RV-6SDL-S15 6-axis industrial robot with harmonic drives and AC servo motors
- **Controller**: CR2DA-700 industrial controller managing real-time motion control and safety systems

### Communication Layer
- **Ethernet (Modbus/TCP)**: Primary interface for high-level commands and telemetry (192.168.0.20:502)
- **RS-232 Serial**: Alternative/diagnostic interface for low-level communication (115200 baud)

### Software Integration Layer
- **RT Toolbox2**: Official Mitsubishi software for MELFA BASIC programming and diagnostics
- **Python Control Interface**: Custom-built communication layer with robust error handling
- **ROS Integration (Planned)**: Motion planning and visualization using ROS ecosystem

### User Interface Layer
- **Web Dashboard**: Real-time monitoring and control interface
- **Joystick Control**: Manual operation and teaching capabilities
- **RESTful API**: Programmatic access for automation workflows

### Industrial Controls Background
**DCS Engineering Experience Applied:**
- Deterministic communication protocols from Siemens PCS7 work
- Safety system design principles (SIL-rated controls)
- SCADA architecture patterns for telemetry and monitoring
- Real-time control loop concepts from process automation

---

**Technical Notes:**
- All communication includes CRC checksums and timeout/retry mechanisms
- State machine manages connection lifecycle and error recovery
- Modular design allows swapping communication methods without affecting high-level control
- Future ROS integration will add advanced motion planning and collision detection
