"""
FIT5120: Onboarding project
Authors: Mandeep, Team TA18
Data wrangling on VIC road crash/accident datasets
"""

import os
import pandas as pd

import geojson as gj


def geojson_data_in_mem(file_path, method='LOAD', data=None):
    '''
    method to get or store the data in geojson format in the directory
    '''
    try:
        if method == 'LOAD':
            with open(file_path, 'r') as file:
                data = gj.load(file)    
            print('Loaded ', file_path)
            return data
        
        elif method == 'DUMP':
            with open(file_path, 'w') as file:
                gj.dump(data, file) 
            print('Saved ', file_path)
        else:
            print('Incorrect method for geojson')
    except:
        print('Geojson data file method is not executed')


def get_vicroad_bicyclist_crash(datadir_path):
    '''
    method to filter & save bicyclist crash data
    '''
    try:
        # crash data path
        data_path = datadir_path + 'VICTORIAN_ROAD_CRASH_DATA.geojson'

        # load data
        data = geojson_data_in_mem(data_path, method='LOAD')

        print('GeoJson file loaded w/ feature len:', len(data.features))#, 'properties:', data.features[0].properties)

        # bicyclist list
        list_features_bicyclist = []

        for i, feature in enumerate(data.features):
            if feature.properties["BICYCLIST"] != 0:
                list_features_bicyclist.append(feature.properties)

        # dataframe for bicyclist features
        df_properties = pd.DataFrame(list_features_bicyclist)

        # primary key subset
        subs_primary_key = ['ACCIDENT_NO', 'ACCIDENT_DATE', 'ACCIDENT_TIME', 'LATITUDE', 'LONGITUDE']

        # remove NA subset in subs_primary_key 
        df_properties.dropna(subset=subs_primary_key)

        # check for duplicacy & remove
        df_properties.drop_duplicates(subset=subs_primary_key)

        print('Number of filtered features for bicyclist crashes: ', len(df_properties))

        # save in csv
        df_properties.to_csv(datadir_path + 'VICroad_bicycle_crash.csv')

        # subset in csv
        df_properties[['ACCIDENT_NO', 'ACCIDENT_DATE', 'ACCIDENT_TIME', 'LATITUDE', 'LONGITUDE', \
                        'ROAD_GEOMETRY', 'SEVERITY', 'INJ_OR_FATAL']].to_csv(datadir_path + 'VICroad_bicycle_crash_subset.csv')

        print('Bicyclist crash data saved in ', datadir_path + 'VICroad_bicycle_crash.csv')
        print('Bicyclist crash data saved in ', datadir_path + 'VICroad_bicycle_crash_subset.csv')
    except:
        print('Data is not correct at ', datadir_path)


if __name__ == '__main__':
    # VIC road crash data path
    datadir_path = os.getcwd() + '/data/VIC_road_crash/'

    # wrangle crash dataset & get bicyclist features
    get_vicroad_bicyclist_crash(datadir_path)
