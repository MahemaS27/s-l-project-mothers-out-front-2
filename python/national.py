import pandas as pd
import numpy as np
AL = pd.read_csv('AL_quarters.csv')
CA = pd.read_csv('CA_quarters.csv')
CO = pd.read_csv('CO_quarters.csv')
MA = pd.read_csv('MA_quarters.csv')
MI = pd.read_csv('MI_quarters.csv')
NH = pd.read_csv('NH_quarters.csv')
NY = pd.read_csv('NY_quarters.csv')
OH = pd.read_csv('OH_quarters.csv')
PA = pd.read_csv('PA_quarters.csv')
VA = pd.read_csv('VA_quarters.csv')
WA = pd.read_csv('WA_quarters.csv')

national = pd.concat([AL, CA, CO, MA, MI, NH, NY, OH, PA, VA, WA])
national = national.groupby('dates').sum()
national = national[70:]
national = national.astype(int)
national.to_csv('USA_quarters.csv')