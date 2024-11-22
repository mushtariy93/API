const wrapper = document.querySelector(".wrapper");
const allCategories = document.querySelector(".categories");
const API_URL = "https://dummyjson.com";
const seeMore = document.querySelector(".see_more");
const loading = document.querySelector(".loading");

let offset = 1;
let perPageCount = 4;
let categoryName = "";
let totalProducts = 0;
let reachedEnd = false;

allCategories.addEventListener("click", async (event) => {
  if (event.target.classList.contains("card__category")) {
    categoryName =
      event.target.textContent === "All" ? "" : event.target.textContent;
    offset = 1;
    reachedEnd = false;
    wrapper.innerHTML = "";
    seeMore.style.display = "block";
    await fetchProducts();
  }
});

async function getAllCategories() {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    const data = await response.json();

    const allBtn = document.createElement("button");
    allBtn.classList.add("card__category");
    allBtn.textContent = "All";
    allCategories.appendChild(allBtn);

    data.forEach((category) => {
      const categoryBtn = document.createElement("button");
      categoryBtn.classList.add("card__category");
      categoryBtn.textContent = category.name;
      allCategories.appendChild(categoryBtn);
    });
  } catch (error) {
    console.error(error);
  }
}

function renderProducts(data) {
  if (data.products.length === 0) {
    alert("No products available in this category!");
    seeMore.style.display = "none";
    return;
  }

  data.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}">
      <h3>${product.title}</h3>
      <strong>$${product.price} USD</strong>
      <button>Buy now</button>
    `;

    // Sarlavhaga stil berish
    const productTitle = card.querySelector("h3"); // Yaratilgan card ichidagi h3 elementini tanlash
    productTitle.style.color = "green"; // Sarlavhaning rangini yashil qilish
    productTitle.style.fontSize = "24px"; // Matn o‘lchamini o‘zgartirish
    productTitle.style.fontWeight = "bold"; // Matnni qalin qilish

    wrapper.appendChild(card);
  });

  window.scrollTo(0, wrapper.scrollHeight);
}


async function fetchProducts() {
  if (reachedEnd) {
    alert("No more products available!");
    return;
  }

  try {
    loading.style.display = "flex";
    const apiUrl = categoryName
      ? `${API_URL}/products/category/${categoryName}?limit=${perPageCount}&skip=${
          (offset - 1) * perPageCount
        }`
      : `${API_URL}/products?limit=${perPageCount}&skip=${
          (offset - 1) * perPageCount
        }`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (offset === 1) {
      totalProducts = data.total || data.products.length;
    }

    renderProducts(data);

    console.log(offset);
    if ((offset - 1) * perPageCount + data.products.length >= totalProducts) {
      reachedEnd = true;
      alert("You have reached the end!");
      seeMore.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.style.display = "none";
    loading.style.visibility = "hidden";
    seeMore.removeAttribute("disabled");
  }
}

seeMore.addEventListener("click", async () => {
  offset++;
  seeMore.setAttribute("disabled", true);
  await fetchProducts();
});

getAllCategories();
fetchProducts();
