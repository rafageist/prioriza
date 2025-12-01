#!/usr/bin/env python3
"""Generic plot renderer for expression- and table-based configs."""
import argparse
import csv
import json
import math
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

import matplotlib.pyplot as plt
import numpy as np

try:
    import yaml  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    yaml = None

BASE_DIR = Path(__file__).resolve().parent
CONFIG_DIR = BASE_DIR / "configs"
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"


class ConfigError(Exception):
    """Raised when a plot config is missing required fields."""


def load_config(plot_id: str) -> Dict[str, Any]:
    """Load YAML or JSON config for the given plot id."""
    candidates = [CONFIG_DIR / f"{plot_id}.yaml", CONFIG_DIR / f"{plot_id}.yml", CONFIG_DIR / f"{plot_id}.json"]
    cfg_path = next((p for p in candidates if p.exists()), None)
    if cfg_path is None:
        raise ConfigError(f"No config found for plot_id '{plot_id}'. Expected one of: {', '.join(str(p) for p in candidates)}")

    if cfg_path.suffix in {".yaml", ".yml"}:
        if yaml is None:
            raise ConfigError("PyYAML is required to read YAML configs. Install with `pip install pyyaml`.")
        with cfg_path.open("r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    with cfg_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _safe_eval(expr: str, x_val: Any, y_val: Any) -> Any:
    """Safely evaluate z expression with restricted globals."""
    allowed_globals = {"__builtins__": {}, "math": math, "np": np, "int": int, "float": float}
    local_vars = {"x": x_val, "y": y_val, "m": x_val, "n": y_val}
    return eval(expr, allowed_globals, local_vars)


def evaluate_expression_grid(cfg: Dict[str, Any]) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    expr_cfg = cfg.get("expression")
    if not expr_cfg:
        raise ConfigError("Missing 'expression' section for expression mode.")
    expr = expr_cfg.get("z")
    if not expr:
        raise ConfigError("Missing expression 'z' formula.")

    def _axis_range(axis_cfg: Dict[str, Any]) -> np.ndarray:
        start = axis_cfg.get("start")
        end = axis_cfg.get("end")
        step = axis_cfg.get("step")
        if None in (start, end, step):
            raise ConfigError("Each axis must define start, end, and step.")
        return np.arange(float(start), float(end) + 0.5 * abs(float(step)), float(step))

    x_vals = _axis_range(expr_cfg.get("x", {}))
    y_vals = _axis_range(expr_cfg.get("y", {}))
    xx, yy = np.meshgrid(x_vals, y_vals)

    try:
        if xx.ndim == 2:
            vectorized = np.vectorize(lambda xv, yv: _safe_eval(expr, float(xv), float(yv)))
            zz = vectorized(xx, yy)
        else:
            zz = _safe_eval(expr, xx, yy)
    except Exception as exc:  # pragma: no cover - runtime safety
        raise ConfigError(f"Failed to evaluate expression '{expr}': {exc}") from exc

    return xx, yy, np.array(zz, dtype=float)


def read_table(cfg: Dict[str, Any]) -> tuple[List[float], List[float]]:
    data_cfg = cfg.get("data")
    if not data_cfg:
        raise ConfigError("Missing 'data' section for table mode.")
    file_rel = data_cfg.get("file")
    x_key = data_cfg.get("x")
    y_key = data_cfg.get("y")
    if not (file_rel and x_key and y_key):
        raise ConfigError("Table mode requires 'file', 'x', and 'y'.")

    file_path = DATA_DIR / file_rel
    if not file_path.exists():
        raise ConfigError(f"Data file not found: {file_path}")

    xs: List[float] = []
    ys: List[float] = []
    with file_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None or x_key not in reader.fieldnames or y_key not in reader.fieldnames:
            raise ConfigError(f"CSV must include columns '{x_key}' and '{y_key}'.")
        for row in reader:
            xs.append(float(row[x_key]))
            ys.append(float(row[y_key]))
    return xs, ys


def _save_outputs(fig: Any, output_cfg: Dict[str, Any], output_dir: Path) -> List[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    basename = output_cfg.get("basename")
    formats: Iterable[str] = output_cfg.get("formats", ["png"])
    if not basename:
        raise ConfigError("Output basename is required.")
    saved_paths: List[Path] = []
    for fmt in formats:
        out_path = output_dir / f"{basename}.{fmt}"
        fig.savefig(out_path, dpi=output_cfg.get("dpi", 200))
        print(f"Saved: {out_path}")
        saved_paths.append(out_path)
    plt.close(fig)
    return saved_paths


def plot_surface_from_expression(cfg: Dict[str, Any], output_dir: Path) -> List[Path]:
    axes_cfg = cfg.get("axes", {})
    fig_width = cfg.get("fig_width", 8)
    fig_height = cfg.get("fig_height", 6)
    fig = plt.figure(figsize=(fig_width, fig_height))
    ax = fig.add_subplot(111, projection="3d")

    xx, yy, zz = evaluate_expression_grid(cfg)
    surf = ax.plot_surface(xx, yy, zz, cmap="viridis", edgecolor="none", alpha=0.9)
    ax.set_xlabel(axes_cfg.get("x", {}).get("label", "x"))
    ax.set_ylabel(axes_cfg.get("y", {}).get("label", "y"))
    ax.set_zlabel(axes_cfg.get("z", {}).get("label", "z"))
    ax.set_title(cfg.get("title", ""))
    if cfg.get("z_logscale"):
        ax.set_zscale("log")
    fig.colorbar(surf, ax=ax, shrink=0.6, aspect=12)
    return _save_outputs(fig, cfg.get("output", {}), output_dir)


def plot_line_from_table(cfg: Dict[str, Any], output_dir: Path) -> List[Path]:
    axes_cfg = cfg.get("axes", {})
    fig_width = cfg.get("fig_width", 6)
    fig_height = cfg.get("fig_height", 4)
    fig, ax = plt.subplots(figsize=(fig_width, fig_height))

    xs, ys = read_table(cfg)
    ax.plot(xs, ys, marker="o", linestyle="-", linewidth=2)
    ax.set_xlabel(axes_cfg.get("x", {}).get("label", "x"))
    ax.set_ylabel(axes_cfg.get("y", {}).get("label", "y"))
    ax.set_title(cfg.get("title", ""))
    if cfg.get("y_logscale"):
        ax.set_yscale("log")
    ax.grid(True, linestyle="--", alpha=0.5)
    return _save_outputs(fig, cfg.get("output", {}), output_dir)


def dispatch_plot(cfg: Dict[str, Any], output_dir: Path) -> List[Path]:
    mode = cfg.get("mode")
    plot_type = cfg.get("type")
    if mode == "expression" and plot_type == "surface3d":
        return plot_surface_from_expression(cfg, output_dir)
    if mode == "table" and plot_type == "line2d":
        return plot_line_from_table(cfg, output_dir)
    raise ConfigError(f"Unsupported mode/type combination: mode={mode}, type={plot_type}")


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Render plots from configs.")
    parser.add_argument("plot_id", help="Base name of the plot config (without extension).")
    parser.add_argument(
        "--output-dir",
        default=str(OUTPUT_DIR),
        help="Directory to write rendered images (default: scripts/plots/outputs).",
    )
    args = parser.parse_args(argv)

    try:
        cfg = load_config(args.plot_id)
        output_dir = Path(args.output_dir).expanduser()
        output_dir.mkdir(parents=True, exist_ok=True)
        dispatch_plot(cfg, output_dir)
    except ConfigError as exc:
        print(f"Config error: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:  # pragma: no cover - safety net
        print(f"Unexpected error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
