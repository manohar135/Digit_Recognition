from django.shortcuts import render
from django.shortcuts import render, HttpResponse
from fetch.digrec import convert28, pred_digit
from joblib import load
from django.http import JsonResponse
import json

def digit(request):
    if request.method == "POST":
        data = json.loads(request.body)
        pixelSet = data["pixelSet"]
        pixels28 = convert28(pixelSet)

        #fetching the predicted value and the array 
        predict_value, precent_predict_arr = pred_digit(pixels28)
        return HttpResponse(json.dumps({'value': predict_value, 'pred_array':precent_predict_arr}), content_type="application/json")

    return render(request, 'digit_rec.html')
