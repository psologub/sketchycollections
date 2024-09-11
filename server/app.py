from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import model

#Set up app
app = Flask(__name__)
CORS(app)
api = Api(app)

# Argument parsing
arg_parser = reqparse.RequestParser()
arg_parser.add_argument('query_img', type=str, default=None)

#Create endpoint
class MuseumRetriever(Resource):
    def post(self):
        #Set results count
        results_count = 9
        #Get parameters
        args = arg_parser.parse_args()
        query = args['query_img']

        match_data = model.get_matches(query, results_count=results_count)

        return {'match_data': match_data}

api.add_resource(MuseumRetriever, '/museum-retriever')

#Run app
if __name__ == "__main__":
    app.run(debug=True)



