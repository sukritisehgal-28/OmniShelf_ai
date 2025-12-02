"""Mapping from Grozi-120 product codes to readable names and prices."""

# This is a mapping of Grozi-120 dataset product IDs to common grocery items
# The Grozi-120 dataset contains real packaged products from grocery stores
PRODUCT_NAME_MAP = {
    "grozi_6": "Barilla Spaghetti",
    "grozi_19": "Coca Cola",
    "grozi_29": "Nutella Hazelnut Spread",
    "grozi_31": "Pringles Original",
    "grozi_32": "Lay's Classic Chips",
    "grozi_33": "Doritos Nacho Cheese",
    "grozi_69": "Kellogg's Corn Flakes",
    "grozi_110": "Philadelphia Cream Cheese",
    "grozi_115": "Heinz Tomato Ketchup",
}

# Product pricing (in USD) - Based on typical US grocery retail prices
# Prices reflect average supermarket pricing as of 2025
PRODUCT_PRICES = {
    "grozi_6": 2.49,      # Barilla Spaghetti (16 oz)
    "grozi_19": 1.89,     # Coca Cola (2L bottle)
    "grozi_29": 5.99,     # Nutella Hazelnut Spread (13 oz)
    "grozi_31": 2.99,     # Pringles Original (5.5 oz)
    "grozi_32": 4.49,     # Lay's Classic Chips (10 oz family size)
    "grozi_33": 4.99,     # Doritos Nacho Cheese (10.5 oz)
    "grozi_69": 5.49,     # Kellogg's Corn Flakes (18 oz)
    "grozi_110": 4.99,    # Philadelphia Cream Cheese (8 oz)
    "grozi_115": 3.29,    # Heinz Tomato Ketchup (20 oz)
}

# Product categories
PRODUCT_CATEGORIES = {
    "grozi_6": "Pasta & Grains",
    "grozi_19": "Beverages",
    "grozi_29": "Spreads & Condiments",
    "grozi_31": "Snacks",
    "grozi_32": "Snacks",
    "grozi_33": "Snacks",
    "grozi_69": "Breakfast & Cereal",
    "grozi_110": "Dairy",
    "grozi_115": "Spreads & Condiments",
}

def get_display_name(grozi_code: str) -> str:
    """Get the display name for a grozi product code."""
    return PRODUCT_NAME_MAP.get(grozi_code, grozi_code)

def get_grozi_code(display_name: str) -> str:
    """Get the grozi code for a display name (reverse lookup)."""
    # Create reverse mapping
    reverse_map = {v.lower(): k for k, v in PRODUCT_NAME_MAP.items()}
    return reverse_map.get(display_name.lower(), display_name)

def get_price(grozi_code: str) -> float:
    """Get the price for a grozi product code."""
    return PRODUCT_PRICES.get(grozi_code, 0.0)

def get_category(grozi_code: str) -> str:
    """Get the category for a grozi product code."""
    return PRODUCT_CATEGORIES.get(grozi_code, "Other")
