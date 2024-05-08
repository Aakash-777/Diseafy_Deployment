import numpy as np
import pandas as pd
import json
from flask import Flask, render_template, request ,jsonify

import os

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'

from tensorflow import keras
from keras.layers import Dense
from keras.models import Sequential, load_model

app = Flask(__name__)

lm = load_model(r'epics_model_vsc.h5')

with open(r'disease_data.json', 'r') as file:
    disease_data = json.load(file)


@app.route('/')
def helloworld():
    d="Select your symptoms and predict your illness"
    return render_template('index.html',you="",result="",details=d)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    pred = data.get('pred')
    # print(pred)

    dis=['(vertigo) Paroymsal  Positional Vertigo', 'AIDS', 'Acne',
       'Alcoholic hepatitis', 'Allergy', 'Arthritis', 'Bronchial Asthma',
       'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis',
       'Common Cold', 'Dengue', 'Diabetes ', 'Dimorphic hemmorhoids (piles)',
       'Drug Reaction', 'Fungal infection', 'GERD', 'Gastroenteritis',
       'Heart attack', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D',
       'Hepatitis E', 'Hypertension ', 'Hyperthyroidism', 'Hypoglycemia',
       'Hypothyroidism', 'Impetigo', 'Jaundice', 'Malaria', 'Migraine',
       'Osteoarthristis', 'Paralysis (brain hemorrhage)',
       'Peptic ulcer disease', 'Pneumonia', 'Psoriasis', 'Tuberculosis',
       'Typhoid', 'Urinary tract infection', 'Varicose veins', 'hepatitis A']
    
    output = lm.predict(np.array([pred]))
    # print(output)
    my_dict = dict(zip(dis, output[0]))
    for key in my_dict:
        my_dict[key] = float(format(my_dict[key]* 100, '.2f'))
    sorted_dict = sorted(my_dict.items(), key=lambda x: x[1], reverse=True)
    top_5_dict = dict(sorted_dict[:5])
    print(top_5_dict)

    def get_disease_details(dis):
        # print(dis)
        for i in disease_data['diseases']:
            if i['disease_name'].replace(" ", "").lower() == dis.replace(" ", "").lower():
                # print(i['disease_name'].replace(" ", "").lower())
                # print(dis.replace(" ", "").lower())
                return i['details']
        return "Info not available"

    all_5 = []
    for i in top_5_dict:
        all_5.append({'disease': i,
                      'percentage': top_5_dict[i],
                      'details': get_disease_details(i)})

    return jsonify(all_5)

if __name__ == '__main__':
    app.run()
