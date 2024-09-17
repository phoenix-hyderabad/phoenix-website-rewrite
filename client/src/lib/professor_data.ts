const professors = [
  {
    id: 1,
    faculty: "Prof. Subhendu Kumar Sahoo (HOD)",
    Designation: "Professor",
    Qualification: "Ph.D. (BITS-Pilani, Pilani Campus)",
    JoinedBits: "June 1999",
    Interests: "VLSI architecture for Digital Signal Processing",
    CoursesTaught:
      "Digital Signal Processing, Signals and Systems, Communication network, Data communication and Networks, Telecommunication and switching system, Communication Systems, Digital Electronics, FPGA System Design",
  },
  {
    id: 2,
    faculty: "Dr. Subhradeep Pal (FIC)",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT-Patna)",
    JoinedBits: "September 2020",
    Experiences: "7 years in Academics",
    Interests:
      "Silicon Photonics, Optical Fiber Communications, Photonic Integrated Circuits, Photo Detectors, Memristors",
    CoursesTaught:
      "Optical Communication, Digital Communication, Optoelectronics, Microprocessor and Interfaces, Communication Systems",
  },
  {
    id: 27,
    faculty: "Prof. S Gurunarayanan",
    Designation: "Senior Professor",
    Qualification: "Ph.D. (BITS-Pilani)",
    JoinedBits: "1987",
    Experiences: "35 years in Academics",
    Interests: "Digital VLSI Design, Processor Architecture",
    CoursesTaught:
      "Electronics, VLSI Design, Digital Design, Microprocessors Programming & Interfacing, VLSI Architecture, Analog Electronics, Embedded System Design, Computer Architecture",
  },
  {
    id: 3,
    faculty: "Prof. Sanket Goel",
    Designation: "Professor, Dean-SRCD, PIC-CIIE",
    Qualification:
      "BS (H - Delhi University), MS (IIT Delhi), PhD (University of Alberta, Canada), Postdoctoral (Stanford University)",
    JoinedBits: "2015",
    Experiences:
      "17 Years (2 years postdoc, 3 years public-funded R&D, 12 years academia)",
    Interests:
      "MEMS, Microfluidics, Nanoelectronics, Flexible, Printed and Wearable Electronics, Cyber-Physical Systems, Lab-on-a-chip, Point-of-Care devices, 3D printing, Fuel Cells, Smart sensors",
    labWebsite: "MEMS, Microfluidics and Nanoelectronics (MMNE) Lab",
    CoursesTaught:
      "Analog Electronics, Digital Design, Electrical Science, Electronic Devices, Electronic Instrumentation, IC Fabrication, MEMS, Microfluidics, Transducers & Measurement Systems",
  },
  {
    id: 4,
    faculty: "Prof. BVVSN Prabhakar Rao",
    Designation: "Professor",
    Qualification: "Ph.D. (IIT Delhi)",
    JoinedBits: "July 2009",
    Experiences: "12 years Academics",
    Interests: "Biomedical Signal/Image Processing",
    CoursesTaught:
      "Electrical Sciences, Signals & Systems, Electronic Devices, Digital Signal Processing, Fibre optics, Optoelectronics & Analog Electronics",
  },
  {
    id: 5,
    faculty: "Prof. Alivelu Manga Parimi",
    Designation: "Professor",
    Qualification: "PhD (University Technology Petronas, Malaysia)",
    JoinedBits: "May 2012",
    Experiences: "21 years in Academics",
    Interests:
      "Renewable Energy Sources, Microgrids, FACTS devices, Power system stability, Power Quality, Reactive power compensation, Modal Analysis, Control Systems, Batteries, Implementation of ML Techniques",
    CoursesTaught:
      "Electrical Machines, Modern Control Systems, Power Systems, Control Systems, Electrical Sciences, Power Systems Engineering(WILP), Electromechanical Energy Conversion, Power System Operation and Control, Transducers and Measurement Systems, Power Electronics",
  },
  {
    id: 6,
    faculty: "Prof. Prasant Kumar Pattnaik",
    Designation: "Associate Professor",
    Qualification: "Ph.D (Indian Institute of Science, Bangalore)",
    JoinedBits: "June 2012",
    Experiences: "14 years Academics, 1 year Industry",
    Interests:
      "Photonics, Optical Communications, Photonic Integrated Circuits, Microfluidics and MEMS - DST-SERB (51.42 Lakhs), Microwave Engineering – BRNS (25.5 Lakhs)",
    CoursesTaught:
      "Optical Communications, Fiber Optics and Optoelectronics, Communication Systems, Analog Electronics, Introduction to MEMS, Electrical Sciences, Electromagnetic Fields and Microwave Engineering, Electromagnetic Fields and Waves, Integrated Optics, Digital Electronics (Lab), Analog Electronics (Lab), Microwave Engineering (Lab), Communication Systems (Lab), Electrical and Electronics Circuits (Lab)",
  },
  {
    id: 7,
    faculty: "Prof. Runa Kumari",
    Designation: "Associate Professor",
    Qualification: "Ph.D (NIT-Rourkela)",
    JoinedBits: "Mar 2014",
    Experiences: "4 years",
    Interests:
      "Dielectric Resonator Antenna, Log periodic Antenna, Reconfigurable Antenna, Microstrip antenna, EBG, Metamaterial, Antenna Array",
    CoursesTaught:
      "Electrical Sciences, Communication Systems, Microprocessor Programming and Interfacing, Electromagnetic Fields and Microwave Engineering, Mobile & Personal Communication, RF & Microwave Engg., Coding Theory & Practice, Advanced Digital Communication, Satellite Communication, Communication Networks, Information Theory & Coding",
  },
  {
    id: 8,
    faculty: "Dr. Venkateswaran Rajagopalan",
    Designation: "Associate Professor",
    Qualification: "D.Eng (Cleveland State University, Cleveland, OH, USA)",
    JoinedBits: "May 2014",
    Interests:
      "Human brain mapping using Magnetic Resonance Imaging (MRI), Transcranial Magnetic Stimulation (TMS), Electroencephalography (EEG), Positron Emission Tomography (PET), Neurological disorders Amyotrophic Lateral Sclerosis (ALS), Multiple Sclerosis (MS), Brain Tumor, Machine Learning, Graph Theory (brain network analysis)",
    CoursesTaught:
      "Signals and Systems, Digital Image Processing, Digital Signal processing, Advanced Digital Signal Processing, Medical Instrumentation, Introduction to Artificial Neural Networks",
  },
  {
    id: 9,
    faculty: "Prof. Surya Shankar Dan",
    Designation: "Associate Professor",
    Qualification: "Ph.D. (IISc Bangalore)",
    JoinedBits: "2016",
    Interests:
      "(1) Development of ML-based data-driven modeling of nanoelectronic devices for their circuit applications; (2) Development of physics-based compact analytical models for nanoelectronic devices and their circuit applications; (3) Design of ultra-low-power and high-performance analog, digital and ternary circuits at the state-of-the-art technology nodes; (4) Development of device and circuit simulators for SPICE applications",
    researchLab: "Nanoelectronic Devices and Circuits Laboratory (NDCL)",
    CoursesTaught:
      "Advanced VLSI Design (HD), Physics & Modeling of Microelectronic Devices (HD), Microelectronic Circuits (FD), Analog & Digital VLSI Design (FD), Electronic Devices (FD)",
  },
  {
    id: 10,
    faculty: "Prof. Sumit Kumar Chatterjee",
    Designation: "Associate Professor",
    Qualification: "Ph.D (IIT Kharagpur)",
    JoinedBits: "May 2015",
    Experiences: "16 years",
    Interests: "Digital VLSI Design, Video Compression",
    CoursesTaught:
      "Digital Signal Processing, Digital Image Processing, Analog & Digital VLSI Design, CAD for IC Design, Advanced VLSI Design",
  },
  {
    id: 11,
    faculty: "Prof. Soumya J",
    Designation: "Associate Professor",
    Qualification: "Ph.D (IIT-Kharagpur)",
    JoinedBits: "June 2015",
    Experiences: "9 months (Industry), 9 years (Academics)",
    Interests:
      "Network-on-Chip (NoC) design, Reconfigurable System design, Fault-Tolerant System Design, Real Time Systems, Verification",
    CoursesTaught:
      "Microprocessors Programming and Interfacing, Embedded System Design, Real Time systems, Hardware Software Co-design, Digital Electronics, Device Drivers, Software for Embedded Systems",
  },
  {
    id: 12,
    faculty: "Prof. Radhika Sudha",
    Designation: "Associate Professor",
    Qualification: "Ph.D (Tokyo Polytechnic University, Tokyo, Japan)",
    JoinedBits: "Nov 2017",
    Experiences: "19 years (Teaching and Research)",
    Interests:
      "Power Electronics, Machine Condition Monitoring, Pattern recognition, Renewable Energy, ANN, IoT, Smart Grids, Energy Storage Systems",
    CoursesTaught:
      "Control systems, Static Drives, Basic Electronics, Power Electronics, Electrical Sciences, Transducers and Measurement Systems, Digital Image processing, Electrical Machines",
  },
  {
    id: 13,
    faculty: "Dr. Mithun Mondal",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT-Roorkee)",
    JoinedBits: "July 2017",
    Experiences: "2 years Academics",
    Interests:
      "High Voltage Engineering, Condition Monitoring and Diagnostics of Transformers, High Voltage Engineering",
    CoursesTaught: "Power Systems, Electrical Machines, Electrical Sciences",
  },
  {
    id: 14,
    faculty: "Dr. Harish V Dixit",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (VJTI)",
    JoinedBits: "December 26, 2017",
    Experiences: "9 years",
    Interests:
      "Microwave and RF Engineering (High and Low Power), Multiphysics Analysis, Pulsed Power Technology",
    CoursesTaught:
      "Electromagnetic Fields and Microwave Engineering, Control Systems, Control System Lab, RF Microelectronics",
  },
  {
    id: 15,
    faculty: "Dr. Sourav Nandi",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT Kharagpur)",
    JoinedBits: "April 2018",
    Interests:
      "Microstrip and Substrate Integrated Waveguide Antennas, Flexible Antennas, RF & Microwave Circuits, Antenna-based Sensors",
    CoursesTaught:
      "EM Fields & Microwave Engineering, RF & Microwave Engineering, Antenna Theory and Design, Electrical Sciences, Wireles and Mobile Communication (WILP), RF Microelectronics, Microprocessor Programming & Interfacing (Tutorial & Lab), Digital Design(Tutorial)",
  },
  {
    id: 16,
    faculty: "Dr. Syed Ershad Ahmed",
    Designation: "Assistant Professor",
    Qualification: "Ph.D. (BITS-Pilani)",
    JoinedBits: "July 2009",
    Experiences: "10 years of Academic and 1 year Industry Experience",
    Interests: "VLSI Arithmetic Circuits, Low Power VLSI Design",
    CoursesTaught:
      "Microelectronic Circuits, Digital Design, Electrical Science, Analog & Digital   VLSI Design, Embedded System Design, VLSI Architecture",
  },
  {
    id: 17,
    faculty: "Dr. Rajesh Kumar Tripathy",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT Guwahati)",
    JoinedBits: "5th July, 2018",
    Experiences: "1.3 Years academia",
    Interests:
      "Digital Signal Processing, Time-Frequency analysis, Pattern recognition and Machine Learning, Deep Learning for Healthcare",
    CoursesTaught:
      "Signals and System, Neural network and Fuzzy logic, Introduction to Neural Network, Machine Learning, Digital Signal Processing, Digital Image Processing",
  },
  {
    id: 18,
    faculty: "Dr. Ponnalagu R N",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT-Madras)",
    JoinedBits: "July 2018",
    Experiences: "14 years Academics",
    Interests:
      "Sensors - Signal conditioning and Interfacing, Biomedical Instrumentation systems and Unmanned Aerial Vehicles & IoT Systems",
    CoursesTaught:
      "Digital Design, Analog Electronics, Transducers and Measurement Systems, Industrial Instrumentation and Control, Electrical Sciences",
  },
  {
    id: 19,
    faculty: "Dr. Sayan Kanungo",
    Designation: "Assistant Professor",
    Qualification: "Ph.D. (IIEST-Shibpur)",
    JoinedBits: "30th July 2018",
    Experiences: "3 Months-CSIR RA, 4 Years-CSIR SRF, 6 Months-Project Faculty",
    Interests:
      "Simulation, Design and Modelling of post-CMOS Devices for Gas Sensing, Bio Sensing and Memory Applications, First Principal Calculation, Computational investigations on two-dimensional (2D) materials for Gas Sensing, Photo Detection, and Battery Applications",
    CoursesTaught:
      "Physics and Modelling of Microelectronic Devices, Electronic Devices, Modelling of Field Effect Nano-Devices, Electronic Device Simulation Laboratory, Electrical Science, FPGA-based System Design Laboratory, Microelectronic Circuits",
  },
  {
    id: 20,
    faculty: "Dr. Chetan Kumar V",
    Designation: "Assistant Professor",
    Qualification: "Ph.D. (BITS-Pilani)",
    JoinedBits: "Nov 2011",
    Experiences: "2 Years of Industry Experience",
    Interests:
      "Computer Arithmetic, CNFET based Multi-valued logic design, Design of reversible Arithmetic circuits",
    CoursesTaught:
      "Digital Design, Analog Electronics, Microprocessor Programming and Interfacing, Computer Architecture, VLSI Architecture, Advanced VLSI Architecture, Reconfigurable Computing, VLSI Test & Testability",
  },
  {
    id: 21,
    faculty: "Dr. Parikshit Sahatiya",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT Hyderabad)",
    JoinedBits: "Dec 2018",
    Experiences:
      "Research Scientist (Redpine Signals), Visiting Professor, Purdue University, USA, Visiting Professor, Tufts University, USA",
    Interests:
      "Flexible and Wearable Electronics, 2D Materials-based Electronics, Broadband Photodetectors, Resistive memories, Transient Electronics, VOC sensing, Papertronics, etc.",
    CoursesTaught:
      "Analog Electronics, Microelectronic Circuits, Electrical Science, and IC Fabrication Technology",
  },
  {
    id: 22,
    faculty: "Dr. Prashant Wali",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIIT Bangalore)",
    JoinedBits: "December 2018",
    Experiences: "Around 18 Years of Teaching Experience",
    Interests:
      "Radio Resource Allocation, MAC Optimization, Packet Scheduling in 4G and Beyond Broadband Wireless Networks",
    CoursesTaught:
      "Advanced Digital Communications, Advanced Wireless Communications, Applied Estimation Theory, Computer Networks, Coding Theory and Practice, Microprocessor & Interfacing, Information Theory & Coding, Mobile & Personal Communication",
  },
  {
    id: 23,
    faculty: "Dr. Ankur Bhattacharjee",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIEST, Shibpur)",
    JoinedBits: "July 2019",
    Experiences: "7 Years in Academics",
    Interests:
      "Renewable Energy, Energy Storage, Hybrid Microgrids, Electric Vehicles, Battery Management Systems (BMS), Machine Learning Applications",
    CoursesTaught:
      "Control Systems, Electrical Machines, Digital Design, Power Electronics, Smart Grid, Energy Storage Systems",
  },
  {
    id: 24,
    faculty: "Dr. STP Srinivas",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT Madras)",
    JoinedBits: "2019",
    Experiences: "11 months (industry) + 18 months (Academics)",
    Interests:
      "Power System Analysis, Control, Optimization & Protection, Smart Protection Systems, Microgrids",
    CoursesTaught:
      "Electrical Sciences, Power Electronics (Theory + Lab course), Electrical Machines (Theory + Lab), Control Systems (lab)",
  },
  {
    id: 25,
    faculty: "Dr. Amit Kumar Panda",
    Designation: "Assistant Professor",
    Qualification: "Ph.D (IIT-Patna)",
    JoinedBits: "January 2020",
    Experiences: "4 years in Academics",
    Interests:
      "VLSI Architectural Design, VLSI for Cryptography, Hardware Security, FPGA based System Design",
    CoursesTaught:
      "VLSI Architecture, Digital Design, Electrical Science, Analog Electronics, Hardware Software Co-design",
  },
  {
    id: 26,
    faculty: "Dr. Pratyush Chakraborty",
    Designation: "Assistant Professor",
    Qualification: "Ph.D. (University of Florida, USA)",
    JoinedBits: "June 2020",
    Experiences: "3 years (Industry) + 3 years (Postdoctoral Research)",
    Interests:
      "Game Theory, Power System, Renewable Integration, Control Theory, Cyber-Physical Systems",
    CoursesTaught:
      "Signals & Systems, Power System Engineering-II (WILP), Electrical Machines, Modern Control Systems, Control Systems, Smart Grid, Sustainable Energy, Electrical & Electronics Technology (WILP)",
  },

  {
    id: 28,
    faculty: "Dr. Joyjit Mukherjee",
    Designation: "Assistant Professor",
    Qualification: "Ph.D. (IIT Delhi)",
    JoinedBits: "December 2021",
    Experiences:
      "Academic - Postdoctoral Researcher at University of South Denmark Odense, Denmark (October 2020 - October 2021), Research Associate at JATC(DRDO), IIT Delhi (January 2020 - September 2020)",
    Interests:
      "Control Theory, Robotics, Aerospace Control, Human-Robot Interaction, Digital Twins",
    CoursesTaught: "Control Systems, Electrical Sciences, Digital Design",
  },
  {
    id: 29,
    faculty: "Dr. Atri Mukhopadhyay",
    Designation: "Assistant Professor",
    Qualification: "Ph. D. (IIT Kharagpur)",
    JoinedBits: "Nov 2022",
    Experiences: "2.5 months (Industry) + 61 months (Academics)",
    Interests:
      "MAC protocol design and resource allocation in wireless-optical access networks, optical access networks, wireless networks and free space optical networks. Network Optimization and Game Theory",
    CoursesTaught: "Information Theory & Coding (ECE F344)",
  },
  {
    id: 30,
    faculty: "Dr. Niranjan Raj",
    Designation: "Visiting Assistant Professor",
    Qualification: "Ph.D. (IIT-Dhanbad)",
    JoinedBits: "August 2023",
    Experiences: "1.5 years Post-doc at DESE Dept. IISc",
    Interests:
      "Analog VLSI Design, Memristive Circuit, Neuromorphic Computing, Low power circuit design, Open source EDA tool",
    CoursesTaught: "Analog Integrated Circuit",
  },
  {
    id: 31,
    faculty: "Dr. Anakhi Hazarika",
    Designation: "Visiting Assistant Professor",
    Qualification: "Ph.D. (IIIT-Guwahati)",
    JoinedBits: "August 2023",
    Experiences: "6 Months Post-doc at EE Dept. IIT Hyderabad",
    Interests:
      "AI-based Embedded System Design, Computer Vision application on Edge",
  },
];

export default professors;
