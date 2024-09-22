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

#### SETUP

#Load the model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load('ViT-B/32', device)

#Load tags lists (SMG collection v2, Met tags list v2)
df_cooper = pd.read_csv("data/final/cooper/cooper-hewitt_tags.csv")
cooper_tags = df_cooper['tags'].tolist()

df_met = pd.read_csv("data/final/met/met_tags_full-collection.csv")
met_tags = df_met['value'].tolist()

df_science = pd.read_csv("data/final/smg/science-museum_terms_all-categories.csv") 
science_tags = df_science['value'].tolist()

df_tate = pd.read_csv('data/final/tate/tate-subject-terms.csv')
tate_tags = df_tate['term'].tolist()

#Load ID lookup lists -> no duplicates
cooper_id = np.load("data/final/cooper/cooper-hewitt_id-list_unique.npy", allow_pickle=True)
met_id = np.load("data/final/met/met_image-feature-id-list_unique.npy")
science_id = np.load("data/final/smg/science-museum_feature-id-list_2_unique.npy")
tate_id = np.load('data/final/tate/tate_image-id-list.npy')

#load image link lookup list for Tate
tate_image_links = pd.read_csv('data/final/tate/tate_sketchy_collections_metadata_selection.csv')

#Load text features V3 "an image of" -> normalised
cooper_text_features = np.load("data/final/cooper/cooper-hewitt_text-features_3_norm.npy")
met_text_features = np.load("data/final/met/met_text-features_3_norm.npy")
science_text_features = np.load("data/final/smg/science-museum_text-features_3_norm.npy")
tate_text_features = np.load("data/final/tate/tate_text-features.npy")

cooper_text_features = torch.from_numpy(cooper_text_features).to(device)
met_text_features = torch.from_numpy(met_text_features).to(device)
science_text_features = torch.from_numpy(science_text_features).to(device)
tate_text_features = torch.from_numpy(tate_text_features).to(device)

#Load image features -> no duplicates
cooper_img_features = np.load("data/final/cooper/cooper_image-features_unique.npy")
met_img_features = np.load("data/final/met/met_image-features_unique.npy")
science_img_features = np.load("data/final/smg/science-museum_image-features_2_unique.npy")
tate_img_features = np.load("data/final/tate/tate_image-features.npy")

cooper_img_features = torch.from_numpy(cooper_img_features).to(device)
met_img_features = torch.from_numpy(met_img_features).to(device)
science_img_features = torch.from_numpy(science_img_features).to(device)
tate_img_features = torch.from_numpy(tate_img_features).to(device)

#Make tag predictions for display 
cooper_tag_softmax = (100.0 * cooper_img_features @ cooper_text_features.T).softmax(dim=-1)
met_tag_softmax = (100.0 * met_img_features @ met_text_features.T).softmax(dim=-1)
science_tag_softmax = (100.0 * science_img_features @ science_text_features.T).softmax(dim=-1)
tate_tag_softmax = (100.0 * tate_img_features @ tate_text_features.T).softmax(dim=-1)

#Make tag features for matching
cooper_tag_features = (100.0 * cooper_img_features @ cooper_text_features.T).softmax(dim=-1)
cooper_tag_features /= cooper_tag_features.norm(dim=-1, keepdim=True)

met_tag_features = (100.0 * met_img_features @ met_text_features.T).softmax(dim=-1)
met_tag_features /= met_tag_features.norm(dim=-1, keepdim=True)

science_tag_features = (100.0 * science_img_features @ science_text_features.T).softmax(dim=-1)
science_tag_features /= science_tag_features.norm(dim=-1, keepdim=True)

tate_tag_features = (100.0 * tate_img_features @ tate_text_features.T).softmax(dim=-1)
tate_tag_features /= tate_tag_features.norm(dim=-1, keepdim=True)

#Put it all into dict to loop through
# museum_data = {"cooper": [cooper_tag_features, cooper_tag_softmax, cooper_text_features, cooper_tags, cooper_id],
#                "met": [met_tag_features, met_tag_softmax, met_text_features, met_tags, met_id],
#                "science": [science_tag_features, science_tag_softmax, science_text_features, science_tags, science_id]}

museum_data = {"tate": [tate_tag_features, tate_tag_softmax, tate_text_features, tate_tags, tate_id],
               "met": [met_tag_features, met_tag_softmax, met_text_features, met_tags, met_id],
               "science": [science_tag_features, science_tag_softmax, science_text_features, science_tags, science_id]}


#### GET PREDICTIONS

#Decode input image from base64
def decode_base64(base64_img):
    starter = base64_img.find(',')
    image_data = base64_img[starter+1:]
    image_data = bytes(image_data, encoding="ascii")
    image = base64.b64decode(image_data)
    return image


#Get image feature for input image
def predict_query(image):
    image_input = preprocess(Image.open(BytesIO(image))).unsqueeze(0).to(device)
    
  # Calculate features
    with torch.no_grad():
        image_feature = model.encode_image(image_input)
        
    image_feature /= image_feature.norm(dim=-1, keepdim=True)
    
    return image_feature



#Get top n matches for each museum -> get top IDs, query tags and match tags
def get_matches(image, museum_data=museum_data, tate_image_links=tate_image_links, results_count=9):

    #Setup dictionary -> will be JSON response that is sent back to client   
    # result = {"cooper": {}, "met": {}, "science": {}}
    result = {"tate": {}, "met": {}, "science": {}}
     
    #1. Get query image feature
    image_input = decode_base64(image)
    query_img_feature = predict_query(image_input)
    
    #Loop through each museum
    for i in museum_data:  
        tag_features = museum_data[i][0]
        tag_softmax = museum_data[i][1]
        text_features = museum_data[i][2]
        tags = museum_data[i][3]
        object_id = museum_data[i][4]
        
        #2. Get query tag feature and compare against collection tag features
        
        #not normalised for display
        query_tag_softmax = (100.0 * query_img_feature @ text_features.T).softmax(dim=-1)
        #normalise for to calculate matches (step one done again to not alter the previous variable)
        # query_tag_feature = (100.0 * query_img_feature @ text_features.T).softmax(dim=-1)
        # query_tag_feature /= query_tag_feature.norm(dim=-1, keepdim=True)
        
        #Get cosine similarity scores
        # similarities = (tag_features @ query_tag_feature.T).squeeze(1)
        similarities = (tag_softmax @ query_tag_softmax.T).squeeze(1)

        
        #Sort photos by similarity scores (top n -> e.g. top n to account for errors)
        best_idx = (-similarities).argsort()[:results_count]
        
        #Get match IDs
        matches = [object_id[i] for i in best_idx]
   
        #3. Get top 5 tags           
            
        #Put top 5 query tags into array
        query_tags = {}
        values, indices = query_tag_softmax[0].topk(5)
        for value, index in zip(values, indices):
            query_tags[tags[index]] = f"{100 * value.item():.2f}%"

        #Get top 5 tags for each match 
        match_tags = [] 
        for k in range(len(best_idx)): 
            match_id = best_idx[k]
            values, indices = tag_softmax[match_id].topk(5)

            one_tag = {}
            for value, index in zip(values, indices):
                one_tag[tags[index]] = f"{100 * value.item():.2f}%"
            match_tags.append(one_tag)

        #4. Add to dictionary

        result["{0}".format(i)]["top_id"] = matches
        result["{0}".format(i)]["top_tags"] = match_tags
        result["{0}".format(i)]["query_tags"] = query_tags

        #4. Add museum data (Tate)

        if i == 'tate':
            image_urls = []
            titles = []
            artwork_pages = []
            for j in matches:
                image_url = tate_image_links.loc[tate_image_links['id'] == j]['image'].values[0] 
                image_urls.append(image_url)
                title = tate_image_links.loc[tate_image_links['id'] == j]['title'].values[0] 
                titles.append(title)
                artwork_page = tate_image_links.loc[tate_image_links['id'] == j]['artwork_page'].values[0] 
                artwork_pages.append(artwork_page)

                result["{0}".format(i)]["image_url"] = image_urls
                result["{0}".format(i)]["title"] = titles
                result["{0}".format(i)]["artwork_page"] = artwork_pages

    return result
