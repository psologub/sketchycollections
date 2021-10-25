import numpy as np
import pandas as pd
from PIL import Image 
import base64
import os
import cv2
import clip
import torch
import requests
from io import BytesIO


#### LOAD STUFF

#load the model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load('ViT-B/32', device)

#make tags lists
df_cooper = pd.read_csv("/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/cooper-hewitt/cooper-hewitt_tags.csv")
cooper_tags = df_cooper['tags'].tolist()

df_met = pd.read_csv("/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/met/met_tags_full-collection.csv")
met_tags = df_met['value'].tolist()

df_science = pd.read_csv("/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/science-museum/science-museum_terms_all-categories.csv") 
science_tags = df_science['value'].tolist()

#load ID lookup lists (Science Museum version 2)
cooper_id = np.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/cooper-hewitt/cooper-hewitt_dataset-encoding-id-list.npy')
met_id = np.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/met/met_image-feature-id-list.npy')
science_id = np.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/science-museum/science-museum_feature-id-list_2.npy')

#load text features (all version 2)
cooper_text_features = torch.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/cooper-hewitt/cooper-hewitt_text-features_2.pt')
met_text_features = torch.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/met/met_text-features_2.pt')
science_text_features = torch.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/science-museum/science-museum_text-features_2.pt')

#load image tag features (all version 2)
cooper_tag_features = np.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/cooper-hewitt/cooper-hewitt_dataset-image-tag-embeddings_2.npy')
cooper_tag_features = torch.from_numpy(cooper_tag_features).to(device)

met_tag_features = np.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/met/met_image-tag-embeddings_2.npy')
met_tag_features = torch.from_numpy(met_tag_features).to(device)

science_tag_features = np.load('/Users/polosologub/Documents/GitHub/CCI/Thesis-WIP/data/science-museum/science-museum_image-tag-embeddings_2.npy')
science_tag_features = torch.from_numpy(science_tag_features).to(device)

#put it all into dict to loop through
museum_data = {"cooper": [cooper_text_features, cooper_tags, cooper_tag_features, cooper_id],
               "met": [met_text_features, met_tags, met_tag_features, met_id],
               "science": [science_text_features, science_tags, science_tag_features, science_id]}




### GET PREDICTIONS

def decode_base64(base64_img):
    starter = base64_img.find(',')
    image_data = base64_img[starter+1:]
    image_data = bytes(image_data, encoding="ascii")
    image = base64.b64decode(image_data)
    return image


#get tags for query image

def predict_query(image, museum_data=museum_data):
    image_input = preprocess(Image.open(BytesIO(image))).unsqueeze(0).to(device)
    
  # Calculate features
    with torch.no_grad():
        image_features = model.encode_image(image_input)
        
    image_features /= image_features.norm(dim=-1, keepdim=True)

    result = {"cooper": {}, "met": {}, "science": {}}
    
    for i in museum_data:
        #Pick the top 1 most similar labels for the image
        tags = museum_data[i][1]
        text_features = museum_data[i][0]
        text_features /= text_features.norm(dim=-1, keepdim=True)
        similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
        values, indices = similarity[0].topk(5)
    
        top_tags = []
        for value, index in zip(values, indices):
            top_tags.append(f"{tags[index]}: {100 * value.item():.2f}%")
        
        #https://stackoverflow.com/a/6181978
        result["{0}".format(i)]["feature"] = similarity
        result["{0}".format(i)]["tags"] = top_tags

    return result


    #get text embedding match between query image and art images and display with probabilities
#use top 3 objects instead
#use base64 for interface

def object_match(image, museum_data=museum_data, results_count=3):
    
    #Decode base64 image
    image_input = decode_base64(image)
    
    #Get tag features for query
    query_feature = predict_query(image_input)
    
    result = {"cooper": {}, "met": {}, "science": {}}

    for i in museum_data:        
        tags = museum_data[i][1]
        image_tags = museum_data[i][2]
        object_id = museum_data[i][3]
        
        #Compute the similarity between the search query and each photo 
        similarities = (image_tags @ query_feature[i]['feature'].T).squeeze(1)

        #Sort photos by similarity scores
        best_idx = (-similarities).argsort()[:results_count]
    
        #Get match IDs
        matches = [object_id[i] for i in best_idx]
         
        #Get top 5 tags 
        top_tags = [] 
        for j in range(len(best_idx)): 
            x = best_idx[j]
            values, indices = image_tags[x].topk(5)
        
            one_tag = []
            for value, index in zip(values, indices):
                one_tag.append(f"{tags[index]}: {100 * value.item():.2f}%")
        
            top_tags.append(one_tag)
            
        #Add to final dictionary
        #https://stackoverflow.com/a/6181978
        result["{0}".format(i)]["top_id"] = matches
        result["{0}".format(i)]["top_tags"] = top_tags
        result["{0}".format(i)]["query_tags"] = query_feature[i]['tags']
       
    return result


    ### Get images and citations from museum APIs

    #updates list with image urls and citations

def get_object_data(museum_data):
        result = museum_data

        for i in museum_data:
            if i == 'cooper':
                endpoint = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getInfo"
                api_key_cooper = "b28a37e593fba2764cf987b6f8918fac"

                cooper_images = []
                cooper_titles = []
                cooper_object_urls = []
                cooper_ids = museum_data['cooper']['top_id']

                for j in cooper_ids:

                    #remove characters in front, then replace "_" with "," at end to match cooper hewitt API (diff from SI)
                    params = {"access_token":api_key_cooper, "accession_number": j[6:].replace('_', ',')}

                    response = requests.get(endpoint, params = params)
                    data = response.json()['object']    

                    image_url = data['images'][0]['b']['url']
                    title = data['title']
                    object_url = data['url']
                    
                    cooper_images.append(image_url)
                    cooper_titles.append(title)
                    cooper_object_urls.append(object_url)



            if i == 'met':
                endpoint = "https://collectionapi.metmuseum.org/public/collection/v1/objects/"

                met_images = []
                met_titles = []
                met_object_urls = []
                met_ids = museum_data['met']['top_id']

                for j in met_ids: 
                    url = endpoint + str(j)

                    response = requests.get(url)
                    data = response.json()
                    
                    image_url = data['primaryImageSmall']
                    title = data['title']
                    object_url = data['objectURL']

                    met_images.append(image_url)
                    met_titles.append(title)
                    met_object_urls.append(object_url)



            if i == 'science':
                endpoint = "https://collection.sciencemuseumgroup.org.uk/objects/"

                science_images = []
                science_titles = []
                science_object_urls = []
                science_ids = museum_data['science']['top_id']

                for j in science_ids: 
                    url = endpoint + j

                    response = requests.get(url, headers = {"Accept":"application/json"})
                    data = response.json()['data']
                    
                    image_url = data['attributes']['multimedia'][0]['processed']['large']['location']
                    title = data['attributes']['title'][0]['value']
                    object_url = url

                    science_images.append(image_url)
                    science_titles.append(title)
                    science_object_urls.append(object_url)
                    
                   

        result['cooper']["top_url"] = cooper_images
        result['met']["top_url"] = met_images
        result['science']["top_url"] = science_images

        result['cooper']["title"] = cooper_titles
        result['met']["title"] = met_titles
        result['science']["title"] = science_titles

        result['cooper']["object_url"] = cooper_object_urls
        result['met']["object_url"] = met_object_urls
        result['science']["object_url"] = science_object_urls

        
        #get rid of IDs
        del result['cooper']['top_id']
        del result['met']['top_id']
        del result['science']['top_id']


        return result



### All in one

def get_matches(image, museum_data=museum_data, results_count=3):
    #json w ID, tags
    matches_v1 = object_match(image, museum_data, results_count)
    #json minus ID, + API data
    matches_v2 = get_object_data(matches_v1)
    return matches_v2