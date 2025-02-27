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
          carCard.classList.add(
            "bg-white",
            "p-10", 
            "m-10",
            "lg:p-4", 
            "rounded-lg", 
            "shadow-md", 
            "w-[90%]",   // Takes 90% of the viewport width on mobile
            "lg:w-64",   // Fixed width for larger screens
            "flex-shrink-0",
            "snap-center",
            "mx-auto"    // Centers the card on mobile
          );
          carCard.innerHTML = `
              <img src="${car.image}" alt="${car.name}" class="lg:w-full h-40 object-cover rounded-md">
              <h2 class="text-lg font-bold mt-2">${car.name} – ${car.year}</h2>
              <p class="text-sm text-gray-500">${car.miles} | ${car.fuel} | ${car.transmission}</p>
              <p class="text-xl font-semibold mt-2">${car.price}</p>
          `;
          carContainer.appendChild(carCard);
      });
      
    }

   // Get all filter buttons
// const filterButtons = document.querySelectorAll(".tab-btn");

// Filtering event listener
filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Remove active styles from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("border-b-2", "text-black", "border-blue-500", "font-bold");
            btn.classList.add("text-gray-500"); // Make inactive tabs gray
        });

        // Add active styles to clicked button
        this.classList.add("border-b-2", "border-blue-500", "text-black", "font-bold");
        this.classList.remove("text-gray-500"); // Remove gray text color from the active tab

        // Remove focus outline (optional for better UI)
        this.blur();

        // Handle car filtering (if applicable)
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

  // Function to append message with a typing indicator
  function appendMessage(sender, message, isTyping = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(
      "p-2",
      "rounded-lg",
      "w-fit",
      "max-w-[66.67%]",
      "text-white",
      "text-sm"
    );

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
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't understand that."
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Error connecting to AI.";
    }
  }
}





document.addEventListener("DOMContentLoaded", () => {
  const brandList = document.getElementById("brandList");
  const showAllDesktop = document.getElementById("showAllDesktop");
  const showAllMobile = document.getElementById("showAllMobile");

  let isExpanded = false;
  const initialVisible = 6; // Number of brands to show initially
  let brands = []; // Store fetched data

  // Fetch brand data from external JSON file
  fetch("./data.json")
      .then(response => response.json())
      .then(data => {
          brands = data.brands;
          renderBrands();
      })
      .catch(error => console.error("Error fetching brand data:", error));

  // Function to render brands
  function renderBrands(showAll = false) {
      brandList.innerHTML = "";
      const visibleBrands = showAll ? brands : brands.slice(0, initialVisible);
      
      visibleBrands.forEach(brand => {
          const li = document.createElement("li");
          li.innerHTML = `
              <a class="px-4 py-4 flex flex-col border border-gray-300 lg:border-gray-200 rounded-lg" href="#">
                  <img class="w-20 flex justify-center m-auto items-center" src="${brand.img}" alt="${brand.name}">
                  <span class="font-semibold text-xs text-center">${brand.name}</span>
              </a>`;
          brandList.appendChild(li);
      });

      // Adjust grid layout for desktop
      if (!showAll) {
          brandList.classList.add("md:grid-cols-6");
      } else {
          brandList.classList.remove("md:grid-cols-6");
          brandList.classList.add("md:grid-cols-4", "lg:grid-cols-7");
      }
  }

  // "Show All" functionality for Desktop & Mobile
  function toggleBrands() {
      isExpanded = !isExpanded;
      renderBrands(isExpanded);
      showAllDesktop.textContent = isExpanded ? "Show Less" : "Show All Brands";
      showAllMobile.textContent = isExpanded ? "Show Less" : "Show All Brands";
  }

  showAllDesktop.addEventListener("click", toggleBrands);
  showAllMobile.addEventListener("click", toggleBrands);
});
