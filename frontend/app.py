"""Streamlit dashboard for OmniShelf AI."""
from __future__ import annotations

import os
from typing import Dict, List, Tuple

import pandas as pd
import requests
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

DEFAULT_API_BASE = (
    os.getenv("API_BASE_URL")
    or os.getenv("BACKEND_URL")
    or "http://localhost:8001"
)


def get_api_base() -> str:
    return st.session_state.get("api_base", DEFAULT_API_BASE).rstrip("/")


def set_api_base(value: str) -> None:
    st.session_state["api_base"] = value.rstrip("/")


@st.cache_data(ttl=30)
def fetch_json(url: str):
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()


@st.cache_data(ttl=30)
def fetch_stock(api_base: str) -> List[Dict[str, object]]:
    return fetch_json(f"{api_base}/stock")


@st.cache_data(ttl=30)
def fetch_alerts(api_base: str) -> List[Dict[str, object]]:
    return fetch_json(f"{api_base}/alerts")


@st.cache_data(ttl=30)
def fetch_stock_history(api_base: str, days: int = 7) -> Dict[str, Dict[str, int]]:
    payload = fetch_json(f"{api_base}/analytics/stock-history?days={days}")
    return payload.get("history", {})


def post_shopping_list(api_base: str, items: List[str]) -> Dict[str, object]:
    resp = requests.post(f"{api_base}/shopping-list", json={"items": items}, timeout=10)
    resp.raise_for_status()
    return resp.json()


def sidebar_controls() -> None:
    st.sidebar.header("Configuration")
    api_base = st.sidebar.text_input("API base URL", value=get_api_base(), help="FastAPI base URL")
    set_api_base(api_base)
    st.sidebar.caption("Defaults to http://localhost:8001 if not set.")


def render_stock_dashboard(api_base: str) -> None:
    st.subheader("Shelf Stock Health")
    try:
        stock = fetch_stock(api_base)
    except Exception as exc:  # noqa: BLE001
        st.error(f"Failed to load stock summary: {exc}")
        return

    if not stock:
        st.info("No stock data available.")
        return

    df = pd.DataFrame(stock)
    stock_level_order = {"HIGH": 3, "MEDIUM": 2, "LOW": 1, "OUT": 0}
    df["stock_level_score"] = df["stock_level"].map(stock_level_order).fillna(0)
    df = df.sort_values(by=["stock_level_score", "total_count"], ascending=[False, False])

    level_counts = df["stock_level"].value_counts().to_dict()
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("HIGH", level_counts.get("HIGH", 0))
    c2.metric("MEDIUM", level_counts.get("MEDIUM", 0))
    c3.metric("LOW", level_counts.get("LOW", 0))
    c4.metric("OUT", level_counts.get("OUT", 0))

    display_cols = [
        "product_name",
        "display_name",
        "category",
        "total_count",
        "stock_level",
        "shelf_id",
        "last_seen",
        "price",
    ]
    st.dataframe(df[display_cols], hide_index=True, use_container_width=True)

    st.markdown("### Stock History (last 7 days)")
    try:
        history = fetch_stock_history(api_base)
    except Exception as exc:  # noqa: BLE001
        st.error(f"Failed to load stock history: {exc}")
        return
    if not history:
        st.info("No history available.")
        return
    history_rows = []
    for product, series in history.items():
        for date_str, count in series.items():
            history_rows.append({"product_name": product, "date": date_str, "count": count})
    hist_df = pd.DataFrame(history_rows)
    pivot = hist_df.pivot(index="date", columns="product_name", values="count").fillna(0)
    st.line_chart(pivot)


def render_alerts(api_base: str) -> None:
    st.subheader("Alerts")
    try:
        alerts = fetch_alerts(api_base)
    except Exception as exc:  # noqa: BLE001
        st.error(f"Failed to load alerts: {exc}")
        return
    if not alerts:
        st.info("No alerts.")
        return
    df = pd.DataFrame(alerts)
    st.dataframe(df, hide_index=True, use_container_width=True)


def parse_items(raw: str) -> List[str]:
    tokens = []
    for line in raw.splitlines():
        for part in line.split(","):
            item = part.strip()
            if item:
                tokens.append(item)
    return tokens


def render_smartcart(api_base: str) -> None:
    st.subheader("SmartCart Assistant")
    raw_items = st.text_area(
        "Shopping list (comma or newline separated)", value="cornflakes, pasta, coke"
    )
    if st.button("Check Availability"):
        items = parse_items(raw_items)
        if not items:
            st.warning("Add at least one item.")
            return
        try:
            response = post_shopping_list(api_base, items)
        except Exception as exc:  # noqa: BLE001
            st.error(f"Failed to fetch shopping list: {exc}")
            return
        df = pd.DataFrame(response.get("items", []))
        if df.empty:
            st.info("No results.")
            return
        st.dataframe(df, hide_index=True, use_container_width=True)


def main() -> None:
    st.set_page_config(page_title="OmniShelf AI", layout="wide")
    st.title("OmniShelf AI - Streamlit Frontend")
    sidebar_controls()

    api_base = get_api_base()
    tabs = st.tabs(["Store Dashboard", "SmartCart"])
    with tabs[0]:
        render_stock_dashboard(api_base)
        render_alerts(api_base)
    with tabs[1]:
        render_smartcart(api_base)


if __name__ == "__main__":
    main()
