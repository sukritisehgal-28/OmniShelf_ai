# OmniShelf AI

**OmniShelf AI** is an end-to-end retail shelf intelligence platform powered by a custom-trained **YOLOv11** model. It automates inventory tracking, detects out-of-stock items in real-time, and provides a smart shopping assistant for customers.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Model Performance](https://img.shields.io/badge/mAP%4050-95.5%25-blue)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20PostgreSQL%20%7C%20YOLOv11-orange)

---

## 🚀 Key Features

### 🧠 Computer Vision Core
- **Model:** YOLOv11s fine-tuned on the **Grozi-120** dataset (120 grocery product classes).
- **Performance:** Achieved **95.51% mAP@50** and **84.89% Precision** on the validation set.
- **Robustness:** Tested with Test Time Augmentation (TTA) and geometric stress tests to ensure reliability on real-world shelf images.

### 🛡️ Admin Dashboard
- **Real-Time Detection:** Upload shelf images (CSV) to run inference and get instant stock counts.
- **Inventory Management:** Track stock levels, value, and shelf placement.
- **Analytics:** Visualize category breakdowns and low-stock trends.
- **Alerts:** Automated "Low Stock" and "Out of Stock" notifications.

### 🛒 User Smart Cart
- **Shopping Assistant:** Customers can view store inventory and check product availability.
- **Smart Search:** Find products by name or category.

---

## 🏗️ Architecture

The system follows a modern 3-tier architecture:

1.  **AI Layer (YOLOv11)**
    *   Training: PyTorch + Ultralytics on Google Colab T4 GPU.
    *   Inference: Python-based inference engine (`yolo/utils.py`).
    *   Data: Grozi-120 (Training) + Supermarket Shelves (Evaluation).

2.  **Backend (FastAPI)**
    *   REST API running on port **8002**.
    *   Handles detection logic, database CRUD operations, and business logic.
    *   **Database:** PostgreSQL (Dockerized) running on port **5436**.

3.  **Frontend (React + TypeScript)**
    *   Modern SPA built with **Vite**.
    *   **Admin Portal:** Secure dashboard for store managers.
    *   **User Portal:** Public-facing kiosk interface.
    *   Styled with Tailwind CSS and Radix UI.

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker Desktop (for PostgreSQL)

### 1. Clone & Setup Environment
```bash
git clone https://github.com/yourusername/omnishelf-ai.git
cd omnishelf_ai

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Start Database
```bash
docker compose up -d
# Verifies PostgreSQL is running on port 5436
```

### 3. Start Backend
```bash
# Ensure venv is active
uvicorn backend.main:app --host 0.0.0.0 --port 8002 --reload
```

### 4. Start Frontend
```bash
cd frontend_react
npm install
npm run dev
# Opens application at http://localhost:3002 (or similar)
```

---

## 📊 Model Training & Results

The model was trained using a rigorous iterative process documented in [EXPERIMENTS.md](EXPERIMENTS.md).

| Metric | Value | Description |
| :--- | :--- | :--- |
| **mAP@50** | **95.51%** | High accuracy on standard validation set |
| **mAP@50-95** | **81.98%** | Excellent localization precision |
| **Precision** | **84.89%** | Low false positive rate |
| **Recall** | **88.52%** | Misses very few products |

**Training Hardware:** Google Colab Tesla T4 (16GB VRAM)
**Training Time:** ~10 hours (50 epochs)

---

## 📂 Project Structure

```
omnishelf_ai/
├── backend/             # FastAPI application
├── frontend_react/      # React Admin & User dashboards
├── yolo/                # Computer Vision module
│   ├── dataset/         # Grozi-120 & Real Shelves data
│   ├── runs/            # Training weights & logs
│   ├── train_yolo.py    # Training script
│   └── utils.py         # Inference logic
├── sql/                 # Database initialization
├── EXPERIMENTS.md       # Training log
└── README.md            # This file
```

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
