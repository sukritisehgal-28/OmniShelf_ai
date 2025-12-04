"""Test YOLO on real shelf image 021.jpg that contains Grozi-120 products."""
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from yolo.utils import load_model, run_inference, yolo_result_to_detections

model = load_model('yolo/runs/detect/train_colab/weights/best.pt')

img = Path('yolo/dataset/real_shelves/images/021.jpg')

print('=' * 70)
print(f'Testing YOLO on {img.name} (contains Grozi-120 products)')
print('AI Vision found: Chex Mix, Cheerios, Honey Nut Cheerios')
print('=' * 70)

# Test with different confidence thresholds
for conf in [0.5, 0.3, 0.2, 0.1]:
    result = run_inference(img, model, conf=conf, iou=0.3)
    dets = yolo_result_to_detections(result)
    print(f'\nConfidence >= {conf*100:.0f}%: {len(dets)} detections')
    for d in sorted(dets, key=lambda x: -x['confidence'])[:10]:
        print(f'  - {d["product_name"]} ({d["confidence"]*100:.1f}%)')
