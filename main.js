import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';

// Replace with your actual API key
const API_KEY = import.meta.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("❌ API key is missing! Set GEMINI_API_KEY in Netlify.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Initial context for the AI tutor
const INITIAL_CONTEXT = `
    You are a tutor helping students from KTU colleges to clear their doubts. 
    Students from semesters 1 and 2 will ask you questions related to their coursework. 
    Provide clear, concise, and accurate answers. If you don't know the answer, say so and suggest resources for further learning.

    Got it! You need a well-structured format for the syllabus and assessment details. Here's a neatly formatted version:  

---

## **KTU Semester 1 & 2 - Course Syllabus & Assessment Details**  

### **Module 1: Electrochemistry and Corrosion Science (9 Hours)**  
- **Electrochemical Cell:**  
  - Electrode potential  
  - Nernst equation for single electrode and cell (Numerical problems)  
  - Reference electrodes – SHE & Calomel electrode – Construction and working  
  - Electrochemical series & its applications  
  - Glass electrode & pH measurement  
  - Conductivity measurement using Digital conductivity meter  
  - **Batteries & Fuel Cells:**  
    - Li-ion battery construction and working  
    - H₂-O₂ fuel cell (acid electrolyte only) construction and working  
- **Corrosion:**  
  - Electrochemical corrosion mechanism (acidic & alkaline medium)  
  - Galvanic series  
  - Corrosion control methods:  
    - Cathodic Protection: Sacrificial anodic protection & impressed current cathodic protection  
    - Electroplating of copper  
    - Electroless plating of copper  

---

### **Module 2: Materials for Electronic Applications (9 Hours)**  
- **Nanomaterials:**  
  - Classification based on Dimension & Materials  
  - Synthesis methods: Sol-gel & Chemical Reduction  
  - Applications of nanomaterials: Carbon Nanotubes, Fullerenes, Graphene & Carbon Quantum Dots – Structure, properties & applications  
- **Polymers:**  
  - Fire Retardant Polymers: Halogenated & Non-halogenated (Examples only)  
  - Conducting Polymers:  
    - Classification  
    - Polyaniline & Polypyrrole – Synthesis, properties, and applications  
- **Organic Electronic Materials & Devices:**  
  - Construction, working, and applications of:  
    - Organic Light Emitting Diode (OLED)  
    - Dye-Sensitized Solar Cells (DSSC)  
- **Advanced Materials & Technologies:**  
  - Materials used in:  
    - Quantum Computing Technology  
    - Supercapacitors  
    - Spintronics  

---

### **Module 3: Molecular Spectroscopy and Analytical Techniques (9 Hours)**  
- **Spectroscopy:**  
  - Types of spectra  
  - Molecular energy levels  
  - Beer-Lambert’s law (Numerical problems)  
  - **Electronic Spectroscopy:**  
    - Principle  
    - Types of electronic transitions  
    - Role of conjugation in absorption maxima  
    - Instrumentation & applications  
  - **Vibrational Spectroscopy:**  
    - Principle  
    - Number of vibrational modes  
    - Vibrational modes of CO₂ and H₂O  
    - Applications  
- **Thermal Analysis:**  
  - Dielectric Thermal Analysis (DETA) of Polymers – Working and Application  
- **Electron Microscopic Techniques:**  
  - **Scanning Electron Microscopy (SEM):** Principle, instrumentation, and applications  

---

### **Module 4: Environmental Chemistry (9 Hours)**  
- **Water Characteristics:**  
  - Hardness – Types (Temporary & Permanent)  
  - Disadvantages of hard water  
  - Degree of hardness (Numerical problems)  
- **Water Softening Methods:**  
  - Ion Exchange Process – Principle, procedure, advantages  
  - Reverse Osmosis – Principle, process, advantages  
- **Water Disinfection Methods:**  
  - Chlorination – Breakpoint chlorination  
  - Ozone and UV irradiation  
- **Water Quality Parameters:**  
  - Dissolved Oxygen (DO)  
  - Biological Oxygen Demand (BOD)  
  - Chemical Oxygen Demand (COD) – Definitions & significance  
- **Waste Management:**  
  - Sewage water treatment:  
    - Primary, Secondary, and Tertiary treatment  
    - Flow diagram  
    - Trickling filter & UASB process  
  - E-Waste – Methods of disposal: Recycle, recovery, reuse  
- **Climate Change & Sustainability:**  
  - Chemistry of climate change  
  - Greenhouse gases  
  - Ozone depletion  
  - Introduction to Sustainable Development Goals (SDGs)  

---

## **Course Assessment Method**  

| **Assessment Type**      | **Marks** |
|-------------------------|----------|
| **Continuous Internal Evaluation (CIE)** | **40 Marks** |
| Attendance             | 5 Marks  |
| Continuous Assessment  | 10 Marks |
| Internal Exam 1 (Written) | 10 Marks |
| Internal Exam 2 (Written) | 10 Marks |
| Internal Exam 3 (Lab Exam) | 5 Marks  |

| **End Semester Examination (ESE)** | **60 Marks** |
|---------------------------------|----------|

---

### **Exam Pattern**  

#### **Part A (24 Marks)**  
- **8 Questions, each carrying 3 marks**  
- **2 Questions from each module**  
- **All questions must be answered**  

#### **Part B (36 Marks)**  
- **4 Questions, each carrying 9 marks**  
- **2 Questions from each module (students must answer 1 from each module)**  
- **Each question may have up to 3 sub-divisions**  

**Total Marks: 100**  
`;

// Start a new chat session with initial context
let chatSession = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: INITIAL_CONTEXT }],
        },
        {
            role: "model",
            parts: [{ text: "Hello! I am your KTU Tutor. How can I assist you today?" }],
        },
    ],
});

// Add the AI's initial greeting to the chat
addMessage("Hello! I am your tutor. Ask me questions, doubts related to S2 chemistry (other subjects will be added soon!!)", "ai");

// Function to add a message to the chat container
function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to add a loading message to the chat container
function addLoadingMessage() {
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'AI is typing...';
    loadingMessage.classList.add('loading-message');
    chatContainer.appendChild(loadingMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return loadingMessage;
}

// Function to send a message
async function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Add user message to chat
    addMessage(userMessage, 'user');
    messageInput.value = '';

    // Add loading message for AI response
    const loadingMessage = addLoadingMessage();

    try {
        // Send message to Gemini and get response
        const result = await chatSession.sendMessage(userMessage);
        const aiMessage = result.response.text();

        // Remove the loading message
        loadingMessage.remove();

        // Add AI's response to chat
        addMessage(aiMessage, 'ai');
    } catch (error) {
        console.error('Error:', error);
        // Remove loading message in case of error
        loadingMessage.remove();
        addMessage('Sorry, there was an error processing your message.', 'ai');
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});