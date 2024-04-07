#!/bin/bash
#SBATCH -o job.%j.out
#SBATCH --partition=GTX3090
#SBATCH --qos=low
#SBATCH -J intervate_gpu07
#SBATCH --nodes=1             
#SBATCH --ntasks-per-node=8
#SBATCH --gres=gpu:1
#SBATCH -w GPU07          


python tools/train3.py --data data/duo.yaml --conf-file 'configs/gold_rgb_layer5_resdul.py' --batch 16 --epoch 400 --name GOLD_YOLO_rgb_layer5_resdul --workers 8

python tools/eval.py --data data/duo.yaml --batch 32 --weights runs/train/GOLD_YOLO_rgb_layer5_resdul/weights/best_ckpt.pt --task val --reproduce_640_eval --verbose
