#pip install tensorflow fastapi uvicorn python-multipart pillow tensorflow-serving-api matplotlib nump

#docker run -t --rm -p 8501:8501 -v C:/Codigo_TCC:/Codigo_TCC tensorflow/serving --rest_api_port=8501 --model_config_file=/Codigo_TCC/Treino/model.config

#npm rm -g create-react-app

#npm install -g create-react-app

#npx create-react-app frontend

from fastapi import FastAPI, File, UploadFile
import uvicorn 
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf 
import requests

app = FastAPI()

#with tf.device('/cpu:0'):
 #      MODELO = tf.saved_model.load(f"C:/Codigo_TCC/Models/1")
#MODELO = tf.keras.models.load_model("C:/Codigo_TCC/Models/2")     
# MODELO = tf.keras.models.load_model("C:/Codigo_TCC/Models/modelo_treinado_97.h5") 



endpoint ="http://localhost:8501/v1/models/modelo_doencas/versions/2:predict"

CLASSES = ["Pepper__bell___Bacterial_spot",
"Pepper__bell___healthy",
"Potato___Early_blight",
"Potato___Late_blight",
"Potato___healthy",
"Tomato_Bacterial_spot",
"Tomato_Early_blight",
"Tomato_Late_blight",
"Tomato_Leaf_Mold",
"Tomato_Septoria_leaf_spot",
"Tomato_Spider_mites_Two_spotted_spider_mite",
"Tomato__Target_Spot",
"Tomato__Tomato_YellowLeaf__Curl_Virus",
"Tomato__Tomato_mosaic_virus",
"Tomato_healthy"]

@app.get("/ping")
async def ping(): 
        return "Hellow ta funcionando"

#transformando imagem em um array numpy
def ler_arquivo_img(dados) -> np.ndarray:
   
#primeiro trasformando os dados em uma PIL imagem e depois passando para um numpy array
   img =  np.array(Image.open(BytesIO(dados)))
   return img

#como vai ser enviado informação para poder retornar algo, metodo POST é melhor
@app.post("/predict")
async def predict(
        arquivo: UploadFile = File(...)
):
    
# para que o modelo possa ler precisa ser em um numpy array, então vamos ler a imagem
# await serve para para funcionar junto com async para poder processar simultaneamente e esperar o uso do metodo a cada chamda
    imagem =  ler_arquivo_img(await arquivo.read())

#transformando a imagem em batch para poder ser processada, com ela vai em um array [[255,255,3]], precisa "expandir para o programa entender"
    img_batch = np.expand_dims(imagem, 0)

    json_d = {
          "instances": img_batch.tolist()
    }
    resposta =requests.post(endpoint, json=json_d)
    
    previsao =  np.array(resposta.json()["predictions"][0])

    classe_prevista = CLASSES[np.argmax(previsao)]
    assertividade = np.max(previsao)
    return{
          'classe': classe_prevista,
          'assertividade': float(assertividade)
    }

if __name__ == "__main__":
        uvicorn.run(app,host = 'localhost', port = 8000)

 