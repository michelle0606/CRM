
import pandas as pd
import sys
import time
import hashlib
import scipy.sparse as sparse
from scipy.sparse.linalg import spsolve
from sklearn.preprocessing import MinMaxScaler

print('execution begins')
df = pd.read_csv('./rec_test.csv')
print(df)

# time.sleep(5)

# print('python print ', sys.argv[1])
# print('python print ', sys.argv[2])
print(hashlib.sha1(('phoneNum').encode('utf-8')).hexdigest())