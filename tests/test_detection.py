from __future__ import annotations

import numpy as np

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from yolo.utils import yolo_result_to_detections


class DummyArray:
    def __init__(self, data):
        self._data = np.array(data)

    def cpu(self):
        return self

    def numpy(self):
        return self._data


class DummyBoxes:
    def __init__(self):
        self.conf = DummyArray([0.95, 0.85])
        self.xyxy = DummyArray([[1, 2, 3, 4], [0, 1, 2, 3]])
        self.cls = DummyArray([0, 1])


class DummyResult:
    def __init__(self):
        self.boxes = DummyBoxes()
        self.names = {0: "Milk", 1: "Bread"}


def test_yolo_result_to_detections_parses_results():
    result = DummyResult()
    detections = yolo_result_to_detections(result)
    assert len(detections) == 2
    assert detections[0]["product_name"] == "Milk"
    assert detections[0]["confidence"] == 0.95
    assert detections[0]["bbox"] == [1.0, 2.0, 3.0, 4.0]
    assert detections[1]["product_name"] == "Bread"
