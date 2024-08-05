"""
FIT5120: Onboarding project
Authors: Mandeep, Team TA18
API to fetch accident count, risk levels based on the latitute, longitude, datetime, time duration (history) & radius of circle from the client
"""

import os
import pandas as pd
from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
api = Api(app, prefix="/bicycle_crash/v1")

class Bicycle_crash(Resource):
    '''
    class for the requests related to the bicycle crash
    '''
    def __init__(self):
        '''
        class constructor
        '''
        self.location = {}
        self.format='json'
        self.b_from_csv=True
        self.parser = reqparse.RequestParser()


    def get(self, radius=0.5):
        '''
        GET request handler
        '''
        args = self.parser.parse_args()
        self.location['lat'] = args['lat']
        self.location['lon'] = args['lon']
        self.date = args['date']
        # self.time = time
        self.location = args['duration']
        try:
            self.raduis = args['radius']
        except:
            self.radius = radius
        self.data = self.get_bicyclist_crash_data()

        return self.get_accident_count()


    def get_bicyclist_crash_data(self, format='json'):
        '''
        method to read the bicyclist crash data
        '''
        # VIC road crash data path
        self.datadir_path = os.getcwd() + '/data/VIC_road_crash/'

        # read data from csv
        if self.b_from_csv:
            # load in dataframe 
            df_bicyclist_crash = pd.read_csv(self.datadir_path + 'VICroad_bicycle_crash_subset.csv')

            # select query for subset data as per request
            df_subset = df_bicyclist_crash[df_bicyclist_crash['ACCIDENT_DATE'] <= self.date and 
                            abs(df_bicyclist_crash['LATITUDE'] - self.location['lat']) <= self.raduis and 
                            abs(df_bicyclist_crash['LONGITUDE'] - self.location['lon']) <= self.raduis 
                            ][['ACCIDENT_DATE', 'LATITUDE', 'LONGITUDE', 'ROAD GEOMETRY', 'SEVERITY',
                               'INJ_OR_FATAL']]
            
            return df_subset

    def get_accident_count(self, threshold=0.01):
        '''
        method to get the accident count around a particular area based on datetime & duration
        '''
        # accident locations based on threshold
        df_accident_loc = self.data[['LATITUDE', 'LONGITUDE']].copy()
        df_accident_loc['LATITUDE'].apply(lambda x: int(x/threshold))
        df_accident_loc['LONGITUDE'].apply(lambda x: int(x/threshold))

        # accident count
        df_accident_count = df_accident_loc.groupby(by=['LATITUDE', 'LONGITUDE']).count()

        # save in csv
        df_accident_count.to_csv(self.datadir_path + 'bicycle_accident_count.csv')

        if self.format == 'json':
            return df_accident_count.to_json()
        else:
            return df_accident_count


class Bicyclist_risk(Bicycle_crash):
    '''
    class for the risk-levels around location 
    '''
    def __init__(self, location, b_from_csv=True):
        '''
        class constructor
        '''
        super().__init__(location, b_from_csv)



api.add_resource(Bicycle_crash, '/count')
# api.add_resource(Bicyclist_risk, '/risk')


if __name__ == '__main__':
    app.run(debug=True)