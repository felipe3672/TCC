#pip install tensorflow fastapi uvicorn python-multipart pillow tensorflow-serving-api matplotlib nump

from fastapi import FastAPI, File, UploadFile
import uvicorn 
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf 


app = FastAPI()

#with tf.device('/cpu:0'):
 #      MODELO = tf.saved_model.load(f"C:/Codigo_TCC/Models/1")

#MODELO = tf.keras.models.load_model("C:/Codigo_TCC/Models/2")     
MODELO = tf.keras.models.load_model("C:/Codigo_TCC/Models/modelo_treinado_97.h5") 
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

#usando do do modelo salvo para poder prever o resultado
    previsao =  MODELO.predict(img_batch)

#usando do retorno dentro do array para saber o nome da doença   
    classe_prevista = CLASSES[np.argmax(previsao [0])]

#para printar a assertividade da previsãod a doença
    assertividade = np.max(previsao [0])

    return{
          'classe': classe_prevista,
          'assertividade': float(assertividade)
    }

if __name__ == "__main__":
        uvicorn.run(app,host = 'localhost', port = 8000)

 