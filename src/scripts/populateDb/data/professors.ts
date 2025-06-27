import { type professors } from "~/server/db/schema";

const professorData: (typeof professors.$inferInsert)[] = [
  {
    id: 1,
    name: "Prof. Subhendu Kumar Sahoo (HOD)",
    designation: "Professor",
    qualification: "Ph.D. (BITS-Pilani, Pilani Campus)",
    joinedBits: "June 1999",
    interests: "VLSI architecture for Digital Signal Processing",
    coursesTaught:
      "Digital Signal Processing, Signals and Systems, Communication network, Data communication and Networks, Telecommunication and switching system, Communication Systems, Digital Electronics, FPGA System Design",
  },
  {
    id: 2,
    name: "Dr. Subhradeep Pal (FIC)",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT-Patna)",
    joinedBits: "September 2020",
    experience: "7 years in Academics",
    interests:
      "Silicon Photonics, Optical Fiber Communications, Photonic Integrated Circuits, Photo Detectors, Memristors",
    coursesTaught:
      "Optical Communication, Digital Communication, Optoelectronics, Microprocessor and Interfaces, Communication Systems",
  },
  {
    id: 27,
    name: "Prof. S Gurunarayanan",
    designation: "Senior Professor",
    qualification: "Ph.D. (BITS-Pilani)",
    joinedBits: "1987",
    experience: "35 years in Academics",
    interests: "Digital VLSI Design, Processor Architecture",
    coursesTaught:
      "Electronics, VLSI Design, Digital Design, Microprocessors Programming & Interfacing, VLSI Architecture, Analog Electronics, Embedded System Design, Computer Architecture",
  },
  {
    id: 3,
    name: "Prof. Sanket Goel",
    designation: "Professor, Dean-SRCD, PIC-CIIE",
    qualification:
      "BS (H - Delhi University), MS (IIT Delhi), PhD (University of Alberta, Canada), Postdoctoral (Stanford University)",
    joinedBits: "2015",
    experience:
      "17 Years (2 years postdoc, 3 years public-funded R&D, 12 years academia)",
    interests:
      "MEMS, Microfluidics, Nanoelectronics, Flexible, Printed and Wearable Electronics, Cyber-Physical Systems, Lab-on-a-chip, Point-of-Care devices, 3D printing, Fuel Cells, Smart sensors",
    researchLab: "MEMS, Microfluidics and Nanoelectronics (MMNE) Lab",
    coursesTaught:
      "Analog Electronics, Digital Design, Electrical Science, Electronic Devices, Electronic Instrumentation, IC Fabrication, MEMS, Microfluidics, Transducers & Measurement Systems",
  },
  {
    id: 4,
    name: "Prof. BVVSN Prabhakar Rao",
    designation: "Professor",
    qualification: "Ph.D. (IIT Delhi)",
    joinedBits: "July 2009",
    experience: "12 years Academics",
    interests: "Biomedical Signal/Image Processing",
    coursesTaught:
      "Electrical Sciences, Signals & Systems, Electronic Devices, Digital Signal Processing, Fibre optics, Optoelectronics & Analog Electronics",
  },
  {
    id: 5,
    name: "Prof. Alivelu Manga Parimi",
    designation: "Professor",
    qualification: "PhD (University Technology Petronas, Malaysia)",
    joinedBits: "May 2012",
    experience: "21 years in Academics",
    interests:
      "Renewable Energy Sources, Microgrids, FACTS devices, Power system stability, Power Quality, Reactive power compensation, Modal Analysis, Control Systems, Batteries, Implementation of ML Techniques",
    coursesTaught:
      "Electrical Machines, Modern Control Systems, Power Systems, Control Systems, Electrical Sciences, Power Systems Engineering(WILP), Electromechanical Energy Conversion, Power System Operation and Control, Transducers and Measurement Systems, Power Electronics",
  },
  {
    id: 6,
    name: "Prof. Prasant Kumar Pattnaik",
    designation: "Associate Professor",
    qualification: "Ph.D (Indian Institute of Science, Bangalore)",
    joinedBits: "June 2012",
    experience: "14 years Academics, 1 year Industry",
    interests:
      "Photonics, Optical Communications, Photonic Integrated Circuits, Microfluidics and MEMS - DST-SERB (51.42 Lakhs), Microwave Engineering – BRNS (25.5 Lakhs)",
    coursesTaught:
      "Optical Communications, Fiber Optics and Optoelectronics, Communication Systems, Analog Electronics, Introduction to MEMS, Electrical Sciences, Electromagnetic Fields and Microwave Engineering, Electromagnetic Fields and Waves, Integrated Optics, Digital Electronics (Lab), Analog Electronics (Lab), Microwave Engineering (Lab), Communication Systems (Lab), Electrical and Electronics Circuits (Lab)",
  },
  {
    id: 7,
    name: "Prof. Runa Kumari",
    designation: "Associate Professor",
    qualification: "Ph.D (NIT-Rourkela)",
    joinedBits: "Mar 2014",
    experience: "4 years",
    interests:
      "Dielectric Resonator Antenna, Log periodic Antenna, Reconfigurable Antenna, Microstrip antenna, EBG, Metamaterial, Antenna Array",
    coursesTaught:
      "Electrical Sciences, Communication Systems, Microprocessor Programming and Interfacing, Electromagnetic Fields and Microwave Engineering, Mobile & Personal Communication, RF & Microwave Engg., Coding Theory & Practice, Advanced Digital Communication, Satellite Communication, Communication Networks, Information Theory & Coding",
  },
  {
    id: 8,
    name: "Dr. Venkateswaran Rajagopalan",
    designation: "Associate Professor",
    qualification: "D.Eng (Cleveland State University, Cleveland, OH, USA)",
    joinedBits: "May 2014",
    interests:
      "Human brain mapping using Magnetic Resonance Imaging (MRI), Transcranial Magnetic Stimulation (TMS), Electroencephalography (EEG), Positron Emission Tomography (PET), Neurological disorders Amyotrophic Lateral Sclerosis (ALS), Multiple Sclerosis (MS), Brain Tumor, Machine Learning, Graph Theory (brain network analysis)",
    coursesTaught:
      "Signals and Systems, Digital Image Processing, Digital Signal processing, Advanced Digital Signal Processing, Medical Instrumentation, Introduction to Artificial Neural Networks",
  },
  {
    id: 9,
    name: "Prof. Surya Shankar Dan",
    designation: "Associate Professor",
    qualification: "Ph.D. (IISc Bangalore)",
    joinedBits: "2016",
    interests:
      "(1) Development of ML-based data-driven modeling of nanoelectronic devices for their circuit applications; (2) Development of physics-based compact analytical models for nanoelectronic devices and their circuit applications; (3) Design of ultra-low-power and high-performance analog, digital and ternary circuits at the state-of-the-art technology nodes; (4) Development of device and circuit simulators for SPICE applications",
    researchLab: "Nanoelectronic Devices and Circuits Laboratory (NDCL)",
    coursesTaught:
      "Advanced VLSI Design (HD), Physics & Modeling of Microelectronic Devices (HD), Microelectronic Circuits (FD), Analog & Digital VLSI Design (FD), Electronic Devices (FD)",
  },
  {
    id: 10,
    name: "Prof. Sumit Kumar Chatterjee",
    designation: "Associate Professor",
    qualification: "Ph.D (IIT Kharagpur)",
    joinedBits: "May 2015",
    experience: "16 years",
    interests: "Digital VLSI Design, Video Compression",
    coursesTaught:
      "Digital Signal Processing, Digital Image Processing, Analog & Digital VLSI Design, CAD for IC Design, Advanced VLSI Design",
  },
  {
    id: 11,
    name: "Prof. Soumya J",
    designation: "Associate Professor",
    qualification: "Ph.D (IIT-Kharagpur)",
    joinedBits: "June 2015",
    experience: "9 months (Industry), 9 years (Academics)",
    interests:
      "Network-on-Chip (NoC) design, Reconfigurable System design, Fault-Tolerant System Design, Real Time Systems, Verification",
    coursesTaught:
      "Microprocessors Programming and Interfacing, Embedded System Design, Real Time systems, Hardware Software Co-design, Digital Electronics, Device Drivers, Software for Embedded Systems",
  },
  {
    id: 12,
    name: "Prof. Radhika Sudha",
    designation: "Associate Professor",
    qualification: "Ph.D (Tokyo Polytechnic University, Tokyo, Japan)",
    joinedBits: "Nov 2017",
    experience: "19 years (Teaching and Research)",
    interests:
      "Power Electronics, Machine Condition Monitoring, Pattern recognition, Renewable Energy, ANN, IoT, Smart Grids, Energy Storage Systems",
    coursesTaught:
      "Control systems, Static Drives, Basic Electronics, Power Electronics, Electrical Sciences, Transducers and Measurement Systems, Digital Image processing, Electrical Machines",
  },
  {
    id: 13,
    name: "Dr. Mithun Mondal",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT-Roorkee)",
    joinedBits: "July 2017",
    experience: "2 years Academics",
    interests:
      "High Voltage Engineering, Condition Monitoring and Diagnostics of Transformers, High Voltage Engineering",
    coursesTaught: "Power Systems, Electrical Machines, Electrical Sciences",
  },
  {
    id: 14,
    name: "Dr. Harish V Dixit",
    designation: "Assistant Professor",
    qualification: "Ph.D (VJTI)",
    joinedBits: "December 26, 2017",
    experience: "9 years",
    interests:
      "Microwave and RF Engineering (High and Low Power), Multiphysics Analysis, Pulsed Power Technology",
    coursesTaught:
      "Electromagnetic Fields and Microwave Engineering, Control Systems, Control System Lab, RF Microelectronics",
  },
  {
    id: 15,
    name: "Dr. Sourav Nandi",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT Kharagpur)",
    joinedBits: "April 2018",
    interests:
      "Microstrip and Substrate Integrated Waveguide Antennas, Flexible Antennas, RF & Microwave Circuits, Antenna-based Sensors",
    coursesTaught:
      "EM Fields & Microwave Engineering, RF & Microwave Engineering, Antenna Theory and Design, Electrical Sciences, Wireles and Mobile Communication (WILP), RF Microelectronics, Microprocessor Programming & Interfacing (Tutorial & Lab), Digital Design(Tutorial)",
  },
  {
    id: 16,
    name: "Dr. Syed Ershad Ahmed",
    designation: "Assistant Professor",
    qualification: "Ph.D. (BITS-Pilani)",
    joinedBits: "July 2009",
    experience: "10 years of Academic and 1 year Industry Experience",
    interests: "VLSI Arithmetic Circuits, Low Power VLSI Design",
    coursesTaught:
      "Microelectronic Circuits, Digital Design, Electrical Science, Analog & Digital   VLSI Design, Embedded System Design, VLSI Architecture",
  },
  {
    id: 17,
    name: "Dr. Rajesh Kumar Tripathy",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT Guwahati)",
    joinedBits: "5th July, 2018",
    experience: "1.3 Years academia",
    interests:
      "Digital Signal Processing, Time-Frequency analysis, Pattern recognition and Machine Learning, Deep Learning for Healthcare",
    coursesTaught:
      "Signals and System, Neural network and Fuzzy logic, Introduction to Neural Network, Machine Learning, Digital Signal Processing, Digital Image Processing",
  },
  {
    id: 18,
    name: "Dr. Ponnalagu R N",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT-Madras)",
    joinedBits: "July 2018",
    experience: "14 years Academics",
    interests:
      "Sensors - Signal conditioning and Interfacing, Biomedical Instrumentation systems and Unmanned Aerial Vehicles & IoT Systems",
    coursesTaught:
      "Digital Design, Analog Electronics, Transducers and Measurement Systems, Industrial Instrumentation and Control, Electrical Sciences",
  },
  {
    id: 19,
    name: "Dr. Sayan Kanungo",
    designation: "Assistant Professor",
    qualification: "Ph.D. (IIEST-Shibpur)",
    joinedBits: "30th July 2018",
    experience: "3 Months-CSIR RA, 4 Years-CSIR SRF, 6 Months-Project name",
    interests:
      "Simulation, Design and Modelling of post-CMOS Devices for Gas Sensing, Bio Sensing and Memory Applications, First Principal Calculation, Computational investigations on two-dimensional (2D) materials for Gas Sensing, Photo Detection, and Battery Applications",
    coursesTaught:
      "Physics and Modelling of Microelectronic Devices, Electronic Devices, Modelling of Field Effect Nano-Devices, Electronic Device Simulation Laboratory, Electrical Science, FPGA-based System Design Laboratory, Microelectronic Circuits",
  },
  {
    id: 20,
    name: "Dr. Chetan Kumar V",
    designation: "Assistant Professor",
    qualification: "Ph.D. (BITS-Pilani)",
    joinedBits: "Nov 2011",
    experience: "2 Years of Industry Experience",
    interests:
      "Computer Arithmetic, CNFET based Multi-valued logic design, Design of reversible Arithmetic circuits",
    coursesTaught:
      "Digital Design, Analog Electronics, Microprocessor Programming and Interfacing, Computer Architecture, VLSI Architecture, Advanced VLSI Architecture, Reconfigurable Computing, VLSI Test & Testability",
  },
  {
    id: 21,
    name: "Dr. Parikshit Sahatiya",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT Hyderabad)",
    joinedBits: "Dec 2018",
    experience:
      "Research Scientist (Redpine Signals), Visiting Professor, Purdue University, USA, Visiting Professor, Tufts University, USA",
    interests:
      "Flexible and Wearable Electronics, 2D Materials-based Electronics, Broadband Photodetectors, Resistive memories, Transient Electronics, VOC sensing, Papertronics, etc.",
    coursesTaught:
      "Analog Electronics, Microelectronic Circuits, Electrical Science, and IC Fabrication Technology",
  },
  {
    id: 22,
    name: "Dr. Prashant Wali",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIIT Bangalore)",
    joinedBits: "December 2018",
    experience: "Around 18 Years of Teaching Experience",
    interests:
      "Radio Resource Allocation, MAC Optimization, Packet Scheduling in 4G and Beyond Broadband Wireless Networks",
    coursesTaught:
      "Advanced Digital Communications, Advanced Wireless Communications, Applied Estimation Theory, Computer Networks, Coding Theory and Practice, Microprocessor & Interfacing, Information Theory & Coding, Mobile & Personal Communication",
  },
  {
    id: 23,
    name: "Dr. Ankur Bhattacharjee",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIEST, Shibpur)",
    joinedBits: "July 2019",
    experience: "7 Years in Academics",
    interests:
      "Renewable Energy, Energy Storage, Hybrid Microgrids, Electric Vehicles, Battery Management Systems (BMS), Machine Learning Applications",
    coursesTaught:
      "Control Systems, Electrical Machines, Digital Design, Power Electronics, Smart Grid, Energy Storage Systems",
  },
  {
    id: 24,
    name: "Dr. STP Srinivas",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT Madras)",
    joinedBits: "2019",
    experience: "11 months (industry) + 18 months (Academics)",
    interests:
      "Power System Analysis, Control, Optimization & Protection, Smart Protection Systems, Microgrids",
    coursesTaught:
      "Electrical Sciences, Power Electronics (Theory + Lab course), Electrical Machines (Theory + Lab), Control Systems (lab)",
  },
  {
    id: 25,
    name: "Dr. Amit Kumar Panda",
    designation: "Assistant Professor",
    qualification: "Ph.D (IIT-Patna)",
    joinedBits: "January 2020",
    experience: "4 years in Academics",
    interests:
      "VLSI Architectural Design, VLSI for Cryptography, Hardware Security, FPGA based System Design",
    coursesTaught:
      "VLSI Architecture, Digital Design, Electrical Science, Analog Electronics, Hardware Software Co-design",
  },
  {
    id: 26,
    name: "Dr. Pratyush Chakraborty",
    designation: "Assistant Professor",
    qualification: "Ph.D. (University of Florida, USA)",
    joinedBits: "June 2020",
    experience: "3 years (Industry) + 3 years (Postdoctoral Research)",
    interests:
      "Game Theory, Power System, Renewable Integration, Control Theory, Cyber-Physical Systems",
    coursesTaught:
      "Signals & Systems, Power System Engineering-II (WILP), Electrical Machines, Modern Control Systems, Control Systems, Smart Grid, Sustainable Energy, Electrical & Electronics Technology (WILP)",
  },

  {
    id: 28,
    name: "Dr. Joyjit Mukherjee",
    designation: "Assistant Professor",
    qualification: "Ph.D. (IIT Delhi)",
    joinedBits: "December 2021",
    experience:
      "Academic - Postdoctoral Researcher at University of South Denmark Odense, Denmark (October 2020 - October 2021), Research Associate at JATC(DRDO), IIT Delhi (January 2020 - September 2020)",
    interests:
      "Control Theory, Robotics, Aerospace Control, Human-Robot Interaction, Digital Twins",
    coursesTaught: "Control Systems, Electrical Sciences, Digital Design",
  },
  {
    id: 29,
    name: "Dr. Atri Mukhopadhyay",
    designation: "Assistant Professor",
    qualification: "Ph. D. (IIT Kharagpur)",
    joinedBits: "Nov 2022",
    experience: "2.5 months (Industry) + 61 months (Academics)",
    interests:
      "MAC protocol design and resource allocation in wireless-optical access networks, optical access networks, wireless networks and free space optical networks. Network Optimization and Game Theory",
    coursesTaught: "Information Theory & Coding (ECE F344)",
  },
  {
    id: 30,
    name: "Dr. Niranjan Raj",
    designation: "Visiting Assistant Professor",
    qualification: "Ph.D. (IIT-Dhanbad)",
    joinedBits: "August 2023",
    experience: "1.5 years Post-doc at DESE Dept. IISc",
    interests:
      "Analog VLSI Design, Memristive Circuit, Neuromorphic Computing, Low power circuit design, Open source EDA tool",
    coursesTaught: "Analog Integrated Circuit",
  },
  {
    id: 31,
    name: "Dr. Anakhi Hazarika",
    designation: "Visiting Assistant Professor",
    qualification: "Ph.D. (IIIT-Guwahati)",
    joinedBits: "August 2023",
    experience: "6 Months Post-doc at EE Dept. IIT Hyderabad",
    interests:
      "AI-based Embedded System Design, Computer Vision application on Edge",
  },
];

export default professorData;
