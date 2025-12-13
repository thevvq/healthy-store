document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.querySelector(".product-list");
    if (!listEl) return;

    // Tất cả item ban đầu
    const items = Array.from(listEl.querySelectorAll(".product-list-item"));

    const perPageSelect = document.getElementById("filter-per-page");
    const sortSelect = document.getElementById("filter-sort");
    const searchInput = document.getElementById("filter-search");
    const searchBtn = document.getElementById("filter-search-btn");
    const viewButtons = document.querySelectorAll(".view-btn");

    const priceFromInput = document.getElementById("price-from");
    const priceToInput = document.getElementById("price-to");
    const priceBtn = document.getElementById("btn-price-filter");

    const state = {
        perPage: parseInt(perPageSelect?.value || items.length, 10) || items.length,
        sort: sortSelect?.value || "latest",
        search: "",
        view: "grid",
        minPrice: null,
        maxPrice: null,
    };

    const getNumber = (el, key) => {
        const val = el.dataset[key];
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const getIndex = (el) => {
        const val = parseInt(el.dataset.index || "0", 10);
        return isNaN(val) ? 0 : val;
    };

    const applyFilters = () => {
        const keyword = (state.search || "").trim().toLowerCase();

        let filtered = items;

        // 1. Lọc theo search (theo title)
        
        if (keyword) {
            filtered = filtered.filter((el) => {
                const title = (el.dataset.title || "").toLowerCase();
                return title.includes(keyword);
            });
        }

        // 2. Lọc theo khoảng giá
        if (state.minPrice != null || state.maxPrice != null) {
            filtered = filtered.filter((el) => {
                const price = getNumber(el, "price");
                if (state.minPrice != null && price < state.minPrice) return false;
                if (state.maxPrice != null && price > state.maxPrice) return false;
                return true;
            });
        }

        // 3. Sắp xếp
        const sorted = [...filtered].sort((a, b) => {
            switch (state.sort) {
                case "price_asc":
                    return getNumber(a, "price") - getNumber(b, "price");
                case "price_desc":
                    return getNumber(b, "price") - getNumber(a, "price");
                case "discount_desc":
                    return getNumber(b, "discount") - getNumber(a, "discount");
                case "name_asc":
                    return (a.dataset.title || "").localeCompare(
                        b.dataset.title || ""
                    );
                case "latest":
                default:
                    // index lớn hơn = mới hơn (giữ logic cũ)
                    return getIndex(b) - getIndex(a);
            }
        });

        const limit = state.perPage || sorted.length;

        // 4. Ẩn hết trước
        items.forEach((el) => {
            el.style.display = "none";
        });

        // 5. Sắp xếp lại DOM + show theo perPage
        sorted.forEach((el, idx) => {
            listEl.appendChild(el); // move node

            if (idx < limit) {
                el.style.display = "";
            } else {
                el.style.display = "none";
            }
        });
    };

    // ----- EVENTS -----

    // Thay đổi số sản phẩm / trang
    perPageSelect?.addEventListener("change", () => {
        state.perPage = parseInt(perPageSelect.value, 10) || items.length;
        applyFilters();
    });

    // Thay đổi kiểu sort
    sortSelect?.addEventListener("change", () => {
        state.sort = sortSelect.value;
        applyFilters();
    });

    const triggerSearch = () => {
        state.search = searchInput?.value || "";
        applyFilters();
    };

    // Live search
    searchInput?.addEventListener("input", () => {
        triggerSearch();
    });

    searchBtn?.addEventListener("click", () => {
        triggerSearch();
    });

    searchInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            triggerSearch();
        }
    });

    // Lọc theo giá
    if (priceBtn) {
        priceBtn.addEventListener("click", () => {
            const fromVal = priceFromInput?.value;
            const toVal = priceToInput?.value;

            state.minPrice = fromVal !== "" ? parseFloat(fromVal) : null;
            state.maxPrice = toVal !== "" ? parseFloat(toVal) : null;

            applyFilters();
        });
    }

    // View grid / list
    viewButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view || "grid";
            state.view = view;

            viewButtons.forEach((b) =>
                b.classList.toggle("is-active", b === btn)
            );

            if (view === "list") {
                listEl.classList.add("list-view");
            } else {
                listEl.classList.remove("list-view");
            }
        });
    });

    // ================== SIDEBAR CATEGORY TOGGLE ==================
    const sidebarToggleButtons = document.querySelectorAll(".sidebar-cat-toggle");

    sidebarToggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const li = btn.closest(".sidebar-cat-item");
            if (!li) return;

            const isOpen = li.classList.contains("is-open");

            // Đóng các item khác (accordion)
            document.querySelectorAll(".sidebar-cat-item.is-open").forEach((other) => {
                if (other !== li) other.classList.remove("is-open");
            });

            // Mở / đóng item hiện tại
            if (!isOpen) {
                li.classList.add("is-open");
            } else {
                li.classList.remove("is-open");
            }
        });
    });

    // ----- KHỞI TẠO -----
    applyFilters();
});
