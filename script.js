// ===== CONFIGURATION =====
    const GOOGLE_SHEET_URL = "https://opensheet.elk.sh/1ub-EWceY8j_PNeFzNgPS6RTQBG8bF34uFPrp51jkrNM/1"; 
    const CONTACT_METHOD = ""; 
    const CONTACT_NUMBER = ""; 
    const MESSENGER_ID = "589438660925893"; 

    // ===== VARIABLES =====
    let cart = [];
    let productsData = [];

    // Charger les produits depuis Google Sheets
    async function loadProducts() {
      try {
        const res = await fetch(GOOGLE_SHEET_URL);
        productsData = await res.json();
        displayProducts(productsData);
      } catch (err) {
        console.error("Erreur de chargement des produits", err);
      }
    }

    function displayProducts(data) {
      const container = document.getElementById("productList");
      container.innerHTML = "";

      data.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${prod.Image}" alt="${prod.Titre} onclick="openLightbox('${prod.Image}')">
          <div class="card-content">
            <h3>${prod.Titre}</h3>
            <p>${prod.Description || "" }</p>
            <p style=" color:green;"><b>Prix Original:${prod.PrixO} Ar</b></p>
            <p style=" color:red;"><b>Prix Reproduction:${prod.PrixR} Ar</b></p>
            <button onclick="addToCart('${prod.Titre}', '${prod.PrixO}')">Ajouter au panier</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // Recherche produit
    document.getElementById("searchInput").addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = productsData.filter(prod =>
        prod.Nom.toLowerCase().includes(value)
      );
      displayProducts(filtered);
    });

    function addToCart(name, price) {
      cart.push({ name, price });
      displayCart();
    }

    function displayCart() {
      const cartDiv = document.getElementById("cartItems");
      cartDiv.innerHTML = "";
      cart.forEach((item, i) => {
        cartDiv.innerHTML += `
          <div class="cart-item">
            <span>${item.name} (${item.price} Ar)</span>
            <a href="#" onclick="removeFromCart(${i})">Supprimer</a>
          </div>
        `;
      });
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      displayCart();
    }

    function sendOrder() {
      if (cart.length === 0) return alert("Votre panier est vide !");
      let message = "Bonjour, je veux commander :%0A";
      cart.forEach(item => {
        message += `- ${item.name} (${item.price} Ar)%0A`;
      });

      if (CONTACT_METHOD === "whatsapp") {
        window.open(`https://wa.me/${CONTACT_NUMBER}?text=${message}`, "_blank");
      } else {
        window.open(`https://m.me/${MESSENGER_ID}?text=${message}`, "_blank");
      }
    }


    loadProducts();