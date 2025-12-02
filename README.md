# OmniShelf AI

OmniShelf AI is an end-to-end retail shelf intelligence platform that combines YOLOv11 computer vision, a FastAPI backend with PostgreSQL persistence, and a Streamlit dashboard to deliver actionable shelf stock insights and a smart shopping assistant.

## Key Capabilities
- Train YOLOv11 on the Grozi-120 dataset to recognize packaged grocery products.
- Evaluate generalization on real-world supermarket shelf imagery from the Supermarket Shelves (Humans in the Loop) dataset.
- Persist detections, counts, and planogram expectations to PostgreSQL.
- Expose REST APIs for stock lookups, shelf summaries, and shopping list recommendations.
- Provide a Streamlit-based Store Dashboard and SmartCart Assistant for managers and customers.

## Architecture Overview
1. **YOLOv11 Training:** `python yolo/train_yolo.py` uses Ultralytics to fine-tune pretrained weights on Grozi-120 (images + YOLO labels).
2. **Real Shelf Evaluation:** `python yolo/evaluate_real_shelves.py` loads the trained model and runs inference on real shelf images to produce qualitative statistics (baseline + stress-test augmentations).
3. **Backend:** FastAPI app backed by PostgreSQL (SQLAlchemy ORM) exposes detection ingestion, stock queries, shelf summaries, and shopping list intelligence.
4. **Frontend:** Streamlit UI (`frontend/`) calls the FastAPI APIs to display analytics and assist customers. The previous React app is preserved in `frontend_react/` for reference.

## Setup Instructions
1. **Create Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **Configure PostgreSQL (default database)**
   - Create a `.env` file in the project root with:
     ```
     DATABASE_URL=postgresql://sukritisehgal@localhost:5434/omnishelf
     ```
   - Ensure PostgreSQL is running locally and the `omnishelf` database exists (`createdb omnishelf` or run `python init_postgres.py`).

3. **Prepare Datasets**
   - **Grozi-120:** Download the official Grozi-120 “in vitro” archive (120 folders). Place the extracted directories under `yolo/dataset/grozi120/inVitro/` (already created here), then run:
     ```bash
     python yolo/prepare_grozi_dataset.py --overwrite
     ```
     This script scans each class folder, copies normalized images into `yolo/dataset/grozi120/images`, generates YOLO bounding boxes from the provided masks, and regenerates `data.yaml` with 120 class names.
   - **Sanity check + deterministic split:** validate labels, then create a fixed train/val split (default 85/15, seed 42):
     ```bash
     python yolo/check_grozi_dataset.py
     python yolo/create_train_val_split.py --val-ratio 0.15 --seed 42
     ```
     This writes `splits/train.txt` and `splits/val.txt`, updates `data.yaml` to use `images/train` and `images/val`, and records the split seed.
   - **Real Shelf Dataset:** The evaluation script now auto-downloads the Supermarket Shelves dataset using `kagglehub` when no images exist in `yolo/dataset/real_shelves/images`. You can also download manually via:
     ```bash
     python - <<'PY'
     import kagglehub
     path = kagglehub.dataset_download("humansintheloop/supermarket-shelves-dataset")
     print("Path to dataset files:", path)
     PY
     ```
     Copy any desired evaluation photos into `yolo/dataset/real_shelves/images`.
   - **Stress-test augmentations (no new dataset):** expand the real shelf set with lighting/blur/occlusion/perspective variants:
     ```bash
     python yolo/augment_real_shelves.py --variants-per-image 3
     ```
     Outputs to `yolo/dataset/real_shelves/stress_test/` with a manifest for reproducibility.

4. **Train YOLOv11**
   ```bash
   python yolo/train_yolo.py
   ```
   Training uses pretrained `yolo11s.pt` weights, the deterministic split from `data.yaml`, Adam optimizer, and the `OMNISHELF_YOLO_SEED` environment variable (default 42) for reproducibility. Adjust `OMNISHELF_YOLO_EPOCHS`, `OMNISHELF_YOLO_IMGSZ`, and `OMNISHELF_YOLO_BATCH` as needed.

5. **Evaluate on Real Shelves**
   ```bash
   python yolo/evaluate_real_shelves.py --include-stress-test
   ```
   Generates `yolo/real_shelf_evaluation.csv` summarizing detection counts per image and class along with average confidences. Use `--include-stress-test` to report both the clean baseline photos and the augmented stress-test set.

6. **Initialize Database**
   - Launch PostgreSQL locally and run the schema:
     ```bash
     psql $DATABASE_URL -f sql/init.sql
     ```

7. **Run Backend API**
   ```bash
   uvicorn backend.main:app --reload
   ```
   Exposes endpoints for detections ingestion, stock queries, shelf summaries, shopping list recommendations, and a health check.

8. **Run Streamlit Frontend**
   ```bash
   export API_BASE_URL=http://localhost:8001  # or your backend URL
   streamlit run frontend/app.py
   ```
   Use the sidebar to switch between the Store Dashboard and SmartCart Assistant views.
   - React UI is preserved under `frontend_react/` (run with `npm install && npm run dev`), and its container build lives in `Dockerfile.frontend-react`.

## Docker (full stack)
Run everything with Docker Compose (PostgreSQL + FastAPI + Streamlit):
```bash
docker-compose up --build
```
- Backend: http://localhost:8002 (container talks to Postgres at `db:5432`)
- Streamlit Frontend: http://localhost:8501 (uses `API_BASE_URL`; defaults to `http://backend:8002` in Compose)
- Database: Postgres exposed on localhost:5436 (data persisted in the `pgdata` volume)

## Metrics & Analytics
- **Training Metrics:** YOLO training logs include mAP, precision, recall, and loss curves.
- **Real Shelf Evaluation:** Provides per-image detection counts and per-class aggregates to gauge generalization.
- **Stock Accuracy:** Backend aggregates detection counts per shelf and per product to support merchandising decisions.

## Testing
FastAPI and detection utility tests are available via `pytest`:
```bash
pytest
```
