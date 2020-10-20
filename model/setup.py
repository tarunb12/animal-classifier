# %% Import libraries
import os
import splitfolders
import tarfile

# %% Untar animals10 dataset
dataset_path = 'datasets/'
animals10_path = f'{dataset_path}animals10'
if not os.path.isdir(animals10_path):
    with tarfile.open(f'{animals10_path}.tgz') as tar:
        tar.extractall(dataset_path)
sum((len(f) for _, _, f in os.walk(animals10_path)))

# %%
splitfolders.ratio(animals10_path, output='data/animals10', seed=1337, ratio=(0.7, 0.15, 0.15))