import matplotlib.pyplot as plt
from keras.models import load_model
import pandas as pd
import numpy as np
import cv2

def convert28(pixels):
    # newpixels = pixels.split(',')
    data = np.array(pixels, dtype=float)
    data = data.reshape(280, 280)
    res_image28 = cv2.resize(data, (28, 28), interpolation=cv2.INTER_CUBIC)
    return res_image28

def pred_digit(px_arr):
    #loding and predicting the data
    model = load_model('ML_models\cnn_model_best.h5')
    prediction = model(px_arr.reshape(-1, 28, 28, 1))

    #transfering the data to html
    precent_predict = np.round(prediction*100).reshape(10)
    precent_predict = np.array(precent_predict, dtype='int32').tolist()
    pre_value = int(np.argmax(precent_predict))
    return pre_value, precent_predict