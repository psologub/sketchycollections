from flask import Flask, request, render_template, make_response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import model
from gevent.pywsgi import WSGIServer

#Set up app
app = Flask(__name__)
CORS(app)
api = Api(app)

# Argument parsing
arg_parser = reqparse.RequestParser()
arg_parser.add_argument('query_img', type=str, default=None)

#Create endpoint
class Index(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('index.html'),200,headers)
    
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
api.add_resource(Index, '/')

#Run app
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
    # http_server = WSGIServer((("0.0.0.0", 8000)), app)
    # http_server.serve_forever()




