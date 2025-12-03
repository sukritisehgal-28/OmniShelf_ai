#!/usr/bin/env python3
"""Real-time training monitor for OmniShelf AI."""
import time
from pathlib import Path
import pandas as pd

RESULTS_CSV = Path("yolo/runs/detect/train14/results.csv")

def format_metrics(row):
    """Format metrics for display."""
    return (
        f"Epoch {int(row['epoch']):2d} | "
        f"Time: {row['time']:.0f}s | "
        f"mAP50: {row['metrics/mAP50(B)']:.4f} | "
        f"mAP50-95: {row['metrics/mAP50-95(B)']:.4f} | "
        f"Precision: {row['metrics/precision(B)']:.4f} | "
        f"Recall: {row['metrics/recall(B)']:.4f} | "
        f"BoxLoss: {row['train/box_loss']:.3f} | "
        f"ClsLoss: {row['train/cls_loss']:.3f}"
    )

def monitor():
    """Monitor training progress."""
    last_epoch = 0

    print("🚀 OmniShelf AI - Training Monitor")
    print("=" * 100)
    print(f"Monitoring: {RESULTS_CSV}")
    print("=" * 100)

    while True:
        try:
            if not RESULTS_CSV.exists():
                print("⏳ Waiting for training to start...")
                time.sleep(10)
                continue

            df = pd.read_csv(RESULTS_CSV)

            if len(df) > last_epoch:
                # New epochs completed
                for idx in range(last_epoch, len(df)):
                    row = df.iloc[idx]
                    print(format_metrics(row))

                last_epoch = len(df)

                # Print progress summary every 5 epochs
                if last_epoch % 5 == 0:
                    latest = df.iloc[-1]
                    print("\n" + "─" * 100)
                    print(f"📊 Progress: {last_epoch}/50 epochs ({last_epoch/50*100:.1f}%)")
                    print(f"   Best mAP50 so far: {df['metrics/mAP50(B)'].max():.4f} (epoch {df['metrics/mAP50(B)'].idxmax() + 1})")
                    print(f"   Best mAP50-95: {df['metrics/mAP50-95(B)'].max():.4f} (epoch {df['metrics/mAP50-95(B)'].idxmax() + 1})")
                    print(f"   Current Precision: {latest['metrics/precision(B)']:.4f}")
                    print(f"   Current Recall: {latest['metrics/recall(B)']:.4f}")
                    print(f"   Estimated time remaining: {(50 - last_epoch) * latest['time'] / 60:.1f} minutes")
                    print("─" * 100 + "\n")

            # Check if training is complete
            if last_epoch >= 50:
                print("\n" + "=" * 100)
                print("✅ TRAINING COMPLETE!")
                print("=" * 100)
                final = df.iloc[-1]
                print(f"\n📈 Final Results:")
                print(f"   Final mAP@50: {final['metrics/mAP50(B)']:.4f}")
                print(f"   Final mAP@50-95: {final['metrics/mAP50-95(B)']:.4f}")
                print(f"   Final Precision: {final['metrics/precision(B)']:.4f}")
                print(f"   Final Recall: {final['metrics/recall(B)']:.4f}")
                print(f"\n   Best mAP@50: {df['metrics/mAP50(B)'].max():.4f} (epoch {df['metrics/mAP50(B)'].idxmax() + 1})")
                print(f"   Total training time: {df['time'].sum() / 3600:.2f} hours")
                print(f"\n💾 Model saved to: yolo/runs/detect/train14/weights/best.pt")
                break

            time.sleep(30)  # Check every 30 seconds

        except KeyboardInterrupt:
            print("\n\n⚠️  Monitoring stopped by user")
            print(f"Training is still running (check terminal or run: ps aux | grep train_yolo)")
            break
        except Exception as e:
            print(f"⚠️  Error reading results: {e}")
            time.sleep(10)

if __name__ == "__main__":
    monitor()
