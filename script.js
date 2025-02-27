document.addEventListener("DOMContentLoaded", function () {
    const carContainer = document.getElementById("car-listings");
    const filterButtons = document.querySelectorAll(".tab-btn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let cars = [];

    // Fetch car data from JSON
    fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            cars = data.cars;
            renderCars("all"); // Show all cars initially
        });

    // Function to render cars based on category
    function renderCars(category) {
        carContainer.innerHTML = "";
        const filteredCars = category === "all" ? cars : cars.filter(car => car.category === category);
        
        filteredCars.forEach(car => {
            const carCard = document.createElement("div");
            carCard.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "w-64", "flex-shrink-0");
            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.name}" class="w-full h-40 object-cover rounded-md">
                <h2 class="text-lg font-bold mt-2">${car.name} – ${car.year}</h2>
                <p class="text-sm text-gray-500">${car.miles} | ${car.fuel} | ${car.transmission}</p>
                <p class="text-xl font-semibold mt-2">${car.price}</p>
            `;
            carContainer.appendChild(carCard);
        });
    }

    // Filtering event listener
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("border-b-2", "text-black"));
            this.classList.add("border-b-2", "text-black");

            const category = this.getAttribute("data-category");
            renderCars(category === "all" ? "in-stock" : category);
        });
    });

    // Slider functionality
    prevBtn.addEventListener("click", () => {
        carContainer.scrollBy({ left: -300, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
        carContainer.scrollBy({ left: 300, behavior: "smooth" });
    });
});

// Chat functionality
{
    const chatBtn = document.getElementById("chat-btn");
    const chatModal = document.getElementById("chat-modal");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
     
    // Show chat modal
    chatBtn.addEventListener("click", () => {
        chatModal.classList.remove("hidden");
        chatModal.classList.add("flex");
     
    });
     
    // Close chat modal
    closeChat.addEventListener("click", () => {
        chatModal.classList.add("hidden");
    });
     
    const travelKeywords = [
      "hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening",
      "how are you", "nice to meet you", "welcome", "how can I help you?", "what can I do for you?",
     
      "travel", "trip", "vacation", "holiday", "journey", "adventure", "tour", "tourism", "explore",
      "sightseeing", "excursion", "backpacking", "getaway", "solo travel", "family vacation",
      "romantic getaway", "honeymoon", "staycation", "weekend trip", "road trip", "travel guide",
      "travel tips",
     
      "destination", "city", "country", "continent", "island", "mountain", "beach", "national park",
      "landmark", "famous places", "bucket list destinations", "travel spots", "Europe", "Asia",
      "America", "Africa", "Australia", "London", "Paris", "New York", "Dubai", "Tokyo", "Madrid",
      "Barcelona", "Bali", "Maldives", "Thailand", "Sydney", "Los Angeles", "Rome", "Venice",
      "Hawaii", "Santorini", "Greece", "Iceland", "Amsterdam", "Berlin", "Singapore", "Hong Kong",
      "India", "Mexico", "Canada",
     
      "hotel", "hostel", "resort", "guesthouse", "homestay", "apartment rental", "Airbnb", "villa",
      "bungalow", "beachfront stay", "mountain lodge", "budget hotel", "luxury hotel", "boutique hotel",
      "all-inclusive resort", "cabin", "camping", "glamping", "best places to stay",
     
      "flight", "airline", "airport", "boarding pass", "ticket", "visa", "passport", "customs", "baggage",
      "luggage", "travel insurance", "security check", "layover", "connecting flight", "direct flight",
      "round-trip", "one-way ticket", "economy class", "business class", "first class", "budget airlines",
      "train", "bus", "car rental", "taxi", "uber", "lyft", "metro", "tram", "public transport", "ferry",
      "cruise", "bike rental", "road trip", "best way to travel",
     
      "itinerary", "travel checklist", "packing list", "travel budget", "travel deals", "cheap flights",
      "last-minute travel", "travel packages", "travel agency", "best time to visit", "things to do",
      "travel restrictions", "entry requirements", "currency exchange", "travel money", "safety tips",
      "weather", "local customs", "language barrier", "culture", "best travel apps",
     
      "beach activities", "hiking", "trekking", "skiing", "snowboarding", "camping", "scuba diving",
      "snorkeling", "safari", "wildlife tours", "museums", "historical sites", "theme parks", "shopping",
      "nightlife", "bars", "restaurants", "street food", "food tour", "festivals", "cultural events",
      "sightseeing", "city tour", "hot air balloon", "helicopter tour", "cruise trip", "spa retreat",
      "wellness travel", "yoga retreat", "photography spots", "adventure travel", "extreme sports",
      "surfing", "kayaking", "fishing", "boating",
     
      "local cuisine", "restaurants", "street food", "fine dining", "buffet", "Michelin star restaurants",
      "vegan food", "vegetarian options", "halal food", "gluten-free dining", "food delivery", "cafés",
      "coffee shops", "bars", "nightclubs", "traditional dishes", "cooking classes", "wine tasting",
      "food markets",
     
      "travel delays", "canceled flights", "lost baggage", "travel insurance claims", "visa problems",
      "hotel booking issues", "flight refund", "emergency contact", "embassy", "medical emergency",
      "local hospitals", "travel scam", "tourist safety", "lost passport", "customer service", "help desk",
      "support", "refund policy", "cancellation policy"
    ];
     
     
    // function isTravelRelated(message) {
    //   return travelKeywords.some(keyword => message.toLowerCase().includes(keyword));
    // }
     
     
    // Function to append message with a typing indicator
    function appendMessage(sender, message, isTyping = false) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("p-2", "rounded-lg", "w-fit", "max-w-[66.67%]", "text-white", "text-sm");
     
      if (sender === "user") {
        messageDiv.classList.add("bg-blue-500", "self-end", "ml-auto");
      } else {
        messageDiv.classList.add("bg-gray-700");
      }
     
      if (isTyping) {
        messageDiv.innerHTML = `<p><em>Typing...</em></p>`;
        messageDiv.classList.add("italic", "opacity-75");
      } else {
        let formattedMessage = message
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n\n/g, "</p><p>")
          .replace(/\* (.*?)\n/g, "<li>$1</li>")
          .replace(/(<li>.*?<\/li>)+/gs, "<ul>$&</ul>");
     
        messageDiv.innerHTML = `<p>${formattedMessage}</p>`;
      }
     
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
     
      return messageDiv;
    }
     
    // Handle message send
    sendBtn.addEventListener("click", async () => {
      const message = userInput.value.trim();
      if (!message) return;
     
      appendMessage("user", message);
      userInput.value = "";
     
      const typingIndicator = appendMessage("bot", "", true);
     
      const aiResponse = await fetchGeminiResponse(message);
     
      chatBox.removeChild(typingIndicator);
     
      appendMessage("bot", aiResponse);
    });
     
     
    // Function to fetch AI response from Gemini API
    async function fetchGeminiResponse(userMessage) {
      const API_KEY = "AIzaSyCeeHspSJlEoJfbGXRekivsBW-VYrchvCc"; // Replace with your actual API key
     
      try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: userMessage }] }]
              })
          });
     
          const data = await response.json();
          return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
      } catch (error) {
          console.error("Error fetching response:", error);
          return "Error connecting to AI.";
      }
    }
}