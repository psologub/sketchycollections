# Sketchy Collections 
 
Sketchy Collections is an image search tool using CLIP for feature extraction that makes it possible to explore select museum collections by drawing or uploading a picture. The tool analyses the query picture and images of museum objects, predicting text descriptions based on each museum's own terminology, and compares those to find the top match. It makes exploring both cultural heritage and AI technology more intuitive and fun! 

In the app, you can see the five top terms for both the sketch and the matching images. Each museum has its own vocabulary, some of which are tags made for the public or terms used for cataloguing the museum objects. When comparing the images and tags across different museums, we can see how the AI model sees images and how it describes them given different “languages” of museums. All of this is shaped by different factors: What was the model trained on initially? What objects are included in the museums? How do museums talk about their collections?

Demo: http://134.209.182.231:8000/

## Setup

1. Create a new virtual environment: `python3 -m venv venv`
2. Activate virtual environment: `source venv/bin/activate`
3. Install requirements from requirements.txt: `pip install -r requirements.txt`
4. Run Flask app: `python3 app.py`



