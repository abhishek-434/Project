document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('input[name="search"]');
    const destinationCards = document.querySelectorAll('.destination-card');
    const destinationsGrid = document.querySelector('.row');
    const originalCards = Array.from(destinationCards);

    // Create a sort dropdown
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
        <option value="">Sort By</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
    `;
    sortSelect.className = "form-select w-auto ms-3";

    // Create reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Reset";
    resetBtn.className = "btn btn-secondary ms-2";

    // Insert controls beside search bar
    const form = document.querySelector('.search-bar form');
    form.appendChild(sortSelect);
    form.appendChild(resetBtn);

    // Function to filter cards based on input
    function filterCards(query) {
        const q = query.toLowerCase();
        originalCards.forEach(card => {
            const name = card.querySelector('.destination-name').textContent.toLowerCase();
            const country = card.querySelector('.card-subtitle').textContent.toLowerCase();
            const desc = card.querySelector('.card-text').textContent.toLowerCase();
            if (name.includes(q) || country.includes(q) || desc.includes(q)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Function to sort cards
    function sortCards(type) {
        let sorted = [...originalCards];
        if (type === "name-asc") {
            sorted.sort((a, b) =>
                a.querySelector('.destination-name').textContent.localeCompare(
                    b.querySelector('.destination-name').textContent
                )
            );
        } else if (type === "name-desc") {
            sorted.sort((a, b) =>
                b.querySelector('.destination-name').textContent.localeCompare(
                    a.querySelector('.destination-name').textContent
                )
            );
        }
        destinationsGrid.innerHTML = '';
        sorted.forEach(card => destinationsGrid.appendChild(card));
    }

    // Event listeners
    searchInput.addEventListener('input', function () {
        filterCards(this.value);
    });

    sortSelect.addEventListener('change', function () {
        sortCards(this.value);
    });

    resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        sortSelect.value = '';
        destinationsGrid.innerHTML = '';
        originalCards.forEach(card => {
            card.style.display = '';
            destinationsGrid.appendChild(card);
        });
    });
});
